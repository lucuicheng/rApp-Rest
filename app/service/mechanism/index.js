'use strict';
const template = require('../../../lib/common/template');
const Mechanism = require('../../../models/Mechanism');

/**
 * 机构API
 *
 * @param app
 */
module.exports = function (app) {

    const path = (part) => {
        return template.url('/api/mechanism', {part});
    };

    const handleError = (err) => {
        //TODO
        console.log(err)
    };

    /**
     * 机构创建检查
     */
    app.get(path('/check'), function (req, res) {
        let resp = '';
        const {code = '', businessLicenseCode = ''} = req.query;
        Mechanism.find({businessLicenseCode})
            .exec((err, docs) => {
                if (err) return handleError(err);
                docs.length > 0 ? resp = '已经创建过' : resp = '没有创建';//TODO 显示注册在哪个 机构 和 角色
                res.json({code: 200, body: resp});
            });
    });

    /**
     * 创建机构
     */
    app.post(path('/create'), function (req, res) {
        const {role, ...param} = req.body;
        const mechanism = new Mechanism({...param});
        mechanism.setInit();
        mechanism.save((err, doc) => {
            if (err) return handleError(err);
            res.json({code: 200, body: doc.getID()});
        });
    });

    /**
     * 移除机构
     */
    app.put(path('/remove'), function (req, res) {
        const {id = '', businessLicenseCode = '', active = 0} = req.body;
        Mechanism.findByIdAndUpdate(id, {active: 0, modifyDate: new Date()})
            .exec((err, doc) => {
                if (err) return handleError(err);
                res.json({code: 200, body: doc.getID()});
            });
    });

    /**
     * 更新机构
     */
    app.put(path('/update'), function (req, res) {
        const {id = '', businessLicenseCode = '', ...param} = req.body;
        Mechanism.findByIdAndUpdate(id, {...param, modifyDate: new Date()})
            .exec((err, doc) => {
                if (err) return handleError(err);
                res.json({code: 200, body: doc.getID()});
            });
    });

    /**
     * 机构列表
     */
    app.get(path('/list'), function (req, res) {
        const {id, ...param} = req.query;
        Mechanism.find({...param, active: 1})
            .exec((err, docs) => {
                if (err) return handleError(err);
                res.json({code: 200, body: docs});
            });
    });

    /**
     * 机构详情
     */
    app.get(path('/detail'), function (req, res) {
        const {id = ''} = req.query;
        Mechanism.findOne({_id: id, active: 1})
            .exec((err, doc) => {
                if (err) return handleError(err);
                res.json({code: 200, body: doc});
            });
    });

};

