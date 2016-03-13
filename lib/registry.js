'use strict';

const pathLib = require('path'),
      fs = require('fs'),
      configBundle = require('./configBundle.js');

class registry {
    constructor() {
        this.tasks = {};
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
        if (name in this.tasks) {
            return;
        }

        const task = new taskObject();

        for (let taskInfoItem of taskObject.info) {
            this.phases[taskInfoItem.phase].push({
                op: taskInfoItem.op,
                task: name,
                formats: taskInfoItem.formats.constructor === Array ? taskInfoItem.formats : [taskInfoItem.formats],
                weight: taskInfoItem.weight,
                method: taskInfoItem.method
            });

            configBundle.addOp(taskInfoItem.op);
        }

        this.tasks[name] = task;
    }

    loadFromFile(filepath) {
        const basename = pathLib.basename(filepath, '.js'),
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
        const normalizedPath = pathLib.join(__dirname, './tasks'),
              files = fs.readdirSync(normalizedPath);

        for (let item of files) {
            this.loadFromFile('./tasks/' + item);
        }

        this.sort();
    }
}

module.exports = registry;