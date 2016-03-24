'use strict';

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

const chalk = require('chalk'),
      deepmerge = require('./utils/deepmerge.js'),

// fsManager = require('./utils/fsManager.js'),
registry = require('./registry.js'),
      runnerOpSet = require('./runnerOpSet.js'),
      taskException = require('./taskException.js');

class runner {
    constructor(config) {
        this.config = config;
    }

    getBundleConfig(bundle) {
        const config = {};

        if (this.config.content.global !== undefined) {
            deepmerge(config, this.config.content.global);
        }

        if (this.config.content[bundle] !== undefined) {
            deepmerge(config, this.config.content[bundle]);
        }

        return config;
    }

    runBundle(preset, bundle) {
        var _this = this;

        return _asyncToGenerator(function* () {
            const config = _this.getBundleConfig(bundle);

            console.log(chalk.green('bundle:'), chalk.bold.white(bundle));
            try {
                if (config.ops === undefined) {
                    return;
                }

                const opsLength = config.ops.length,
                      runnerOpSets = new Array(opsLength);

                for (let i = 0; i < opsLength; i++) {
                    runnerOpSets[i] = new runnerOpSet(bundle, config.ops[i], config);
                }

                for (let phase of _this.config.content.presets[preset]) {
                    const phaseOps = registry.phases[phase];

                    registry.events.emit(`before-${ phase }`, config, bundle);

                    if (phaseOps.length > 0) {
                        const promises = new Array(opsLength);

                        for (let i = 0; i < opsLength; i++) {
                            promises[i] = runnerOpSets[i].exec(phase, phaseOps);
                        }

                        yield Promise.all(promises);
                    }

                    registry.events.emit(`after-${ phase }`, config, bundle);
                }

                for (let i = 0; i < opsLength; i++) {
                    runnerOpSets[i].outputFiles();
                }
            } catch (ex) {
                if (ex instanceof taskException) {
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
            const bundleOnly = options.bundle !== undefined;

            let bundleCount = 0;

            for (let bundle in _this2.config.content) {
                if (bundle === 'global' || bundle === 'presets') {
                    continue;
                }
                if (bundleOnly && options.bundle !== bundle) {
                    continue;
                }

                bundleCount++;
                yield _this2.runBundle(preset, bundle);
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

module.exports = runner;