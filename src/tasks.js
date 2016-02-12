'use strict';

const path = require('path'),
    fs = require('fs'),
    configBundle = require('./configBundle.js');

class tasks {
    constructor() {
        this.items = {};
    }

    load() {
        const normalizedPath = path.join(__dirname, './tasks'),
            files = fs.readdirSync(normalizedPath);

        for (let item of files) {
            const basename = path.basename(item, '.js'),
                taskObject = require('./tasks/' + item);

            this.define(basename, taskObject);
        }
    }

    define(name, taskObject) {
        if (name in this.items) {
            return;
        }

        this.items[name] = new taskObject();
        configBundle.addTask(name);
    }
}

module.exports = tasks;