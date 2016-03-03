'use strict';

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

const chalk = require('chalk'),
      deepmerge = require('./utils/deepmerge.js'),
      fsManager = require('./utils/fsManager.js'),
      runnerOp = require('./runnerOp.js'),
      taskException = require('./taskException.js');

class runner {
    constructor(config) {
        this.config = config;
    }

    getBundleConfig(name) {
        let config = {};

        if (this.config.content.global !== undefined) {
            deepmerge(config, this.config.content.global);
        }

        if (this.config.content[name] !== undefined) {
            deepmerge(config, this.config.content[name]);
        }

        return config;
    }

    runBundle(name) {
        var _this = this;

        return _asyncToGenerator(function* () {
            const config = _this.getBundleConfig(name);

            console.log(chalk.green('bundle:'), chalk.bold.white(name));
            try {
                if (config.clean.beforeBuild !== undefined) {
                    const pathArray = config.clean.beforeBuild.constructor === Array ? config.clean.beforeBuild : [config.clean.beforeBuild];

                    for (let path of pathArray) {
                        console.log(chalk.gray('  cleaning', path));
                        fsManager.rmdir(path);
                    }
                }

                if (config.ops !== undefined) {
                    for (let key in config.ops) {
                        console.log(chalk.green('  op #' + key));
                        const op = new runnerOp(name, config.ops[key], config);
                        yield op.start();
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

    run(options) {
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
                yield _this2.runBundle(bundle);
            }

            if (bundleOnly && bundleCount === 0) {
                console.log(chalk.red('no such bundle named', options.bundle));
            }

            return bundleCount > 0;
        })();
    }
}

module.exports = runner;