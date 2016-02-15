'use strict';

const globManager = require('./utils/globManager.js'),
    runnerOpFile = require('./runnerOpFile.js');

class runnerOp {
    constructor(bundleName, op, config) {
        this.bundleName = bundleName;
        this.op = op;
        this.config = config;
    }

    loadFiles() {
        const files = globManager.glob(this.op.src);

        this._opFiles = [];
        for (let file of files) {
            this._opFiles.push(new runnerOpFile(file));
        }
    }

    combineFiles() {
        for (let opFile of this._opFiles) {
            // combine + sum hash
        }

        this._opFiles = [
            new runnerOpFile('combined.xxx', 'new content')
        ];
    }

    start() {
        this.loadFiles();
    }

/*
    const file = require('./file.js'),
        fsManager = require('./fsManager.js');

    addFiles(files) {
        for (let item of files) {
            const filepath = item,
                lastMod = fsManager.getLastMod(filepath);

            files.push(new file(filepath, lastMod));
        }

        return this;
    }

    combineFile(newFilename) {
        let mightBeCached = true,
            newest = 0;

        for (let item of files) {
            if (!item.cached) {
                mightBeCached = false;
                break;
            }

            if (newest < item.modified) {
                newest = item.modified;
            }
        }

        let newFile = new file(newFilename, mightBeCached ? newest : null);
        this.files.forEach((index, item) => {
            newFile.addHash(item.getHash());
        });

        this.files = [newFile];

        return this;
    }
*/
}

module.exports = runnerOp;
