/*global sey */
const chalk = require('chalk'),
    fsManager = require('./utils/fsManager.js'),
    globManager = require('./utils/globManager.js'),
    RunnerOpSetFile = require('./RunnerOpSetFile.js');

class RunnerOpSet {
    constructor(moduleManager, bundle, bundleConfig, opSet) {
        this.moduleManager = moduleManager;
        this.bundle = bundle;
        this.bundleConfig = bundleConfig;
        this.opSet = opSet;

        const files = globManager.glob(this.opSet.src, true),
            filesLength = files.length;

        this.opSetFiles = new Array(filesLength);
        for (let i = 0; i < filesLength; i++) {
            this.opSetFiles[i] = new RunnerOpSetFile(files[i]);
        }
    }

    getTarget() {
        return this.bundleConfig.target || 'node';
    }

    isTargeting(target) {
        if ((this.bundleConfig.target === undefined && target === 'node') ||
            (this.bundleConfig.target === target)) {
            return true;
        }

        return false;
    }

    getStandard() {
        return this.bundleConfig.standard || 2016;
    }

    isStandard(standard) {
        if ((this.bundleConfig.standard === undefined && standard >= 2016) ||
            (this.bundleConfig.standard >= standard)) {
            return true;
        }

        return false;
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
                value = this.opSet[opKey];

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
        if (this.opSet.dest === undefined) {
            return;
        }

        this.outputFilesTo(this.opSet.dest);
    }
}

module.exports = RunnerOpSet;
