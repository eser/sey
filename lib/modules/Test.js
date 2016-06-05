'use strict';

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

const deepmerge = require('../utils/deepmerge.js');

class Test {
    onLoad(moduleManager) {
        moduleManager.addTask(this, {
            phase: 'testing',
            formats: 'js',
            op: 'test',
            weight: 0.5,
            method: 'exec'
        });
    }

    exec(value, runnerOpSet, files) {
        return _asyncToGenerator(function* () {})();
    }
}

module.exports = Test;