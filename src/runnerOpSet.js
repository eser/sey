/*global sey */
'use strict';

const chalk = require('chalk'),
    fsManager = require('./utils/fsManager.js'),
    globManager = require('./utils/globManager.js'),
    runnerOpSetFile = require('./runnerOpSetFile.js');

class runnerOpSet {
    constructor(bundle, opSet, config) {
        this.bundle = bundle;
        this.opSet = opSet;
        this.config = config;

        const files = globManager.glob(this.opSet.src),
            filesLength = files.length;

        this.opSetFiles = new Array(filesLength);
        for (let i = 0; i < filesLength; i++) {
            this.opSetFiles[i] = new runnerOpSetFile(files[i]);
        }
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

    categorizeFiles(phaseOps) {
        // duplicate files array
        let opSetFiles = this.opSetFiles.slice(0),
            opSetFilesLength = opSetFiles.length,
            categorizedFiles = {};

        for (let i = 0; i < opSetFilesLength; i++) {
            const opSetFile = opSetFiles[i];

            if (opSetFile === undefined) {
                continue;
            }

            const fileExtension = opSetFile.getExtension();
            let opsDone = [];

            for (let phaseOp of phaseOps) {
                if (this.opSet[phaseOp.op] === undefined) {
                    continue;
                }

                if (opsDone.indexOf(phaseOp.op) !== -1) {
                    continue;
                }

                if (!opSetFile.checkExtensionMatching(phaseOp.formats)) {
                    continue;
                }

                opsDone.push(phaseOp.op);
                delete opSetFiles[i];

                if (!(categorizedFiles[phaseOp.op] instanceof Array)) {
                    categorizedFiles[phaseOp.op] = [];
                }

                if (!(categorizedFiles[phaseOp.op][phaseOp.task] instanceof Array)) {
                    categorizedFiles[phaseOp.op][phaseOp.task] = [];
                }

                categorizedFiles[phaseOp.op][phaseOp.task].push(opSetFile);
            }
        }

        return categorizedFiles;
    }

    async exec(phase, phaseOps) {
        const categorizedFiles = this.categorizeFiles(phaseOps);

        for (let opKey in categorizedFiles) {
            const filesByTasks = categorizedFiles[opKey],
                value = this.opSet[opKey];

            for (let taskKey in filesByTasks) {
                const files = filesByTasks[taskKey];
                let modifiedFiles = [];

                const valueSerialized = JSON.stringify([taskKey, value]);
                for (let opSetFile of files) {
                    opSetFile.addHash(valueSerialized);
                    if (opSetFile.cached) {
                        continue;
                    }

                    modifiedFiles.push(opSetFile);
                }

                console.log(chalk.yellow('    ' + opKey + '(' + taskKey + ')'), chalk.gray(modifiedFiles.length + ' files'));
                await sey.registry.tasks[taskKey].exec(value, this, modifiedFiles);
            }
        }
    }

    outputFilesTo(dest) {
        const destPath = dest + '/';

        for (let opSetFile of this.opSetFiles) {
            const filePath = destPath + opSetFile.file.path;
            fsManager.writeFile(filePath, opSetFile.getContent());
        }
    }

    outputFiles() {
        if (this.opSet.dest === undefined) {
            return;
        }

        this.outputFilesTo(this.opSet.dest);
    }
}

module.exports = runnerOpSet;