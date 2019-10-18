'use strict';

const template = require('../../../lib/common/template');
const request = require('request');
/**
 * 用户APi
 *
 * @param app
 */
module.exports = function (app) {

    const path = (part) => {
        return template.url('/api/wechat', {part});
    };

    const handleError = (err) => {
        console.log(err)
    };

    const toGetParam = (json) => (
        Object.keys(json).map(function (key) {
            return encodeURIComponent(key) + "=" + encodeURIComponent(json[key]);
        }).join("&")
    );

    /**
     * 微信获取token
     */
    app.get(path('/access_token'), function (req, res) {
        let resp = '', param = req.query;

        param.appid = 'wx985d5f615a86a2de';
        param.secret = 'eb43ec413da1561debfccbfa8a5fb299';
        param.grant_type = 'authorization_code';

        request('https://api.weixin.qq.com/sns/oauth2/access_token' + '?' + toGetParam(param), function (err, response, body) {
            if (err) return handleError(err)
            if (response.statusCode == 200) {
                res.json({code: 200, body: JSON.parse(body)});
            }
        })
    });

    /**
     * 微信刷新token
     */
    app.get(path('/refresh_token'), function (req, res) {
        let resp = {};
        const {role, ...param} = req.query;

        param.appid = 'wx985d5f615a86a2de';
        param.grant_type = 'refresh_token';

        request('https://api.weixin.qq.com/sns/oauth2/refresh_token' + '?' + toGetParam(param), function (err, response, body) {
            if (err) return handleError(err)
            if (response.statusCode == 200) {
                res.json({code: 200, body: JSON.parse(body)});
            }
        })
    });

    /**
     * 微信校验token
     */
    app.get(path('/check_token'), function (req, res) {
        let resp = {};
        const {role, ...param} = req.query;
        request('https://api.weixin.qq.com/sns/auth' + '?' + toGetParam(param), function (err, response, body) {
            if (err) return handleError(err)
            if (response.statusCode == 200) {
                res.json({code: 200, body: JSON.parse(body)});
            }
        })
    });

    /**
     * 微信获取用户列表
     */
    app.get(path('/user_info'), function (req, res) {
        const param = req.query;

        param.lang = 'zh_CN ';

        request('https://api.weixin.qq.com/sns/userinfo' + '?' + toGetParam(param), function (err, response, body) {
            if (err) return handleError(err)
            if (response.statusCode == 200) {
                res.json({code: 200, body: JSON.parse(body)});
            }
        })
    });
};

