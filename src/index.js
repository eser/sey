'use strict';

const path = require('path'),
    chalk = require('chalk'),
    fsManager = require('./utils/fsManager.js'),
    config = require('./config.js'),
    registry = require('./registry.js'),
    runner = require('./runner.js');

class sey {
    static preload() {
        this.config = config;
        this.options = {};

        this.registry = new registry();
        this.registry.load();

        this.workingPath = path.join(process.cwd(), '.sey');
    }

    static setOptions(options) {
        this.options = options;
    }

    static initFile(file, preferApi, override) {
        if (fsManager.exists(file) && !override) {
            console.log(chalk.red('Aborted. File already exists:'), chalk.gray(file));
            return;
        }

        const sampleFile = (preferApi) ? 'seyfile.api.sample.js' : 'seyfile.config.sample.js',
            content = fsManager.readFile(__dirname + '/../etc/' + sampleFile);

        fsManager.writeFile(file, content);

        console.log(chalk.white('File created:'), chalk.gray(file));
    }

    static clean() {
        fsManager.rmdir(this.workingPath);

        console.log(chalk.white('Working path is cleaned.'));
    }

    static selfCheck() {
        return [];
    }

    static async run(configInstance) {
        let currentConfig;

        if (configInstance instanceof config) {
            currentConfig = configInstance;
        } else {
            currentConfig = new config(configInstance);
        }

        const currentRunner = new runner(currentConfig);

        return await currentRunner.run(this.options);
    }
}

sey.preload();

module.exports = sey;
