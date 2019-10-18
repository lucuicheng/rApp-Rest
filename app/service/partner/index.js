'use strict';
const template = require('../../../lib/common/template');
const partner = require('../../../models/partner');
const treePath = require('../../../models/treePath');
const request = require('request');

/**
 * 用户APi
 *
 * @param app
 */
module.exports = function (app) {

    const path = (part) => {
        return template.url('/api/partner', {part});
    };

    const handleError = (err) => {
        //TODO
        console.log(err)
    };

    const toGetParam = (json) => (
        Object.keys(json).map(function (key) {
            return key+ '=' + json[key];
        }).join("&")
    );

    /**
     * 合伙人列表
     */
    app.get(path('/list'), function (req, res) {
        const {id, ...param} = req.query;
        partner.find({...param, status: 1})
            .exec((err, docs) => {
                if (err) return handleError(err);
                res.json({code: 200, body: docs});
            });
    });

    /**
     * 合伙人详情
     */
    app.get(path('/detail'), function (req, res) {
        const {id = ''} = req.query;
        partner.findOne({_id: id, status: 1})
            .exec((err, doc) => {
                if (err) return handleError(err);
                res.json({code: 200, body: doc});
            });
    });

    /**
     * 更新合伙人
     */
    app.put(path('/update'), function (req, res) {
        const {id = '', ...param} = req.body;
        partner.findByIdAndUpdate(id, {...param, updateTime: new Date()})
            .exec((err, doc) => {
                if (err) return handleError(err);
                res.json({code: 200, body: doc.getID()});
            });
    });

    /**
     * 更新推荐合伙人
     */
    app.put(path('/parentPhone/update'), function (req, res) {
        const {id = '', parentPhone = '', ...otherParam} = req.body;
        partner.findOne({_id: id, status: 1})
            .exec((err, doc) => {
                if (err) return handleError(err);
                if(doc && doc.parentPhone != null && doc.parentPhone != undefined && doc.parentPhone != ''){//更新
                    partner.findByIdAndUpdate(id, {parentPhone: parentPhone, updateTime: new Date()})
                        .exec((err, doc) => {
                            if (err) return handleError(err);
                            modifyNode(doc.parentPhone, parentPhone);
                            res.json({code: 200, body: doc.getID()});
                        });
                }else{//创建
                    partner.findByIdAndUpdate(id, {parentPhone: parentPhone, updateTime: new Date()})
                        .exec((err, doc) => {
                            if (err) return handleError(err);
                            repeatPath(parentPhone, doc.phone);
                            res.json({code: 200, body: doc.getID()});
                        });
                }
            });

    });

    /**
     * 合伙人注册
     */
    app.post(path('/register'), function (req, res) {
        let resp = {};
        const {parentPhone, ...param} = req.body;
        const partnerObj = new partner({...param, parentPhone: ''});
        partnerObj.setInit();
        partnerObj.save((err, doc) => {
            if (err) return handleError(err);
            if (doc){
                resp = {status: '20201', msg: '注册成功', info: doc};
                addSelf(doc.phone);
            }else{
                resp = {status: '20200', msg: '注册失败'}
            }
            res.json({code: 200, body: resp});
        });
    });

    /**
     * 合伙人户注册检查
     */
    app.get(path('/check'), function (req, res) {
        let resp = '', param = req.query;
        const {password, ...checkParam} = param;
        partner.find({...checkParam})
            .exec((err, docs) => {
                if (err) return handleError(err);
                //docs.length > 0 ? resp = '已经注册过' : resp = '没有注册';
                docs.length > 0 ? resp = {status: '10201', msg: '已经注册过'} : resp = {status: '10200', msg: '没有注册'};
                res.json({code: 200, body: resp});
            });
    });

    /**
     * 作废合伙人
     */
    app.put(path('/useless'), function (req, res) {
        const {id = '', status = 0} = req.body;
        partner.findByIdAndUpdate(id, {status: 0, updateTime: new Date()})
            .exec((err, doc) => {
                if (err) return handleError(err);
                res.json({code: 200, body: doc.getID()});
            });
    });

    /**
     * 登录
     */
    app.get(path('/login'), function (req, res) {
        let resp = {};
        const {role, code, ...param} = req.query;
        //TODO 需要实际的更加复杂的逻辑
        partner.findOne({...param})
            .select('-password')
            .exec((err, doc) => {
                if (err) return handleError(err);
                //docs.length > 0 ? resp = '已经注册过' : resp = '没有注册';
                doc ? resp = {status: '30201', msg: '登录成功', info: doc} : resp = {status: '30200', msg: '登录失败'};
                res.json({code: 200, body: resp});
            });
    });

    /**
     * 登出
     */
    app.get(path('/logout'), function (req, res) {
        let resp = {};
        res.json({code: 200, body: resp});
    });

    /**
     * 用户绑定微信帐号
     */
    app.put(path('/bind'), function (req, res) {
        const {id = '', weChatID = '', weChatName = ''} = req.body;
        partner.findByIdAndUpdate(id, {weChatID, weChatName, updateTime: new Date()})
            .exec((err, doc) => {
                if (err) return handleError(err);
                res.json({code: 200, body: doc.getID()});
            });
    });

    /**
     * 用户录入信息
     */
    app.put(path('/info'), function (req, res) {
        const {id = '', password = '', weChatID = '', weChatName = '', ...param} = req.body;
        partner.findByIdAndUpdate(id, {...param, updateTime: new Date()})
            .exec((err, doc) => {
                if (err) return handleError(err);
                res.json({code: 200, body: doc.getID()});
            });
    });

    /**
     * 用户更新头像图片
     */
    app.put(path('/avatar'), function (req, res) {
        const {id = '', headImg = ''} = req.body;
        partner.findByIdAndUpdate(id, {headImg: headImg, updateTime: new Date()})
            .exec((err, doc) => {
                if (err) return handleError(err);
                res.json({code: 200, body: doc.getID()});
            });
    });

    /**
     * 用户修改密码
     */
    app.put(path('/password'), function (req, res) {
        const {_id = '', password = ''} = req.body;
        const partner = new partner({password});
        partner.findByIdAndUpdate(_id, {password: partner.encryption(), updateTime: new Date()})
            .exec((err, doc) => {
                if (err) return handleError(err);
                res.json({code: 200, body: doc.getID()});
            });
    });

    /*
    * 用户查询当前用户有多少个直属节点
    * */
    app.get(path('/subNode', function (req, res) {
        const {_id = '', ...param} = req.query;
        treePath.find({'ancPartnerUuid': _id, distance: 1})
            .exec((err, docs) => {
                if(err) return handleError(err);
                res.json({code:200, body: docs.length})
            })
    }));

    /*
    * 用户查询当前用户有多少个子节点
    */
    app.get(path('/subNode', function (req, res) {
        const {_id = '', ...param} = req.query;
        treePath.find({'ancPartnerUuid': _id, distance: {$gt: 0}})
            .exec((err, docs) => {
                if(err) return handleError(err);
                res.json({code:200, body: docs.length})
            })
    }));

    /*
    * 查询有提现需求的合伙人
    * */
    app.get(path('/withdraw'), function (req, res) {
        const {id, ...param} = req.query;
        partner.find({...param, status: 1, withdrawStatus: 1})
            .exec((err, docs) => {
                if (err) return handleError(err);
                res.json({code: 200, body: docs});
            });
    });

    /*
    * 合伙人提现明细
    * */
    app.get(path('/withdraw/detail'), function (req, res) {
        const {id, ...param} = req.query;
        partner.find({...param, status: 1, withdrawStatus: 2})
            .exec((err, docs) => {
                if (err) return handleError(err);
                res.json({code: 200, body: docs});
            });
    });


    app.get(path('/getLink'), function (req, res) {
        let resp = '', param = req.query;
        const params = {"mobile": param.phone, "applyNo": param.applyNo};
        const url = "http://www.kaworen88.com:8082/partner";
        request({
            url: url,
            method: "POST",
            json: true,
            headers: {
                "content-type": "application/json",
            },
            body: params
        }, function(error, response, body) {
            if (error) return handleError(error);
            res.json({code: 200, body: body});
        });
    })
};

/*********操作treePath的具体方法*************/
/***
 * 注册用户是添加自身节点
 * */

function addSelf(partnerId) {
    let param = {};
    param['ancPartnerPhone'] = partnerId;
    param['desPartnerPhone'] = partnerId;
    param['distance'] = 0;
    const treePathObj = new treePath({...param});
    treePathObj.save((err, doc) => {
        if (err) return handleError(err);
        return  doc ?  0 :  -1;
    });
}

function addNode(ancPhone, desPhone, distance){
    let param = {};
    param['ancPartnerPhone'] = ancPhone;
    param['desPartnerPhone'] = desPhone;
    param['distance'] = distance;
    const treePathObj = new treePath({...param});
    treePathObj.save((err, doc) => {
        if (err) return handleError(err);
        return  doc ?  0 :  -1;
    });
}

/***
 * 删除节点： step1:查询要删除节点A为父节点的所有节点， step2: 将以step1得到所有节点为子节点的数据（除以A节目的为父节点的数据外）全部删除
 * */

function deleteNode(selfNodePhone){
    let nodes = [];
    treePath.find({"ancPartnerPhone": selfNodePhone})
        .exec((err, docs) => {
            if (err) return handleError(err);
            docs.length >= 1 && docs.map((item, index) => {
                if(nodes.includes(item.desPartnerPhone)){
                    nodes.push(item.desPartnerPhone);
                }
            })
        });

    nodes.map((item, index) => {
        treePath.find({"desPartnerPhone": item})
            .exec((err, docs) => {
                if (err) return handleError(err);
                docs.length >= 1 && docs.map((doc, index) => {
                    nodes.map((node, index) => {
                        if(doc.ancPartnerPhone != node){
                            treePath.deleteOne({_id: doc._id});
                        }
                    })
                })
            });
    });
}

function modifyNode(oldPhone, parentPhone){
    treePath.find({"ancPartnerPhone": oldPhone})
        .exec((err, docs) => {
            console.log("docs = " + JSON.stringify(docs));
            if (err) return handleError(err);
            docs.length >= 1 && docs.map((item, index) => {
                if(item.distance != 0){
                    treePath.findByIdAndUpdate(item._id, {ancPartnerPhone: parentPhone})
                        .exec((err, docs) => {
                            if (err) return handleError(err);
                        })
                }
            })
        });

    treePath.find({"desPartnerPhone": oldPhone})
        .exec((err, docs) => {
            console.log("docs = " + JSON.stringify(docs));
            if (err) return handleError(err);
            docs.length >= 1 && docs.map((item, index) => {
                if(item.distance != 0) {
                    treePath.findByIdAndUpdate(item._id, {desPartnerPhone: parentPhone})
                        .exec((err, docs) => {
                            if (err) return handleError(err);
                        })
                }
            })
        });
}

/*
* 循环添加路径, 只要子节点为desId，全部插入一条新增的
* */
function repeatPath(parentPhone, selfNodePhone) {
    if(parentPhone != undefined && parentPhone != null && parentPhone != ""){
        treePath.find({'desPartnerPhone': parentPhone})
            .exec((err, docs) => {
                if (err) return handleError(err);
                docs.map((item, index) => {
                    addNode(item.desPartnerPhone, selfNodePhone, parseInt(item.distance) + 1);
                })
            });
    }
}
