"use strict";
var utils_1 = require('./utils');
var create_runner_1 = require('./create-runner');
;
function runner(testFile, config, handleResult, handleLog) {
    var runner = create_runner_1.createRunner(config, testFile);
    var final = null;
    var signalMatch = new RegExp(utils_1.signal);
    return new Promise(function (resolve, reject) {
        runner.stdout.on('data', function (data) {
            data = data.toString();
            var result = JSON.parse(JSON.stringify(data));
            if (typeof result === 'string') {
                result = JSON.parse(result);
            }
            var finish = result.asserts[result.asserts.length - 1];
            var obj = getIndexAndTitle(finish.comment);
            if (result.stats.failures > 0) {
                final = {
                    msg: obj.msg,
                    taskPosition: obj.index - 1
                };
            }
            else {
                final = {
                    msg: "Task " + obj.index + " Complete",
                    taskPosition: obj.index
                };
            }
            final.change = final.taskPosition - config.taskPosition;
            final.pass = final.change > 0;
            handleResult(final);
        });
        runner.stderr.on('data', function (data) {
            console.log('test error', data.toString());
        });
        runner.on('close', function (code) {
            if (code === 0) {
                resolve(final);
            }
            else {
                resolve(final);
            }
        });
    });
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = runner;
function getIndexAndTitle(title) {
    var indexString = title.match(/^[0-9]+/);
    if (!indexString) {
        throw 'Tests should begin with a number, indicating the task number';
    }
    return {
        index: parseInt(indexString[0]),
        msg: title.slice(indexString[0].length + 1)
    };
}
