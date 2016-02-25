/*global sey */
'use strict';

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

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

    startOp(task) {
        var _this = this;

        return _asyncToGenerator(function* () {
            let modifiedFiles = [];

            console.log(chalk.yellow('    task:'), chalk.white(task));
            for (let opFile of _this.opFiles) {
                opFile.addHash(task);
                if (opFile.cached) {
                    continue;
                }

                console.log(chalk.gray('      ' + opFile.file.path));
                modifiedFiles.push(opFile);
            }
            console.log(chalk.gray('      done.'));

            yield sey.tasks.exec(task, _this, modifiedFiles);
        })();
    }

    start() {
        var _this2 = this;

        return _asyncToGenerator(function* () {
            _this2.loadFiles();

            for (let task in _this2.op) {
                if (task !== 'src' && task !== 'dest') {
                    yield _this2.startOp(task);
                }
            }

            if (_this2.op.dest !== undefined) {
                const destPath = _this2.op.dest + '/';

                for (let opFile of _this2.opFiles) {
                    const filePath = destPath + opFile.file.path;
                    fsManager.writeFile(filePath, opFile.getContent());
                }
            }
        })();
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