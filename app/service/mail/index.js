'use strict';
const template = require('../../../lib/common/template');
const mail = require('../../../models/Mail');

/**
 * 用户APi
 *
 * @param app
 */
module.exports = function (app) {

    const path = (part) => {
        return template.url('/api/mail', {part});
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
     * 站内信列表
     */
    app.get(path('/list'), function (req, res) {
        const {id, ...param} = req.query;
        mail.find({...param, status: 1})
            .exec((err, docs) => {
                if (err) return handleError(err);
                res.json({code: 200, body: docs});
            });
    });

    /**
     * 查询单个用户所有列表，并排序
     */
    app.get(path('/list/sort'), function (req, res) {
        const {id, partnerId = "", ...param} = req.query;
        let flags = [];
        mail.find({...param, partnerId: partnerId, status: 1})
            .exec((err, docs) => {
                if (err) return handleError(err);
                if(docs.length>1){
                    flags = docs.sort(keysort("addTime", false));
                    res.json({code: 200, body: flags});
                }else{
                    res.json({code: 200, body: docs});
                }
            });
    });

    /**
     * 站内信详情
     */
    app.get(path('/detail'), function (req, res) {
        const {id = ''} = req.query;
        mail.findOne({_id: id, status: 1})
            .exec((err, doc) => {
                if (err) return handleError(err);
                res.json({code: 200, body: doc});
            });
    });

    /**
     * 更新站内信
     */
    app.put(path('/update'), function (req, res) {
        const {id = '', ...param} = req.body;
        mail.findByIdAndUpdate(id, {...param, updateTime: new Date(), returnState: 1})
            .exec((err, doc) => {
                if (err) return handleError(err);
                res.json({code: 200, body: doc.getID()});
            });
    });

    /**
     * 站内信创建
     */
    app.post(path('/create'), function (req, res) {
        let resp = {};
        const {partnerId, partnerPhone, ...param} = req.body;
        const mailObj = new mail({...param, partnerId: partnerId, partnerPhone: partnerPhone});
        mailObj.setInit();
        mailObj.save((err, doc) => {
            if (err) return handleError(err);
            if (doc){
                resp = {status: '20201', msg: '创建成功', info: doc};
            }else{
                resp = {status: '20200', msg: '创建失败'}
            }
            res.json({code: 200, body: resp});
        });
    });

    /**
     * 站内信户创建检查
     */
    app.get(path('/check'), function (req, res) {
        let resp = '', param = req.query;
        const {partnerId='', ...checkParam} = param;
        mail.find({...checkParam})
            .exec((err, docs) => {
                if (err) return handleError(err);
                docs.length > 0 ? resp = {status: '10201', msg: '已经创建过'} : resp = {status: '10200', msg: '没有创建'};
                res.json({code: 200, body: resp});
            });
    });

    /**
     * 作废站内信
     */
    app.put(path('/useless'), function (req, res) {
        const {id = '', status = 0} = req.body;
        mail.findByIdAndUpdate(id, {status: 0, updateTime: new Date()})
            .exec((err, doc) => {
                if (err) return handleError(err);
                res.json({code: 200, body: doc.getID()});
            });
    });
};

/**
 * @param key （以什么进行排序）
 * @param sortType true肾虚排列 false为降序排列
 * @returns {function(*, *): boolean}
 */

function keysort(key,sortType){
    return function(a,b){
        return sortType ? (a[key]<b[key]) : (a[key]>b[key]);
    }
}
