'use strict';

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

const path = require('path'),
      chalk = require('chalk'),
      fsManager = require('./utils/fsManager.js'),
      config = require('./config.js'),
      registry = require('./registry.js'),
      runner = require('./runner.js');

class sey {
    static preload() {
        this.config = config;
        this.options = {};

        this.registry = registry;

        this.workingPath = path.join(process.cwd(), '.sey');
    }

    static setOptions(options) {
        this.options = options;
    }

    static initFile(file, preferApi, override) {
        if (fsManager.exists(file) && !override) {
            console.log(chalk.red('Aborted. File already exists:'), chalk.gray(file));

            return;
        }

        const sampleFile = preferApi ? 'seyfile.api.sample.js' : 'seyfile.config.sample.js',
              content = fsManager.readFile(`${ __dirname }/../etc/${ sampleFile }`);

        fsManager.writeFile(file, content);

        console.log(chalk.white('File created:'), chalk.gray(file));
    }

    static clean() {
        fsManager.rm(`${ this.workingPath }/*`);

        console.log(chalk.white('Working path is cleaned.'));
    }

    static selfCheck() {
        return [];
    }

    static run(configInstance) {
        var _this = this;

        return _asyncToGenerator(function* () {
            let currentConfig;

            if (configInstance instanceof config) {
                currentConfig = configInstance;
            } else {
                currentConfig = new config(configInstance);
            }

            const currentRunner = new runner(currentConfig);

            return yield currentRunner.run('publish', _this.options);
        })();
    }
}

sey.preload();

module.exports = sey;