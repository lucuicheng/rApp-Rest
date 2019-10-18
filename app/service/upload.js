'use strict';
module.exports = function (app) {
    app.post('/upload', function (req, res) {
        let data = {
            "items": [
                {
                    "name": "imm_fod.license",
                    "path": "/pstorage/ftpupload/fw/002347001",
                    "size": "6051"
                }
            ]
        };
        res.json(data);
    });
};

