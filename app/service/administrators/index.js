'use strict';
const template = require('../../../lib/common/template');
const administrators = require('../../../models/Administrators');

const toGetParam = (json) => (
    Object.keys(json).map(function (key) {
        return key + '=' + json[key];
    }).join("&")
);

const handleError = (err) => {
    //TODO
    reject({msg: "", err})
};

/**
 * 用户APi
 *
 * @param app
 */
module.exports = {

    /**
     * 管理员列表
     */
    list: (query) => {
        return new Promise((resolve, reject) => {
            const {id, ...param} = query;
            administrators.find({...param, status: 1})
                .exec((err, docs) => {
                    if (err) return handleError(err, reject);
                    resolve({code: 200, body: docs})
                });
        })
    },

    /**
     * 管理员详情
     */
    detail: (req, res) => {
        const {id = ''} = req.query;
        administrators.findOne({_id: id, status: 1})
            .exec((err, doc) => {
                if (err) return handleError(err);
                res.json({code: 200, body: doc});
            });
    },

    /**
     * 更新管理员
     */
    update: (req, res) => {
        const {id = '', ...param} = req.body;
        administrators.findByIdAndUpdate(id, {...param, updateTime: new Date()})
            .exec((err, doc) => {
                if (err) return handleError(err);
                res.json({code: 200, body: doc.getID()});
            });
    },

    /**
     * 管理员注册
     */
    register: (req, res) => {
        let resp = {};
        const {...param} = req.body;
        const admin = new administrators({...param});
        admin.setInit();
        admin.save((err, doc) => {
            if (err) return handleError(err);
            if (doc) {
                resp = {status: '20201', msg: '注册成功', info: doc};
            } else {
                resp = {status: '20200', msg: '注册失败'}
            }
            res.json({code: 200, body: resp});
        });
    },

    /**
     * 管理员户注册检查
     */
    check: (req, res) => {
        let resp = '', param = req.query;
        const {password, ...checkParam} = param;
        administrators.find({...checkParam})
            .exec((err, docs) => {
                if (err) return handleError(err);
                docs.length > 0 ? resp = {status: '10201', msg: '已经注册过', info: docs[0]} : resp = {status: '10200', msg: '没有注册', info: docs[0]};
                res.json({code: 200, body: resp});
            });
    },

    /**
     * 作废管理员
     */
    useless: (req, res) => {
        const {id = '', status = 0} = req.body;
        administrators.findByIdAndUpdate(id, {status: 0, updateTime: new Date()})
            .exec((err, doc) => {
                if (err) return handleError(err);
                res.json({code: 200, body: doc.getID()});
            });
    },

    /**
     * 登录
     */
    login: (req, res) => {
        let resp = {};
        const {role, code, password = '', ...param} = req.query;
        const admin = new administrators({password});
        //TODO 需要实际的更加复杂的逻辑
        administrators.findOne({password: admin.encryption(), ...param})
            .select('-password')
            .exec((err, doc) => {
                if (err) return handleError(err);
                //docs.length > 0 ? resp = '已经注册过' : resp = '没有注册';
                doc ? resp = {status: '30201', msg: '登录成功', info: doc} : resp = {status: '30200', msg: '登录失败'};
                res.json({code: 200, body: resp});
            });
    },

    /**
     * 登出
     */
    logout: (req, res) => {
        let resp = {};
        res.json({code: 200, body: resp});
    },


    /**
     * 用户修改密码
     */
    password: (req, res) => {
        const {_id = '', password = ''} = req.body;
        const admin = new administrators({password});
        admin.findByIdAndUpdate(_id, {password: admin.encryption(), updateTime: new Date()})
            .exec((err, doc) => {
                if (err) return handleError(err);
                res.json({code: 200, body: doc.getID()});
            });
    },
}
