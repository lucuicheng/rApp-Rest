const os = require("os");
const process = require("process");
const c_p = require('child_process');
const exec = c_p.exec;
const spawn = c_p.spawn;

const osType = function () {
    const result = {};
    result.platform = os.platform();//process.platform
    result.platform.indexOf('win') > -1
};

module.exports = function () {
    return {
        'taskList': function (processName) {
            let command = "tasklist";//TODO if linux or other OS
            return new Promise(function (resolve, reject) {
                exec(command, function (err, stdout, stderr) {
                    if (err) reject(err);
                    else {
                        var processArr = [], process;
                        stdout.split('\n').filter(function (line) {
                            var p = line.trim().split(/\s+/), pname = p[0], pid = p[1];
                            if (pname.toLowerCase().indexOf(processName) >= 0 && parseInt(pid)) {
                                process = {};
                                process.name = pname;
                                process.id = pid;
                                processArr.push(process);
                            }
                        });
                        resolve(processArr);
                    }
                });
            });
        },
        'action': function (installPath, processName, option) {
            //TODO very maybe a little complex, need to use service or some others in OS
            option = option == undefined ? [] : option;
            let command = 'start /D' + installPath + ' ' + processName + ' ' + option.join(' ');
            return new Promise(function (resolve, reject) {
                exec(command, function (err, stdout, stderr) {
                    if (err) reject(err);
                    else {
                        resolve('success');
                    }
                });
            });

            /*var result = spawn(processName, []);
             result.stdout.on('data', function (data) {
             console.log('--------' + data);
             deferred.resolve('success');
             });

             result.stderr.on('data', function (err) {
             deferred.reject(err.toString("utf-8"));
             });
             result.on('exit', function (code) {
             console.log('Child exited with code ${code}');
             });*/
        },
        'kill': function (processTag) {
            //TODO very maybe a little complex, need to use service
            let command = "tskill " + processTag;
            return new Promise(function (resolve, reject) {
                exec(command, function (err, stdout, stderr) {
                    if (err) reject(err);
                    else {
                        resolve('success');
                    }
                });
            });
        }
    }
};
