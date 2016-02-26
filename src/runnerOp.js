/*global sey */
'use strict';

const chalk = require('chalk'),
    fsManager = require('./utils/fsManager.js'),
    globManager = require('./utils/globManager.js'),
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

    async startOp(task) {
        let modifiedFiles = [];

        console.log(chalk.yellow('    task:'), chalk.white(task));

        if (!(task in sey.tasks.items)) {
            console.log(chalk.red('      no such task named ' + task));
            return;
        }

        for (let opFile of this.opFiles) {
            opFile.addHash(task);
            if (opFile.cached) {
                continue;
            }

            console.log(chalk.gray('      ' + opFile.file.path));
            modifiedFiles.push(opFile);
        }
        console.log(chalk.gray('      done.'));

        await sey.tasks.exec(task, this, modifiedFiles);
    }

    async start() {
        this.loadFiles();

        for (let task in this.op) {
            if (task !== 'src' && task !== 'dest') {
                await this.startOp(task);
            }
        }

        if (this.op.dest !== undefined) {
            const destPath = this.op.dest + '/';

            for (let opFile of this.opFiles) {
                const filePath = destPath + opFile.file.path;
                fsManager.writeFile(filePath, opFile.getContent());
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
