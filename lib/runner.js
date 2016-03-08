'use strict';

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

const chalk = require('chalk'),
      deepmerge = require('./utils/deepmerge.js'),

// fsManager = require('./utils/fsManager.js'),
runnerOpSet = require('./runnerOpSet.js'),
      taskException = require('./taskException.js');

class runner {
    constructor(config) {
        this.config = config;
        this.presets = {
            'lint': ['init', 'preprocess', 'lint', 'finalize'],
            'build': ['init', 'preprocess', 'lint', 'compile', 'bundling', 'finalize'],
            'publish': ['init', 'preprocess', 'lint', 'compile', 'bundling', 'optimization', 'branding', 'finalize'],
            'test': ['init', 'preprocess', 'lint', 'compile', 'bundling', 'optimization', 'branding', 'testing', 'finalize'],
            'server': ['init', 'preprocess', 'lint', 'compile', 'bundling', 'optimization', 'branding', 'finalize', 'development-server'],
            'deploy': ['init', 'preprocess', 'lint', 'compile', 'bundling', 'optimization', 'branding', 'finalize', 'deploy']
        };
    }

    getBundleConfig(bundle) {
        let config = {};

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
                // if (config.clean !== undefined && config.clean.beforeBuild !== undefined) {
                //     const pathArray = (config.clean.beforeBuild.constructor === Array) ?
                //         config.clean.beforeBuild :
                //         [config.clean.beforeBuild];
                //
                //     for (let path of pathArray) {
                //         console.log(chalk.gray('  cleaning', path));
                //         fsManager.rmdir(path);
                //     }
                // }

                if (config.ops !== undefined) {
                    let runnerOpSets = [];
                    for (let i = 0, length = config.ops.length; i < length; i++) {
                        runnerOpSets.push(new runnerOpSet(bundle, config.ops[i], config));
                    }

                    for (let phase of _this.presets[preset]) {
                        const phaseOps = sey.registry.phases[phase];

                        for (let currentRunnerOpSet of runnerOpSets) {
                            // FIXME: await Promise.all([]) for each phase?
                            yield currentRunnerOpSet.exec(phase, phaseOps);
                        }
                    }
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
                if (bundle === 'global') {
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
            }

            return bundleCount > 0;
        })();
    }
}

module.exports = runner;