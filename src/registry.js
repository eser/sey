const pathLib = require('path'),
    fs = require('fs'),
    EventEmitter = require('events'),
    configBundle = require('./configBundle.js');

class registry {
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
        const normalizedPath = pathLib.join(__dirname, './modules'),
            files = fs.readdirSync(normalizedPath);

        for (let item of files) {
            this.loadFromFile(`./modules/${item}`);
        }

        this.sort();
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
            formats: (taskInfo.formats.constructor === Array) ? taskInfo.formats : [ taskInfo.formats ],
            weight: taskInfo.weight,
            method: taskInfo.method
        });

        configBundle.addOp(taskInfo.op);
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

let instance = new registry();

instance.init();

module.exports = instance;
