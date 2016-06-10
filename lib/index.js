'use strict';

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

const path = require('path'),
      chalk = require('chalk'),

// logger = require('simple-node-logger'),
fsManager = require('./utils/fsManager.js'),
      Config = require('./Config.js'),
      ModuleManager = require('./ModuleManager.js'),
      Runner = require('./Runner.js');

class sey {
    constructor() {
        this.moduleManager = new ModuleManager();
        this.config = Config;
        this.startParameters = {};
    }

    init() {
        this.moduleManager.init();
        this.moduleManager.registerOps(Config);

        this.workingPath = path.join(process.cwd(), '.sey');

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
        fsManager.rm(`${ this.workingPath }/*`);

        console.log(chalk.white('Working path is cleaned.'));
    }

    selfCheck() {
        return [];
    }

    run(configInstance) {
        var _this = this;

        return _asyncToGenerator(function* () {
            let currentConfig;

            if (configInstance instanceof Config) {
                currentConfig = configInstance;
            } else {
                currentConfig = new Config(configInstance);
            }

            const currentRunner = new Runner(_this.moduleManager, currentConfig);

            return yield currentRunner.run('publish', _this.startParameters);
        })();
    }

    runFile(filepath, startParameters) {
        var _this2 = this;

        return _asyncToGenerator(function* () {
            global.sey = _this2;
            _this2.startParameters = startParameters;

            const returnValue = require(filepath);

            if (Object.keys(returnValue).length > 0) {
                yield _this2.run(returnValue);
            }
        })();
    }
}

const instance = new sey();

instance.init();

module.exports = instance;