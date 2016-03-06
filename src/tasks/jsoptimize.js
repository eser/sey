'use strict';

const // stream = require('stream'),
    deepmerge = require('../utils/deepmerge.js'),
    fsManager = require('../utils/fsManager.js');

class jsoptimize {
    execSingle(value, file, options) {
        return new Promise((resolve, reject) => {
            const content = file.getContent();

            // let readableStream = new stream.Readable();
            // readableStream.push(content);
            // readableStream.push(null);

            fsManager.tempFile('closure.js', content, (tmppath, cleanup) => {
                this._closureLib.compile(
                    tmppath, // [],
                    options,
                    // readableStream,
                    function (err, result) {
                        if (err) {
                            cleanup();
                            reject(err);
                            return;
                        }

                        file.setContent(result);
                        cleanup();
                        resolve();
                    }
                );
            });
        });
    }

    async exec(value, runnerOp, files) {
        let options = {
            compilation_level: 'ADVANCED_OPTIMIZATIONS' // ,
            // formatting: 'PRETTY_PRINT'
        };

        if (runnerOp.isStandard(2015)) {
            options.language_in = 'ES6';
        }

        if (runnerOp.isStandard(2016)) {
            // TODO will be replaced with es2016
            options.language_in = 'ES6';
        }

        if (runnerOp.config.closure !== undefined) {
            deepmerge(options, runnerOp.config.closure);
        }

        for (let file of files) {
            if (this._closureLib === undefined) {
                this._closureLib = require('closurecompiler');
            }

            await this.execSingle(value, file, options);
        }
    }
}

jsoptimize.info = [
    {
        phase: 'optimization',
        formats: 'js',
        op: 'optimize',
        weight: 0.5,
        method: 'exec'
    }
];

module.exports = jsoptimize;
