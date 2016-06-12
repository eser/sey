'use strict';

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

const chalk = require('chalk'),
      deepmerge = require('../utils/deepmerge.js'),
      TaskException = require('../TaskException.js'),
      Bundle = require('./Bundle.js');

class Runner {
    constructor(moduleManager, config) {
        this.moduleManager = moduleManager;
        this.config = config;
        this.bundles = {};
    }

    getBundleConfig(bundleName) {
        const bundleConfig = {};

        if ( /* bundleName !== 'global' && bundleName !== 'common' && */this.config.content.common !== undefined) {
            deepmerge(bundleConfig, this.config.content.common);
        }

        if (this.config.content[bundleName] !== undefined) {
            deepmerge(bundleConfig, this.config.content[bundleName]);
        }

        return bundleConfig;
    }

    run(preset, options) {
        var _this = this;

        return _asyncToGenerator(function* () {
            const bundleOnly = options.bundle !== undefined,
                  config = _this.config.content;

            let bundleCount = 0;

            try {
                _this.moduleManager.events.emit('runner-before', config);

                for (let bundleName in config) {
                    if (bundleName === 'global' || bundleName === 'common') {
                        continue;
                    }
                    if (bundleOnly && options.bundle !== bundleName) {
                        continue;
                    }

                    bundleCount++;

                    const bundleConfig = _this.getBundleConfig(bundleName);

                    _this.bundles[bundleName] = new Bundle(bundleName, bundleConfig, _this.moduleManager);
                    yield _this.bundles[bundleName].run(preset);
                }

                _this.moduleManager.events.emit('runner-after', config);
            } catch (ex) {
                if (ex instanceof TaskException) {
                    console.log(ex.export());
                } else {
                    console.log(ex);
                }
            }

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