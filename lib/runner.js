'use strict';

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

const chalk = require('chalk'),
      deepmerge = require('./utils/deepmerge.js'),
      runnerOp = require('./runnerOp.js');

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
            if (config.ops !== undefined) {
                for (let item of config.ops) {
                    const op = new runnerOp(name, item, config);
                    yield op.start();
                }
            }
        })();
    }

    run() {
        var _this2 = this;

        return _asyncToGenerator(function* () {
            for (let bundle in _this2.config.content) {
                if (bundle === 'global') {
                    continue;
                }

                yield _this2.runBundle(bundle);
            }
        })();
    }
}

module.exports = runner;