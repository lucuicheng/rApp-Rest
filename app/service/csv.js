'use strict';

const fs = require("fs");
const data = require('../../lib/common/data');

module.exports = function (app) {
    app.get('/api/csv/group', function (req, res) {
        const params = req.query.params;
        data.groupCSVData('D:\\lucuicheng\\Download\\monitor.csv', 'ip_addr')
            .then((resp) => {
                res.json({code: 200, body: resp});
            });
    });

    app.post('/api/csv/column', function (req, res) {
        const {groupKeyValue = '', columns = []} = req.body;
        const groupedData = data.groupCSVData('D:\\lucuicheng\\Download\\monitor.csv', 'ip_addr');

        data.specifyPromisedGroupedColumnData(groupedData, groupKeyValue, columns)
            .then((resp) => {
                res.json({code: 200, body: resp});
            });
    });

    app.post('/api/csv/series', function (req, res) {
        const {groupKeyValue = '', columns = []} = req.body;
        const groupedData = data.groupCSVData('D:\\lucuicheng\\Download\\monitor.csv', 'ip_addr');

        data.specifyPromisedGroupedColumnData(groupedData, groupKeyValue, columns)
            .then((resp) => {
                res.json({code: 200, body: resp});
            });
    });
};

