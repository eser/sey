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

        this.opFiles = [];
        for (let file of files) {
            this.opFiles.push(new runnerOpFile(file));
        }
    }

    startOp(task) {
        let modifiedFiles = [];

        for (let opFile of this.opFiles) {
            opFile.addHash(task);
            if (opFile.cached) {
                continue;
            }

            console.log(task + ':', opFile.file.path);
            modifiedFiles.push(opFile);
        }

        sey.tasks.exec(task, this, modifiedFiles);
    }

    start() {
        this.loadFiles();

        for (let task in this.op) {
            if (task !== 'src' && task !== 'dest') {
                this.startOp(task);
            }
        }
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

        let newFile = new runnerOpFile(newFilename, mightBeCached ? newest : null);
        for (let opFile of this.opFiles) {
            // combine + sum hash
            newFile.addHash(opFile.getHash());
        }

        this.opFiles = [newFile];

        return this;
    }
*/
}

module.exports = runnerOp;
