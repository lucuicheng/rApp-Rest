'use strict';

const template = require('../../../lib/common/template');
const Customer = require('../../../models/Customer');

/**
 * 客户API
 *
 * @param app
 */
module.exports = function (app) {

    const path = (part) => {
        return template.url('/api/customer', {part});
    };

    /**
     * 客户链接
     */
    app.get(path('/link'), function (req, res) {
        let resp = {};
        res.json({code: 200, body: resp});
    });

};

