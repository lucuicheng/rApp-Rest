'use strict';
const template = require('../../../lib/common/template');
const Record = require('../../../models/Record');

/**
 * 订单API
 *
 * @param app
 */
module.exports = function (app) {

    const path = (part) => {
        return template.url('/api/record', {part});
    };

    const handleError = (err) => {
        //TODO
        console.log(err)
    };


    /**
     * 创建订单（作为接口测试使用）
     */

    app.post(path('/create'), function (req, res) {
        let resp = {};
        const param = req.body;
        const RecordObj = new Record(param);
        RecordObj.setInit();
        RecordObj.save((err, doc) => {
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
     * 作废订单
     */
    app.put(path('/useless'), function (req, res) {
        const {id = '',active = 0} = req.body;
        Record.findByIdAndUpdate(id, {active: 0, modifyDate: new Date()})
            .exec((err, doc) => {
                if (err) return handleError(err);
                res.json({code: 200, body: doc.getID()});
            });
    });

    /**
     * 更新订单
     */
    app.put(path('/update'), function (req, res) {
        const {id = '', cardType = '', ...param} = req.body;
        Record.findByIdAndUpdate(id, {param, modifyDate: new Date()})
            .exec((err, doc) => {
                if (err) return handleError(err);
                res.json({code: 200, body: doc.getID()});
            });
    });

    /**
     * 订单列表
     */
    app.get(path('/list'), function (req, res) {
        const {id, ...param} = req.query;
        Record.find({...param, active: 1})
            .exec((err, docs) => {
                if (err) return handleError(err);
                res.json({code: 200, body: docs});
            });
    });

    /**
     * 订单详情
     */
    app.get(path('/detail'), function (req, res) {
        const {id = ''} = req.query;
        Record.findOne({_id: id})
            .exec((err, doc) => {
                if (err) return handleError(err);
                res.json({code: 200, body: doc});
            });
    });

};

