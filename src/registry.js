'use strict';

const path = require('path'),
    fs = require('fs'),
    configBundle = require('./configBundle.js');

class registry {
    constructor() {
        this.items = {};
        this.phases = {
            'init': [],
            'preprocess': [],
            'lint': [],
            'compile': [],
            'bundling': [],
            'optimization': [],
            'branding': [],
            'testing': [],
            'finalize': [],
            'development-server': [],
            'deploy': []
        };
    }

    define(name, taskObject) {
        if (name in this.items) {
            return;
        }

        const task = new taskObject();

        for (let taskInfoItem of taskObject.info) {
            this.phases[taskInfoItem.phase].push({
                op: taskInfoItem.op,
                task: name,
                formats: (taskInfoItem.formats.constructor === Array) ? taskInfoItem.formats : [taskInfoItem.formats],
                weight: taskInfoItem.weight,
                method: taskInfoItem.method
            });

            configBundle.addOp(taskInfoItem.op);
        }

        this.items[name] = task;
    }

    loadFromFile(filepath) {
        const basename = path.basename(filepath, '.js'),
            taskObject = require(filepath);

        this.define(basename, taskObject);
    }

    sort() {
        const phasesSort = (a, b) => {
            return b.weight - a.weight;
        };

        for (let phaseKey in this.phases) {
            this.phases[phaseKey].sort(phasesSort);
        }
    }

    load() {
        const normalizedPath = path.join(__dirname, './tasks'),
            files = fs.readdirSync(normalizedPath);

        for (let item of files) {
            this.loadFromFile('./tasks/' + item);
        }

        this.sort();
    }

    // async exec(name, value, runnerOpSet, modifiedFiles) {
    //     if (this.items[name] === undefined) {
    //         throw Error('undefined task - ' + name);
    //     }
    //
    //     return await this.items[name].exec(value, runnerOpSet, modifiedFiles);
    // }
}

module.exports = registry;
