/*global sey */
'use strict';

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

const chalk = require('chalk'),
      fsManager = require('./utils/fsManager.js'),
      globManager = require('./utils/globManager.js'),
      runnerOpFile = require('./runnerOpFile.js');

class runnerOpSet {
    constructor(bundle, opSet, config) {
        this.bundle = bundle;
        this.opSet = opSet;
        this.config = config;

        const files = globManager.glob(this.opSet.src),
              filesLength = files.length;

        this.opSetFiles = new Array(filesLength);
        for (let i = 0; i < filesLength; i++) {
            this.opSetFiles[i] = new runnerOpFile(files[i]);
        }
    }

    getTarget() {
        return this.config.target || 'node';
    }

    isTargeting(target) {
        if (this.config.target === undefined && target === 'node' || this.config.target === target) {
            return true;
        }

        return false;
    }

    getStandard() {
        return this.config.standard || 2016;
    }

    isStandard(standard) {
        if (this.config.standard === undefined && standard >= 2016 || this.config.standard >= standard) {
            return true;
        }

        return false;
    }

    categorizeFiles(phaseOps) {
        // duplicate files array
        let opFiles = this.opSetFiles.slice(0),
            opFilesLength = opFiles.length,
            categorizedFiles = {};

        for (let i = 0; i < opFilesLength; i++) {
            const opFile = opFiles[i];

            if (opFile === undefined) {
                continue;
            }

            const fileExtension = opFile.getExtension();
            let opsDone = [];

            for (let phaseOp of phaseOps) {
                if (this.opSet[phaseOp.op] === undefined) {
                    continue;
                }

                if (opsDone.indexOf(phaseOp.op) !== -1) {
                    continue;
                }

                if (!opFile.checkExtensionMatching(phaseOp.formats)) {
                    continue;
                }

                opsDone.push(phaseOp.op);
                delete opFiles[i];

                if (!(categorizedFiles[phaseOp.op] instanceof Array)) {
                    categorizedFiles[phaseOp.op] = [];
                }

                if (!(categorizedFiles[phaseOp.op][phaseOp.task] instanceof Array)) {
                    categorizedFiles[phaseOp.op][phaseOp.task] = [];
                }

                categorizedFiles[phaseOp.op][phaseOp.task].push(opFile);
            }
        }

        return categorizedFiles;
    }

    exec(phase, phaseOps) {
        var _this = this;

        return _asyncToGenerator(function* () {
            const categorizedFiles = _this.categorizeFiles(phaseOps);

            for (let opKey in categorizedFiles) {
                const filesByTasks = categorizedFiles[opKey],
                      value = _this.opSet[opKey];

                for (let taskKey in filesByTasks) {
                    const files = filesByTasks[taskKey];
                    let modifiedFiles = [];

                    const valueSerialized = JSON.stringify([taskKey, value]);
                    for (let opFile of files) {
                        opFile.addHash(valueSerialized);
                        if (opFile.cached) {
                            continue;
                        }

                        console.log(chalk.yellow('    ' + opKey), chalk.gray(opFile.file.path));
                        modifiedFiles.push(opFile);
                    }

                    // await sey.registry.exec(taskKey, value, this, modifiedFiles);
                }
            }
        })();
    }

    outputFiles(dest) {
        const destPath = dest + '/';

        for (let opFile of this.opSetFiles) {
            const filePath = destPath + opFile.file.path;
            fsManager.writeFile(filePath, opFile.getContent());
        }
    }
}

module.exports = runnerOpSet;