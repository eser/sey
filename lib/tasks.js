'use strict';

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

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

    exec(name, runnerOp, modifiedFiles) {
        var _this = this;

        return _asyncToGenerator(function* () {
            if (_this.items[name] === undefined) {
                throw Error('undefined task - ' + name);
            }

            return yield _this.items[name].exec(runnerOp, modifiedFiles);
        })();
    }
}

module.exports = tasks;