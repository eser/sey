'use strict';

const path = require('path'),
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

    static initFile(file) {
        const content = fsManager.readFile(__dirname + '/../seyfile.sample.js');
        fsManager.writeFile(file, content);
    }

    static clean() {
        fsManager.rmdir(this.workingPath);
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
