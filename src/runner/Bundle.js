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
        const opsLength = (this.config.ops !== undefined) ? this.config.ops.length : 0;

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

    populateFiles(lockContent) {
        for (let opSetName in this.opSets) {
            this.opSets[opSetName].populateFiles(lockContent);
        }
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

        const opsLength = this.opSets.length;

        for (let phase of this.runner.moduleManager.presets[preset]) {
            const phaseOps = this.runner.moduleManager.phases[phase];

            this.runner.moduleManager.events.emit(`bundle-before-${phase}`, this.config, this.name);

            if (phaseOps.length > 0) {
                const promises = new Array(opsLength);

                for (let i = 0; i < opsLength; i++) {
                    promises[i] = this.opSets[i].exec(phase, phaseOps);
                }

                await Promise.all(promises);
            }

            this.runner.moduleManager.events.emit(`bundle-after-${phase}`, this.config, this.name);
        }

        for (let i = 0; i < opsLength; i++) {
            this.opSets[i].outputFiles();
        }
    }
}

module.exports = Bundle;
