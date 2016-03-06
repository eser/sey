'use strict';

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

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
                formats: taskInfoItem.formats.constructor === Array ? taskInfoItem.formats : [taskInfoItem.formats],
                weight: taskInfoItem.weight,
                method: taskInfoItem.method
            });
        }

        this.items[name] = task;
        configBundle.addTask(name);
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

        // console.log(JSON.stringify(this.phases));
        // process.exit(0);
    }

    exec(name, value, runnerOp, modifiedFiles) {
        var _this = this;

        return _asyncToGenerator(function* () {
            if (_this.items[name] === undefined) {
                throw Error('undefined task - ' + name);
            }

            return yield _this.items[name].exec(value, runnerOp, modifiedFiles);
        })();
    }
}

module.exports = registry;