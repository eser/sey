'use strict';

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

const chalk = require('chalk'),
      deepmerge = require('./utils/deepmerge.js'),

// fsManager = require('./utils/fsManager.js'),
RunnerOpSet = require('./RunnerOpSet.js'),
      TaskException = require('./TaskException.js');

class Runner {
    constructor(moduleManager, config) {
        this.moduleManager = moduleManager;
        this.config = config;
    }

    getBundleConfig(bundle) {
        const bundleConfig = {};

        if (bundle !== 'global' && bundle !== 'common' && this.config.content.common !== undefined) {
            deepmerge(bundleConfig, this.config.content.common);
        }

        if (this.config.content[bundle] !== undefined) {
            deepmerge(bundleConfig, this.config.content[bundle]);
        }

        return bundleConfig;
    }

    runBundle(preset, bundle) {
        var _this = this;

        return _asyncToGenerator(function* () {
            const bundleConfig = _this.getBundleConfig(bundle);

            console.log(chalk.green('bundle:'), chalk.bold.white(bundle));
            try {
                if (bundleConfig.ops === undefined) {
                    return;
                }

                const opsLength = bundleConfig.ops.length,
                      runnerOpSets = new Array(opsLength);

                for (let i = 0; i < opsLength; i++) {
                    runnerOpSets[i] = new RunnerOpSet(_this, bundle, bundleConfig.ops[i], bundleConfig);
                }

                for (let phase of _this.config.content.global.presets[preset]) {
                    const phaseOps = _this.moduleManager.phases[phase];

                    _this.moduleManager.events.emit(`bundle-before-${ phase }`, bundleConfig, bundle);

                    if (phaseOps.length > 0) {
                        const promises = new Array(opsLength);

                        for (let i = 0; i < opsLength; i++) {
                            promises[i] = runnerOpSets[i].exec(phase, phaseOps);
                        }

                        yield Promise.all(promises);
                    }

                    _this.moduleManager.events.emit(`bundle-after-${ phase }`, bundleConfig, bundle);
                }

                for (let i = 0; i < opsLength; i++) {
                    runnerOpSets[i].outputFiles();
                }
            } catch (ex) {
                if (ex instanceof TaskException) {
                    console.log(ex.export());
                } else {
                    console.log(ex);
                }
            }
        })();
    }

    run(preset, options) {
        var _this2 = this;

        return _asyncToGenerator(function* () {
            const bundleOnly = options.bundle !== undefined,
                  config = _this2.config.content;

            let bundleCount = 0;

            _this2.moduleManager.events.emit(`runner-before`, config);
            for (let bundle in config) {
                if (bundle === 'global' || bundle === 'common') {
                    continue;
                }
                if (bundleOnly && options.bundle !== bundle) {
                    continue;
                }

                bundleCount++;
                yield _this2.runBundle(preset, bundle);
            }
            _this2.moduleManager.events.emit(`runner-after`, config);

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