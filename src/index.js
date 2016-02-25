'use strict';

const path = require('path'),
    chalk = require('chalk'),
    fsManager = require('./utils/fsManager.js'),
    config = require('./config.js'),
    tasks = require('./tasks.js'),
    runner = require('./runner.js');

class sey {
    static preload() {
        this.config = config;

        this.tasks = new tasks();
        this.tasks.load();

        this.workingPath = path.join(process.cwd(), '.sey');
    }

    static initFile(file, override) {
        if (fsManager.exists(file) && !override) {
            console.log(chalk.red('Aborted. File already exists:'), chalk.gray(file));
            return;
        }

        const content = fsManager.readFile(__dirname + '/../seyfile.sample.js');
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
        await currentRunner.run();

        return true;
    }
}

sey.preload();

module.exports = sey;
