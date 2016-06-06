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
        if ((this.config.target === undefined && target === 'node') ||
            (this.config.target === target)) {
            return true;
        }

        return false;
    }

    getStandard() {
        return this.config.standard || 2016;
    }

    isStandard(standard) {
        if ((this.config.standard === undefined && standard >= 2016) ||
            (this.config.standard >= standard)) {
            return true;
        }

        return false;
    }

    async run(preset) {
        console.log(chalk.green('bundle:'), chalk.bold.white(this.name));

        if (this.config.ops === undefined) {
            return;
        }

        const opsLength = this.config.ops.length,
            runnerOpSets = new Array(opsLength);

        for (let i = 0; i < opsLength; i++) {
            const bundleOpSetConfig = this.config.ops[i];

            runnerOpSets[i] = new RunnerOpSet(bundleOpSetConfig, this, this.moduleManager);
        }

        for (let phase of this.moduleManager.presets[preset]) {
            const phaseOps = this.moduleManager.phases[phase];

            this.moduleManager.events.emit(`bundle-before-${phase}`, this.config, this.name);

            if (phaseOps.length > 0) {
                const promises = new Array(opsLength);

                for (let i = 0; i < opsLength; i++) {
                    promises[i] = runnerOpSets[i].exec(phase, phaseOps);
                }

                await Promise.all(promises);
            }

            this.moduleManager.events.emit(`bundle-after-${phase}`, this.config, this.name);
        }

        for (let i = 0; i < opsLength; i++) {
            runnerOpSets[i].outputFiles();
        }
    }
}

module.exports = RunnerBundle;
