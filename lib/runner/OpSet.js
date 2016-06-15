'use strict';

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

const chalk = require('chalk'),
      fsManager = require('../utils/fsManager.js'),
      globManager = require('../utils/globManager.js'),
      TargetFile = require('./TargetFile.js');

class OpSet {
    constructor(config, bundle) {
        this.config = config;
        this.bundle = bundle;
    }

    categorizeFiles(targetFiles, phaseOps) {
        // duplicate files array
        const categorizedFiles = {};

        for (let i = 0, targetFilesLength = targetFiles.length; i < targetFilesLength; i++) {
            const targetFile = targetFiles[i];

            const opsDone = [];

            for (let phaseOp of phaseOps) {
                if (this.config[phaseOp.op] === undefined || this.config[phaseOp.op] === false) {
                    continue;
                }

                if (opsDone.indexOf(phaseOp.op) !== -1) {
                    continue;
                }

                if (!targetFile.checkExtensionMatching(phaseOp.formats)) {
                    continue;
                }

                opsDone.push(phaseOp.op);

                if (categorizedFiles[phaseOp.op] === undefined) {
                    categorizedFiles[phaseOp.op] = [];
                }

                if (categorizedFiles[phaseOp.op][phaseOp.task] === undefined) {
                    categorizedFiles[phaseOp.op][phaseOp.task] = [];
                }

                if (categorizedFiles[phaseOp.op][phaseOp.task][phaseOp.method] === undefined) {
                    categorizedFiles[phaseOp.op][phaseOp.task][phaseOp.method] = [];
                }

                categorizedFiles[phaseOp.op][phaseOp.task][phaseOp.method].push(targetFile);
            }
        }

        return categorizedFiles;
    }

    populateFiles(lockFileInstance) {
        const sourceFiles = globManager.glob(this.config.src, true);

        const targetFiles = sourceFiles.map(sourceFile => {
            return new TargetFile(sourceFile);
        });

        return targetFiles;
    }

    exec(phase, phaseOps) {
        var _this = this;

        return _asyncToGenerator(function* () {
            const targetFiles = _this.populateFiles(),
                  categorizedFiles = _this.categorizeFiles(targetFiles, phaseOps);

            for (let opKey in categorizedFiles) {
                const filesByTasks = categorizedFiles[opKey],
                      value = _this.config[opKey];

                for (let taskKey in filesByTasks) {
                    const filesByMethods = filesByTasks[taskKey];

                    // TODO just for testing
                    if (taskKey !== 'AddHeader') {
                        continue;
                    }

                    for (let methodKey in filesByMethods) {
                        const opFiles = filesByMethods[methodKey];

                        const opInfo = yield _this.bundle.runner.moduleManager.modules[taskKey][methodKey](value, _this, opFiles);

                        if (opInfo.processedFiles.length > 0) {
                            console.log(chalk.yellow(`    ${ opKey }:${ taskKey }`), chalk.gray(`${ opInfo.processedFiles.length } files`));
                        }
                    }
                }
            }
        })();
    }

    outputFilesTo(dest) {
        for (let i = 0, targetFilesLength = this.targetFiles.length; i < targetFilesLength; i++) {
            const targetFile = this.targetFiles[i],
                  filePath = `${ dest }/${ targetFile.file }`;

            fsManager.writeFile(filePath, targetFile.content);
        }
    }

    outputFiles() {
        if (this.config.dest === undefined) {
            return;
        }

        this.outputFilesTo(this.config.dest);
    }
}

module.exports = OpSet;