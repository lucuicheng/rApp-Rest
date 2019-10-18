'use strict';

const file = require('../../lib/common/file');
const process = require('../../lib/system/process');
const fs = require('fs');

const path = require('path');
const multipart = require('connect-multiparty');
const multipartMiddleware = multipart();

module.exports = function (app) {

    app.post('/api/system/conf', function (req, res) {
        const result = {};
        const param = req.body.confPath;
        //get ngnix config
        if (typeof param != 'undefined' && param != '') {

            file().read(param)
                .then(function (data) {
                    result.config = data.toString("utf-8");
                    res.json({'result': result});

                }, function (error) {
                    console.error(error)
                });
        }
    });

    app.post('/api/system/processes', function (req, res) {
        const result = {};
        //get ngnix status
        const isEmpty = function (value) {//TODO Add to lib
            return typeof value == 'undefined' || value == '';
        };

        const installPath = req.body.installPath;
        const pname = installPath.substr(installPath.lastIndexOf('\\') + 1, installPath.lastIndexOf('.'));
        if (!isEmpty(pname)) {
            process().taskList(pname).then(function (data) {
                result.processes = data;
                result.count = data.length;
                res.json({'result': result});
            }, function (error) {
                console.error(error)
            });
        }
    });

    app.post('/api/system/processes/execute', function (req, res) {
        const result = {};
        //get ngnix status
        const isEmpty = function (value) {//TODO Add to lib
            return typeof value == 'undefined' || value == '';
        };

        const installPath = req.body.installPath,
            execute = req.body.execute,
            pname = req.body.pname;
        let option;

        if (!isEmpty(pname) && !isEmpty(execute)) {
            if ('start' == execute) {//TODO use switch
                option = []
            }
            if ('stop' == execute) {
                option = ['-s', 'stop'];
            }
            if ('reload' == execute) {
                option = ['-s', 'reload'];
            }
            process().action(installPath, pname, option).then(function (data) {
                res.json({'result': data});
            }, function (error) {
                console.error(error)
            });
        }
    });

    app.post('/api/system/processes/kill', function (req, res) {
        const result = {};
        //get ngnix status
        const isEmpty = function (value) {//TODO Add to lib
            return typeof value == 'undefined' || value == '' || tag == null;
        };

        const pid = req.body.pid,
            pname = req.body.pname;
        let tag = '';

        if (isEmpty(pid) || isEmpty(pname)) {
            tag += isEmpty(pid) ? '' : pid;
            tag += isEmpty(pname) ? '' : pname;
        }

        if (!isEmpty(tag)) {
            process().kill(tag).then(function (data) {
                res.json({'result': data});
            }, function (error) {
                console.error(error)
            });
        }
    });

    app.post('/api/system/upload', multipartMiddleware, function (req, res) {
        // const IMG_PATH = __dirname+"/../../resources/images/";//修改为上传到图片服务器的文件地址
        const IMG_PATH = "/opt/resources/images/";//修改为上传到图片服务器的文件地址

        let data = req.body.data;
        let d = new Date();
        let getDate = `${d.getFullYear()}${d.getMonth() + 1}${d.getDate()}${d.getHours()}${d.getMinutes()}${d.getMinutes()}`;

        let fileName = getDate+req.body.fileName;
        let newImgPath = IMG_PATH+fileName;

        base64_decode(data, newImgPath);//编码格式转换

        req.body.path = newImgPath;
        req.body.fileName = fileName;
        res.json({code: 200, "body": req.body,});
    });

};

// 把图片转换为base64编码
function base64_encode(file) {
    let bitmap = fs.readFileSync(file);
    console.log('******** 图片转为编码 ********');
    return new Buffer(bitmap).toString('base64');
}

// 将base64编码转换为图片
function base64_decode(base64str, file) {
    let bitmap;
    if (Buffer.from && Buffer.from !== Uint8Array.from) {
        bitmap = Buffer.from(base64str, 'base64');
    } else {
        if (typeof base64str === 'number') {
            throw new Error('The "size" argument must be not of type number.');
        }
        bitmap = new Buffer(base64str, 'base64');
    }
    // let bitmap = new Buffer(base64str, 'base64');
    fs.writeFileSync(file, bitmap);
    console.log('******** 编码已转换为图片 ********');
    return true;
}
