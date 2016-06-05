'use strict';

const path = require('path'),
      fs = require('fs'),
      EventEmitter = require('events');

class ModuleManager {
    constructor() {
        this.modules = {};
        this.events = new EventEmitter();
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

    init() {
        const normalizedPath = path.join(__dirname, './modules'),
              files = fs.readdirSync(normalizedPath);

        for (let item of files) {
            this.loadFromFile(`./modules/${ item }`);
        }

        this.sort();
    }

    registerOps(config) {
        for (let taskInfoKey in this.phases) {
            const taskInfo = this.phases[taskInfoKey];

            config.addOp(taskInfo.op);
        }
    }

    sort() {
        const phasesSort = (a, b) => {
            return b.weight - a.weight;
        };

        for (let phaseKey in this.phases) {
            this.phases[phaseKey].sort(phasesSort);
        }
    }

    addTask(task, taskInfo) {
        const name = task.constructor.name;

        this.phases[taskInfo.phase].push({
            op: taskInfo.op,
            task: name,
            formats: taskInfo.formats.constructor === Array ? taskInfo.formats : [taskInfo.formats],
            weight: taskInfo.weight,
            method: taskInfo.method
        });
    }

    load(obj) {
        const name = obj.name,
              newInstance = new obj();

        if (!(name in this.modules)) {
            this.modules[name] = newInstance;
        }

        newInstance.onLoad(this);
    }

    loadFromFile(filepath) {
        const obj = require(filepath);

        this.load(obj);
    }
}

module.exports = ModuleManager;