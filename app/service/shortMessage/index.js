'use strict';
const request = require('request');
const domain = 'http://114.255.71.158:8061';
const template = require('../../../lib/common/template');
/**
 * 短信验证码接口
 *
 * @param app
 */
module.exports = function (app) {

    const path = (part) => {
        return template.url('/api/shortMessage', {part});
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
     * 短信验证码获取链接
     */
    app.post(path('/verificationCode'), function (req, res) {
        let resp = '', param = req.body;
        const params = {epid: '125727', linkid: '', phone: param.phone, username: 'kwwl', password: 'Kwwl34220', subcode: '', message: '您的验证码为：' + param.code + '，如非本人操作，请忽略此信息。'};

        request(encodeURI(domain + '?' + toGetParam(params)), function (err, response, body) {
            if (err) return handleError(err);
            if (response.statusCode == 200) {
                res.json({code: 200, body: body});
            }
        });
    })
};

