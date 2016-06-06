'use strict';

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

const chalk = require('chalk'),
      RunnerOpSet = require('./RunnerOpSet.js');

class RunnerBundle {
    constructor(name, config, moduleManager) {
        this.name = name;
        this.config = config;
        this.moduleManager = moduleManager;
    }

    getTarget() {
        return this.config.target || 'node';
    }

    isTargeting(target) {
        if (this.config.target === undefined && target === 'node' || this.config.target === target) {
            return true;
        }

        return false;
    }

    getStandard() {
        return this.config.standard || 2016;
    }

    isStandard(standard) {
        if (this.config.standard === undefined && standard >= 2016 || this.config.standard >= standard) {
            return true;
        }

        return false;
    }

    run(preset) {
        var _this = this;

        return _asyncToGenerator(function* () {
            console.log(chalk.green('bundle:'), chalk.bold.white(_this.name));

            if (_this.config.ops === undefined) {
                return;
            }

            const opsLength = _this.config.ops.length,
                  runnerOpSets = new Array(opsLength);

            for (let i = 0; i < opsLength; i++) {
                const bundleOpSetConfig = _this.config.ops[i];

                runnerOpSets[i] = new RunnerOpSet(bundleOpSetConfig, _this, _this.moduleManager);
            }

            for (let phase of _this.moduleManager.presets[preset]) {
                const phaseOps = _this.moduleManager.phases[phase];

                _this.moduleManager.events.emit(`bundle-before-${ phase }`, _this.config, _this.name);

                if (phaseOps.length > 0) {
                    const promises = new Array(opsLength);

                    for (let i = 0; i < opsLength; i++) {
                        promises[i] = runnerOpSets[i].exec(phase, phaseOps);
                    }

                    yield Promise.all(promises);
                }

                _this.moduleManager.events.emit(`bundle-after-${ phase }`, _this.config, _this.name);
            }

            for (let i = 0; i < opsLength; i++) {
                runnerOpSets[i].outputFiles();
            }
        })();
    }
}

module.exports = RunnerBundle;