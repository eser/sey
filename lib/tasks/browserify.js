'use strict';

const stream = require('stream'),
      deepmerge = require('../utils/deepmerge.js'),
      runnerOpFile = require('../runnerOpFile.js');

class browserify {
    exec(value, runnerOp, files) {
        return new Promise((resolve, reject) => {
            let options = {
                fullPaths: true
            };
            if (runnerOp.config.browserify !== undefined) {
                deepmerge(options, runnerOp.config.browserify);
            }

            let newFile = new runnerOpFile({
                path: '/' + value.name,
                fullpath: './' + value.name
            });

            if (this._browserifyLib === undefined) {
                this._browserifyLib = require('browserify');
            }

            let browserifyBundle = this._browserifyLib();
            for (let file of files) {
                const filename = '.' + file.file.path,
                      content = file.getContent();
                newFile.addHash(file.getHash());

                browserifyBundle.require({
                    file: file.file.fullpath,
                    basedir: '.',
                    source: content,
                    entry: filename === value.entry ? true : false
                });
            }

            let browserifyOutput = '';
            let browserifyStream = browserifyBundle.bundle();

            browserifyStream.on('readable', () => {
                const chunk = browserifyStream.read();
                if (chunk !== null) {
                    browserifyOutput += chunk.toString();
                }
            }).on('end', () => {
                newFile.setContent(browserifyOutput);
                runnerOp.opFiles = [newFile];
                resolve();
            });
        });
    }
}

browserify.info = [{
    phase: 'bundling',
    formats: 'js',
    op: 'commonjs',
    weight: 0.5,
    method: 'exec'
}];

module.exports = browserify;