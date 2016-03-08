/*global sey */
'use strict';

const chalk = require('chalk'),
    fsManager = require('./utils/fsManager.js'),
    globManager = require('./utils/globManager.js'),
    runnerOpFile = require('./runnerOpFile.js');

class runnerOpSet {
    constructor(bundle, opSet, config) {
        this.bundle = bundle;
        this.opSet = opSet;
        this.config = config;
    }

    getTarget() {
        return this.config.target || 'node';
    }

    isTargeting(target) {
        if ((this.config.target === undefined && target === 'node') ||
            (this.config.target === target)) {
            return true;
        }

        return false;
    }

    getStandard() {
        return this.config.standard || 2016;
    }

    isStandard(standard) {
        if ((this.config.standard === undefined && standard >= 2016) ||
            (this.config.standard >= standard)) {
            return true;
        }

        return false;
    }

    async exec(phase, phaseOps) {
        console.log(this.bundle, phase, this.opSet.src);
    }

    loadFiles() {
        const files = globManager.glob(this.opSet.src);

        this.opSetFiles = [];
        for (let file of files) {
            this.opSetFiles.push(new runnerOpFile(file));
        }
    }

    async startOp(task, value) {
        let modifiedFiles = [];

        console.log(chalk.yellow('    task:'), chalk.white(task));

        if (!(task in sey.registry.items)) {
            console.log(chalk.red('      no such task named ' + task));
            return;
        }

        let tasks = {};
        const valueSerialized = JSON.stringify([task, value]);
        for (let opFile of this.opSetFiles) {
            opFile.addHash(valueSerialized);
            if (opFile.cached) {
                continue;
            }

            console.log(chalk.gray('      ' + opFile.file.path));
            modifiedFiles.push(opFile);
        }
        console.log(chalk.gray('      done.'));

        // await sey.registry.exec(task, value, this, modifiedFiles);
    }

    outputFiles(dest) {
        const destPath = dest + '/';

        for (let opFile of this.opSetFiles) {
            const filePath = destPath + opFile.file.path;
            fsManager.writeFile(filePath, opFile.getContent());
        }
    }

    async start() {
        this.loadFiles();

        for (let op in this.opSet) {
            if (op !== 'src' && op !== 'dest' && this.opSet[op] !== false) {
                await this.startOp(op, this.opSet[op]);
            }
        }

        if (this.opSet.dest !== undefined) {
            this.outputFiles(this.opSet.dest);
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
        for (let opFile of this.opSetFiles) {
            // combine + sum hash
            newFile.addHash(opFile.getHash());
        }

        this.opSetFiles = [newFile];

        return this;
    }
*/
}

module.exports = runnerOpSet;
