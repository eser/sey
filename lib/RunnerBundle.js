'use strict';

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

const chalk = require('chalk'),
      deepmerge = require('./utils/deepmerge.js'),
      RunnerOpSet = require('./RunnerOpSet.js'),
      TaskException = require('./TaskException.js');

class RunnerBundle {
    constructor(moduleManager, config, bundle) {
        this.moduleManager = moduleManager;
        this.config = config;
        this.bundle = bundle;

        this.sourcesToWatch = [];
    }

    getBundleConfig(bundle) {
        const bundleConfig = {};

        if ( /* bundle !== 'global' && bundle !== 'common' && */this.config.content.common !== undefined) {
            deepmerge(bundleConfig, this.config.content.common);
        }

        if (this.config.content[bundle] !== undefined) {
            deepmerge(bundleConfig, this.config.content[bundle]);
        }

        return bundleConfig;
    }

    run(preset) {
        var _this = this;

        return _asyncToGenerator(function* () {
            console.log(chalk.green('bundle:'), chalk.bold.white(_this.bundle));
            try {
                const bundleConfig = _this.getBundleConfig(_this.bundle);
                if (bundleConfig.ops === undefined) {
                    return;
                }

                const opsLength = bundleConfig.ops.length,
                      runnerOpSets = new Array(opsLength);

                for (let i = 0; i < opsLength; i++) {
                    const bundleOpConfig = bundleConfig.ops[i];

                    if (bundleOpConfig.src !== undefined) {
                        if (bundleOpConfig.src.constructor === Array) {
                            for (let bundleOpConfigSrcIndex in bundleOpConfig.src) {
                                _this.sourcesToWatch.push(bundleOpConfig.src[bundleOpConfigSrcIndex]);
                            }
                        } else {
                            _this.sourcesToWatch.push(bundleOpConfig.src);
                        }
                    }

                    runnerOpSets[i] = new RunnerOpSet(_this.moduleManager, _this.bundle, bundleConfig, bundleOpConfig);
                }

                for (let phase of _this.config.content.global.presets[preset]) {
                    const phaseOps = _this.moduleManager.phases[phase];

                    _this.moduleManager.events.emit(`bundle-before-${ phase }`, bundleConfig, _this.bundle);

                    if (phaseOps.length > 0) {
                        const promises = new Array(opsLength);

                        for (let i = 0; i < opsLength; i++) {
                            promises[i] = runnerOpSets[i].exec(phase, phaseOps);
                        }

                        yield Promise.all(promises);
                    }

                    _this.moduleManager.events.emit(`bundle-after-${ phase }`, bundleConfig, _this.bundle);
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
}

module.exports = RunnerBundle;