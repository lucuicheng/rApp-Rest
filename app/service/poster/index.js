'use strict';
const template = require('../../../lib/common/template');
const poster = require('../../../models/poster');

/**
 * 用户APi
 *
 * @param app
 */
module.exports = function (app) {

    const path = (part) => {
        return template.url('/api/poster', {part});
    };

    const handleError = (err) => {
        //TODO
        console.log(err)
    };

    /**
     * 信用卡列表
     */
    app.get(path('/list'), function (req, res) {
        const {id, ...param} = req.query;
        poster.find({...param, status: 1})
            .exec((err, docs) => {
                if (err) return handleError(err);
                res.json({code: 200, body: docs});
            });
    });
    /**
     * 添加信用卡
     */
    app.post(path('/create'), function (req, res) {
        let resp = {};
        const {...param} = req.body;
        const posterObj = new poster({...param});
        posterObj.setInit();
        posterObj.save((err, doc) => {
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
     * 信用卡详情
     */
    app.get(path('/detail'), function (req, res) {
        const {id = ''} = req.query;
        poster.findOne({_id: id, status: 1})
            .exec((err, doc) => {
                if (err) return handleError(err);
                res.json({code: 200, body: doc});
            });
    });

    /**
     * 更新
     */
    app.put(path('/update'), function (req, res) {
        const {id = '', ...param} = req.body;
        poster.findByIdAndUpdate(id, {...param, updateTime: new Date()})
            .exec((err, doc) => {
                if (err) return handleError(err);
                res.json({code: 200, body: doc.getID()});
            });
    });
    /**
     * 作废信用卡
     */
    app.put(path('/useless'), function (req, res) {
        const {id = '', status = 0} = req.body;
        poster.findByIdAndUpdate(id, {status: 0, updateTime: new Date()})
            .exec((err, doc) => {
                if (err) return handleError(err);
                res.json({code: 200, body: doc.getID()});
            });
    });

};
