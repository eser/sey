/*global sey */
const chalk = require('chalk'),
    fsManager = require('./utils/fsManager.js'),
    globManager = require('./utils/globManager.js'),
    RunnerOpSetFile = require('./RunnerOpSetFile.js');

class RunnerOpSet {
    constructor(config, runnerBundle, moduleManager) {
        this.config = config;
        this.runnerBundle = runnerBundle;
        this.moduleManager = moduleManager;

        // TODO:
        //          glob op.src,
        //          compare .sey/*
        //          find modified ones
        //          process found files

        /*
            this.sourcesToWatch = [];
            this.watchEnabled = true;

            if (bundleOpConfig.src !== undefined) {
                if (bundleOpConfig.src.constructor === Array) {
                    for (let bundleOpConfigSrcIndex in bundleOpConfig.src) {
                        this.sourcesToWatch.push(bundleOpConfig.src[bundleOpConfigSrcIndex]);
                    }
                }
                else {
                    this.sourcesToWatch.push(bundleOpConfig.src);
                }
            }
        */

        const files = globManager.glob(this.config.src, true),
            filesLength = files.length;

        this.opSetFiles = new Array(filesLength);
        for (let i = 0; i < filesLength; i++) {
            this.opSetFiles[i] = new RunnerOpSetFile(files[i]);
        }
    }

    categorizeFiles(phaseOps) {
        // duplicate files array
        const opSetFiles = this.opSetFiles.slice(0),
            opSetFilesLength = opSetFiles.length,
            categorizedFiles = {};

        for (let i = 0; i < opSetFilesLength; i++) {
            const opSetFile = opSetFiles[i];

            if (opSetFile === undefined) {
                continue;
            }

            const fileExtension = opSetFile.getExtension();
            const opsDone = [];

            for (let phaseOp of phaseOps) {
                if (this.config[phaseOp.op] === undefined) {
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

                if (!(categorizedFiles[phaseOp.op][phaseOp.task][phaseOp.method] instanceof Array)) {
                    categorizedFiles[phaseOp.op][phaseOp.task][phaseOp.method] = [];
                }

                categorizedFiles[phaseOp.op][phaseOp.task][phaseOp.method].push(opSetFile);
            }
        }

        return categorizedFiles;
    }

    async exec(phase, phaseOps) {
        const categorizedFiles = this.categorizeFiles(phaseOps);

        for (let opKey in categorizedFiles) {
            const filesByTasks = categorizedFiles[opKey],
                value = this.config[opKey];

            for (let taskKey in filesByTasks) {
                const filesByMethods = filesByTasks[taskKey];

                for (let methodKey in filesByMethods) {
                    const files = filesByMethods[methodKey],
                        modifiedFiles = [];

                    const valueSerialized = JSON.stringify([ taskKey, value ]);

                    for (let opSetFile of files) {
                        opSetFile.addHash(valueSerialized);
                        if (opSetFile.cached) {
                            continue;
                        }

                        modifiedFiles.push(opSetFile);
                    }

                    const opDesc = (opKey === taskKey) ?
                        opKey :
                        `${opKey}:${taskKey}`;

                    console.log(chalk.yellow(`    ${opDesc}`), chalk.gray(`${modifiedFiles.length} files`));
                    await this.moduleManager.modules[taskKey][methodKey](value, this, modifiedFiles);
                }
            }
        }
    }

    outputFilesTo(dest) {
        const destPath = `${dest}/`;

        for (let opSetFile of this.opSetFiles) {
            const filePath = destPath + opSetFile.file.path;

            fsManager.writeFile(filePath, opSetFile.getContent());
        }
    }

    outputFiles() {
        if (this.config.dest === undefined) {
            return;
        }

        this.outputFilesTo(this.config.dest);
    }
}

module.exports = RunnerOpSet;
