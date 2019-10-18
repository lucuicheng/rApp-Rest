'use strict';
const template = require('../../../lib/common/template');
const commission = require('../../../models/Commission');

/**
 * 用户APi
 *
 * @param app
 */
module.exports = function (app) {

    const path = (part) => {
        return template.url('/api/commission', {part});
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
     * 体现列表
     */
    app.get(path('/list'), function (req, res) {
        const {id, ...param} = req.query;
        commission.find({...param, status: 1})
            .exec((err, docs) => {
                if (err) return handleError(err);
                res.json({code: 200, body: docs});
            });
    });

    /**
     * 佣金详情
     */
    app.get(path('/detail'), function (req, res) {
        const {id = ''} = req.query;
        commission.findOne({_id: id, status: 1})
            .exec((err, doc) => {
                if (err) return handleError(err);
                res.json({code: 200, body: doc});
            });
    });

    /**
     * 更新佣金
     */
    app.put(path('/update'), function (req, res) {
        const {id = '', ...param} = req.body;
        commission.findByIdAndUpdate(id, {...param, updateTime: new Date()})
            .exec((err, doc) => {
                if (err) return handleError(err);
                res.json({code: 200, body: doc.getID()});
            });
    });

    /**
     * 佣金注册
     */
    app.post(path('/create'), function (req, res) {
        let resp = {};
        const {...param} = req.body;
        const commissionObj = new commission({...param});
        commissionObj.setInit();
        commissionObj.save((err, doc) => {
            if (err) return handleError(err);
            if (doc){
                resp = {status: '20201', msg: '注册成功', info: doc};
            }else{
                resp = {status: '20200', msg: '注册失败'}
            }
            res.json({code: 200, body: resp});
        });
    });

    /**
     * 作废佣金
     */
    app.put(path('/useless'), function (req, res) {
        const {id = '', status = 0} = req.body;
        commission.findByIdAndUpdate(id, {status: 0, updateTime: new Date()})
            .exec((err, doc) => {
                if (err) return handleError(err);
                res.json({code: 200, body: doc.getID()});
            });
    });

};
