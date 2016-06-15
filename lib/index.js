'use strict';

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

const path = require('path'),
      chalk = require('chalk'),

// logger = require('simple-node-logger'),
fsManager = require('./utils/fsManager.js'),
      Config = require('./config/'),
      Runner = require('./runner/'),
      ModuleManager = require('./ModuleManager.js');

class sey {
    constructor() {
        this.moduleManager = new ModuleManager();
        this.config = Config;
    }

    init() {
        this.moduleManager.init();
        this.moduleManager.registerOps(Config);

        // this.logManager = logger.createLogManager();
        // this.logManager.createConsoleAppender();

        // this.log = this.logManager.createLogger('sey');
    }

    initFile(file, preferApi, override) {
        if (fsManager.exists(file) && !override) {
            console.log(chalk.red('Aborted. File already exists:'), chalk.gray(file));

            return;
        }

        const sampleFile = preferApi ? 'seyfile.api.sample.js' : 'seyfile.config.sample.js',
              content = fsManager.readFile(`${ __dirname }/../etc/${ sampleFile }`);

        fsManager.writeFile(file, content);

        console.log(chalk.white('File created:'), chalk.gray(file));
    }

    clean() {
        // fsManager.rm(`${this.workingPath}/*`);

        console.log(chalk.white('Working path is cleaned.'));
    }

    selfCheck() {
        return [];
    }

    start(options) {
        var _this = this;

        return _asyncToGenerator(function* () {
            _this.runtimeOptions = options;

            if (_this.runtimeOptions.seyfileContent === undefined) {
                _this.runtimeOptions.seyfileContent = require(_this.runtimeOptions.seyfile);
            }

            if (Object.keys(_this.runtimeOptions.seyfileContent).length > 0) {
                yield _this.run(_this.runtimeOptions.seyfileContent, _this.runtimeOptions);
            }
        })();
    }

    run(seyfileContent, options) {
        var _this2 = this;

        return _asyncToGenerator(function* () {
            const currentSeyfileContent = seyfileContent instanceof Config ? seyfileContent : new Config(seyfileContent);

            const currentOptions = options || _this2.runtimeOptions;

            const runner = new Runner(_this2.moduleManager, currentSeyfileContent);

            runner.load();
            runner.populateFiles(currentOptions);

            yield runner.run(currentOptions);
        })();
    }
}

const instance = new sey();

instance.init();

global.sey = instance;
module.exports = instance;