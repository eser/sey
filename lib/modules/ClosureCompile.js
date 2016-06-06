'use strict';

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

const // stream = require('stream'),
fs = require('fs'),
      tmp = require('tmp'),
      deepmerge = require('../utils/deepmerge.js'),
      fsManager = require('../utils/fsManager.js');

class ClosureCompile {
    onLoad(moduleManager) {
        // moduleManager.addTask(this, {
        //     phase: 'optimization',
        //     formats: 'js',
        //     op: 'optimize',
        //     weight: 0.1,
        //     method: 'exec'
        // });
    }

    execSingle(value, file, options) {
        return new Promise((resolve, reject) => {
            const content = file.getContent();

            // let readableStream = new stream.Readable();
            // readableStream.push(content);
            // readableStream.push(null);

            tmp.file((err, tmppath, fd, cleanup) => {
                if (err) {
                    throw err;
                }

                fs.writeSync(fd, content);
                fs.closeSync(fd);

                this._closureLib.compile(tmppath, // [],
                options,
                // readableStream,
                function (err2, result) {
                    if (err2) {
                        cleanup();
                        reject(err2);

                        return;
                    }

                    file.setContent(result);
                    cleanup();
                    resolve();
                });
            });
        });
    }

    exec(value, runnerOpSet, files) {
        var _this = this;

        return _asyncToGenerator(function* () {
            const options = {
                compilation_level: 'ADVANCED_OPTIMIZATIONS' // ,
                // formatting: 'PRETTY_PRINT'
            };

            if (runnerOpSet.isStandard(2015)) {
                options.language_in = 'ES6';
            }

            if (runnerOpSet.isStandard(2016)) {
                // TODO will be replaced with es2016
                options.language_in = 'ES6';
            }

            if (runnerOpSet.bundleConfig.closure !== undefined) {
                deepmerge(options, runnerOpSet.bundleConfig.closure);
            }

            for (let file of files) {
                if (_this._closureLib === undefined) {
                    _this._closureLib = require('closurecompiler');
                }

                yield _this.execSingle(value, file, options);
            }
        })();
    }
}

module.exports = ClosureCompile;