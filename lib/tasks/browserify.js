'use strict';

const stream = require('stream'),
      path = require('path'),
      tmp = require('tmp'),
      deepmerge = require('../utils/deepmerge.js'),
      runnerOpSetFile = require('../runnerOpSetFile.js');

class browserify {
    exec(value, runnerOpSet, files) {
        return new Promise((resolve, reject) => {
            let options = {
                fullPaths: true
            };
            if (runnerOpSet.config.browserify !== undefined) {
                deepmerge(options, runnerOpSet.config.browserify);
            }

            if (this._browserifyLib === undefined) {
                this._browserifyLib = require('browserify');
            }

            tmp.dir({ unsafeCleanup: true }, (err, tmppath, cleanup) => {
                if (err) {
                    reject(err);
                    return;
                }

                runnerOpSet.outputFilesTo(tmppath);

                let browserifyInstance = this._browserifyLib();
                browserifyInstance.add(path.join(tmppath, value.entry));

                let browserifyOutput = '';
                let browserifyStream = browserifyInstance.bundle();

                browserifyStream.on('readable', () => {
                    const chunk = browserifyStream.read();
                    if (chunk !== null) {
                        browserifyOutput += chunk.toString();
                    }
                }).on('end', () => {
                    let newFile = new runnerOpSetFile({
                        path: '/' + value.name,
                        fullpath: './' + value.name
                    });

                    for (let file of files) {
                        newFile.addHash(file.getHash());
                    }

                    newFile.setContent(browserifyOutput);
                    runnerOpSet.opSetFiles = [newFile];

                    cleanup();
                    resolve();
                });
            });
        });
    }
}

browserify.info = [{
    phase: 'bundling',
    formats: 'js',
    op: 'commonjs',
    weight: 0.4,
    method: 'exec'
}];

module.exports = browserify;