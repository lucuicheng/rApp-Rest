'use strict';
const template = require('../../../lib/common/template');
const operationHistory = require('../../../models/operationHistory');

/**
 * 用户APi
 *
 * @param app
 */
module.exports = function (app) {
    const path = (part) => {
        return template.url('/api/operationHistory', {part});
    };

    const handleError = (err) => {
        //TODO
        console.log(err)
    };

    /**
     * 记录操作日志
     * userId: String, //操作用户ID
     operations: String, //具体操作
     creditCardId: String, //信用卡id
     */
    app.post(path('/record'), function (req, res) {
        const { ...param} = req.body;
        const history = new operationHistory({...param});
        history.setInit();
        history.save((err, doc) => {
            if (err) return handleError(err);
            res.json({code: 200, body: doc});
        });
    });
};
