'use strict';

const fs = require("fs");

module.exports = function (app) {

    app.post('/api/function', function (req, res) {
        fs.readFile("mock/result.json", function (error, fileData) {
            if (error) {
                console.log('read err : ' + error);
            }

            let data;
            for (let key in req.body) {
                if (key == 'pci_SetOOBFWSlots') {
                    for (let i = 0; i < 50000; i++) {
                        console.log('test')
                    }
                }

                data = JSON.parse(fileData)[key];
            }
            res.json(data);

        });

    });

};
