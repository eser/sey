'use strict';

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

const chalk = require('chalk'),
      fsManager = require('../utils/fsManager.js'),
      globManager = require('../utils/globManager.js'),
      pathinfo = require('../utils/pathinfo.js'),
      TargetFile = require('./TargetFile.js');

class OpSet {
    constructor(config, bundle, moduleManager) {
        this.config = config;
        this.bundle = bundle;
        this.moduleManager = moduleManager;
    }

    checkExtensionMatching(filepath, extensions) {
        const currentExtension = pathinfo.extension(filepath);

        for (let extension of extensions) {
            if (extension === '*' || extension === currentExtension) {
                return true;
            }
        }

        return false;
    }

    populateFiles() {
        this.files = globManager.glob(this.config.src, true);
    }

    categorizeFiles(phaseOps) {
        // duplicate files array
        const categorizedFiles = {};

        for (let i = 0, filesLength = this.files.length; i < filesLength; i++) {
            const file = this.files[i];

            const opsDone = [];

            for (let phaseOp of phaseOps) {
                if (this.config[phaseOp.op] === undefined) {
                    continue;
                }

                if (opsDone.indexOf(phaseOp.op) !== -1) {
                    continue;
                }

                if (!this.checkExtensionMatching(file.fullpath, phaseOp.formats)) {
                    continue;
                }

                opsDone.push(phaseOp.op);

                if (!(categorizedFiles[phaseOp.op] instanceof Array)) {
                    categorizedFiles[phaseOp.op] = [];
                }

                if (!(categorizedFiles[phaseOp.op][phaseOp.task] instanceof Array)) {
                    categorizedFiles[phaseOp.op][phaseOp.task] = [];
                }

                if (!(categorizedFiles[phaseOp.op][phaseOp.task][phaseOp.method] instanceof Array)) {
                    categorizedFiles[phaseOp.op][phaseOp.task][phaseOp.method] = [];
                }

                categorizedFiles[phaseOp.op][phaseOp.task][phaseOp.method].push(new TargetFile(file));
            }
        }

        return categorizedFiles;
    }

    exec(phase, phaseOps) {
        var _this = this;

        return _asyncToGenerator(function* () {
            /*
                module'un kendisine gidilecek,
                -- module her file'dan bir opTargetFile olusturacak,
                    -- opTargetFile'lar kontrol edilecek, target file varsa ve herhangi bir source'dan daha yeni ise ve file listesi tutuyorsa o targetFile olusturulmayacak
                -- opTargetFile'dan source file listesi olusturulacak
            */

            _this.populateFiles();

            const categorizedFiles = _this.categorizeFiles(phaseOps);

            for (let opKey in categorizedFiles) {
                const filesByTasks = categorizedFiles[opKey],
                      value = _this.config[opKey];

                for (let taskKey in filesByTasks) {
                    const filesByMethods = filesByTasks[taskKey];

                    if (taskKey !== 'AddHeader') {
                        continue;
                    }

                    for (let methodKey in filesByMethods) {
                        const opFiles = filesByMethods[methodKey];

                        const opInfo = yield _this.moduleManager.modules[taskKey][methodKey](value, _this, opFiles);

                        if (opInfo.processedFiles.length > 0) {
                            console.log(chalk.yellow(`    ${ opKey }:${ taskKey }`), chalk.gray(`${ opInfo.processedFiles.length } files`));
                        }
                    }
                }
            }
        })();
    }

    outputFilesTo(dest) {
        for (let opSetFile of this.opSetFiles) {
            const filePath = `${ dest }/${ opSetFile.file.path }`;

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

module.exports = OpSet;