'use strict';
const template = require('../../../lib/common/template');
const newsList = require('../../../models/newsList');

/**
 * 用户APi
 *
 * @param app
 */
module.exports = function (app) {

    const path = (part) => {
        return template.url('/api/news', {part});
    };

    const handleError = (err) => {
        //TODO
        console.log(err)
    };

    /**
     * 新闻列表
     */
    app.get(path('/list'), function (req, res) {
        const {id, ...param} = req.query;
        newsList.find({...param, status: 1})
            .exec((err, docs) => {
                if (err) return handleError(err);
                res.json({code: 200, body: docs});
            });
    });
    /**
     * 添加新闻
     */
    app.post(path('/create'), function (req, res) {
        let resp = {};
        const {...param} = req.body;
        const newsObj = new newsList({...param});
        newsObj.setInit();
        newsObj.save((err, doc) => {
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
     * 新闻详情
     */
    app.get(path('/detail'), function (req, res) {
        const {id = ''} = req.query;
        newsList.findOne({_id: id, status: 1})
            .exec((err, doc) => {
                if (err) return handleError(err);
                res.json({code: 200, body: doc});
            });
    });

    /**
     * 更新新闻
     */
    app.put(path('/update'), function (req, res) {
        const {id = '', ...param} = req.body;
        newsList.findByIdAndUpdate(id, {...param, updateTime: new Date()})
            .exec((err, doc) => {
                if (err) return handleError(err);
                res.json({code: 200, body: doc.getID()});
            });
    });
    /**
     * 作废新闻
     */
    app.put(path('/useless'), function (req, res) {
        const {id = '', status = 0} = req.body;
        newsList.findByIdAndUpdate(id, {status: 0, updateTime: new Date()})
            .exec((err, doc) => {
                if (err) return handleError(err);
                res.json({code: 200, body: doc.getID()});
            });
    });

};
