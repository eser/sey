'use strict';

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

const chalk = require('chalk'),
      RunnerBundle = require('./RunnerBundle.js');

class Runner {
    constructor(moduleManager, config) {
        this.moduleManager = moduleManager;
        this.config = config;
        this.bundles = {};
    }

    run(preset, options) {
        var _this = this;

        return _asyncToGenerator(function* () {
            const bundleOnly = options.bundle !== undefined,
                  config = _this.config.content;

            let bundleCount = 0;

            _this.moduleManager.events.emit('runner-before', config);
            for (let bundle in config) {
                if (bundle === 'global' || bundle === 'common') {
                    continue;
                }
                if (bundleOnly && options.bundle !== bundle) {
                    continue;
                }

                bundleCount++;

                _this.bundles[bundle] = new RunnerBundle(_this.moduleManager, _this.config, bundle);
                _this.bundles[bundle].run(preset);
            }
            _this.moduleManager.events.emit('runner-after', config);

            if (bundleCount === 0) {
                if (bundleOnly) {
                    console.log(chalk.red('no such bundle named', options.bundle));
                } else {
                    console.log(chalk.red('no bundle available to run'));
                }

                return false;
            }

            console.log(chalk.green('done.'));

            return true;
        })();
    }
}

module.exports = Runner;