'use strict';

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

const chalk = require('chalk'),
      OpSet = require('./OpSet.js');

class Bundle {
    constructor(name, config, runner) {
        this.name = name;
        this.config = config;
        this.runner = runner;
        // this.opSets = [];
    }

    load() {
        const opsLength = this.config.ops !== undefined ? this.config.ops.length : 0;

        this.opSets = new Array(opsLength);

        if (opsLength === 0) {
            return;
        }

        for (let i = 0; i < opsLength; i++) {
            const bundleOpSetConfig = this.config.ops[i];

            this.opSets[i] = new OpSet(bundleOpSetConfig, this);
            // this.opSets[i].load();
        }
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

    populateFiles(preset, lockFileInstance) {
        for (let opSetName in this.opSets) {
            this.opSets[opSetName].populateFiles(lockContent);
        }
    }

    run(preset) {
        var _this = this;

        return _asyncToGenerator(function* () {
            console.log(chalk.green('bundle:'), chalk.bold.white(_this.name));

            const opsLength = _this.opSets.length;

            for (let phase of _this.runner.moduleManager.presets[preset]) {
                const phaseOps = _this.runner.moduleManager.phases[phase];

                _this.runner.moduleManager.events.emit(`bundle-before-${ phase }`, _this.config, _this.name);

                if (phaseOps.length > 0) {
                    const promises = new Array(opsLength);

                    for (let i = 0; i < opsLength; i++) {
                        promises[i] = _this.opSets[i].exec(phase, phaseOps);
                    }

                    yield Promise.all(promises);
                }

                _this.runner.moduleManager.events.emit(`bundle-after-${ phase }`, _this.config, _this.name);
            }

            for (let i = 0; i < opsLength; i++) {
                _this.opSets[i].outputFiles();
            }
        })();
    }
}

module.exports = Bundle;