'use strict';

const stream = require('stream'),
      path = require('path'),
      tmp = require('tmp'),
      deepmerge = require('../utils/deepmerge.js'),
      RunnerSourceFile = require('../runner/SourceFile.js');

class Browserify {
    onLoad(moduleManager) {
        moduleManager.addTask(this, {
            phase: 'bundling',
            formats: 'js',
            op: 'commonjs',
            weight: 0.4,
            method: 'exec'
        });
    }

    exec(value, runnerOpSet, files) {
        return new Promise((resolve, reject) => {
            if (!runnerOpSet.isTargeting('web')) {
                return;
            }

            const options = {
                fullPaths: true
            };

            const runnerBundle = runnerOpSet.bundle;

            if (runnerBundle.config.browserify !== undefined) {
                deepmerge(options, runnerBundle.config.browserify);
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

                const browserifyInstance = this._browserifyLib();

                browserifyInstance.add(path.join(tmppath, value.entry));

                let browserifyOutput = '';

                const browserifyStream = browserifyInstance.bundle();

                browserifyStream.on('readable', () => {
                    const chunk = browserifyStream.read();

                    if (chunk !== null) {
                        browserifyOutput += chunk.toString();
                    }
                }).on('end', () => {
                    const newFile = new RunnerSourceFile({
                        path: `/${ value.name }`,
                        fullpath: `./${ value.name }`
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

        return {
            processedFiles: runnerOpSet.opSetFiles
        };
    }
}

module.exports = Browserify;