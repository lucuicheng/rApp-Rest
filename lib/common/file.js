const fs = require("fs");
const readline = require('readline');

module.exports = function () {

    return {
        'read': function (file, encoding) {
            return new Promise(function (resolve, reject) {
                fs.readFile(file, encoding, function (err, data) {
                    if (err) reject(err); //
                    else resolve(data); //
                });
            });
        },
        "readFileToArray": function (path) {
            const rl = readline.createInterface({
                input: fs.createReadStream(path),
                crlfDelay: Infinity
            });

            let content = [];

            rl.on('line', (line) => {
                content.push(line);
            });

            return new Promise(function (resolve, reject) {
                rl.on('close', () => {
                    resolve(content);
                });
            });
        },
        "copy": function (src, dist, fh, cb) {
            const that = this;
            fs.readdir(src, function (err, paths) {
                if (err) {
                    cb(err)
                } else {
                    paths.forEach(function (path) {
                        const _src = src + '/' + path;
                        const _dist = dist + '/' + path;
                        fs.stat(_src, function (err, stat) {
                            if (err) {
                                cb(err);
                            } else {
                                // 判断是文件还是目录
                                if (stat.isFile()) {
                                    if (fh) {
                                        fs.writeFileSync(_dist, fh(path, _src), [{flags: 'w'}]);
                                    } else {
                                        fs.writeFileSync(_dist, fs.readFileSync(_src), [{flags: 'w'}]);
                                    }
                                } else if (stat.isDirectory()) {
                                    // 当是目录是，递归复制
                                    that.copyDir(_src, _dist, fh, cb)
                                }
                            }
                        })
                    })
                }
            })
        },
        'copyDir': function (src, dist, handle, callback) {
            const that = this;
            fs.access(dist, function (err) {
                if (err) {
                    // 目录不存在时创建目录
                    fs.mkdirSync(dist);
                }
                that.copy(src, dist, handle, callback);
            });
        },
        'rename': function (tempPath, userImageDir) {
            return new Promise(function (resolve, reject) {
                fs.rename(tempPath, userImageDir, function (err, data) {
                    if (err) reject(err); //
                    else resolve(data); //
                });
            });
        },
        "write": function(file, data) {
            const that = this;
            return new Promise(function (resolve, reject) {
                fs.writeFile(file, data, function (err, data) {
                    resolve(data);
                });
            });
        }
    }
};
