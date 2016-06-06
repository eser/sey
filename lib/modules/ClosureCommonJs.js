'use strict';

const // stream = require('stream'),
path = require('path'),
      tmp = require('tmp'),
      deepmerge = require('../utils/deepmerge.js'),
      fsManager = require('../utils/fsManager.js'),
      RunnerOpSetFile = require('../RunnerOpSetFile.js');

class ClosureCommonJs {
    onLoad(moduleManager) {
        // moduleManager.addTask(this, {
        //     phase: 'bundling',
        //     formats: 'js',
        //     op: 'commonjs',
        //     weight: 0.1,
        //     method: 'exec'
        // });
    }

    exec(value, runnerOpSet, files) {
        return new Promise((resolve, reject) => {
            const options = {
                process_common_js_modules: true
                // common_js_entry_module: value.entry
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

            if (this._closureLib === undefined) {
                this._closureLib = require('closurecompiler');
            }

            tmp.dir({ unsafeCleanup: true }, (err, tmppath, cleanup) => {
                if (err) {
                    reject(err);

                    return;
                }

                runnerOpSet.outputFilesTo(tmppath);

                this._closureLib.compile(path.join(tmppath, value.entry), // [],
                options,
                // readableStream,
                function (err2, result) {
                    if (err2) {
                        cleanup();
                        reject(err2);

                        return;
                    }

                    const newFile = new RunnerOpSetFile({
                        path: `/${ value.name }`,
                        fullpath: `./${ value.name }`
                    });

                    for (let file of files) {
                        newFile.addHash(file.getHash());
                    }

                    newFile.setContent(result);
                    runnerOpSet.opSetFiles = [newFile];

                    cleanup();
                    resolve();
                });
            });
        });
    }
}

module.exports = ClosureCommonJs;