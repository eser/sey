'use strict';

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

const deepmerge = require('../utils/deepmerge.js');

class sass {
    exec(value, runnerOp, files) {
        var _this = this;

        return _asyncToGenerator(function* () {
            let options = {};
            if (runnerOp.config.sass !== undefined) {
                deepmerge(options, runnerOp.config.sass);
            }

            for (let file of files) {
                let content = file.getContent();

                if (_this._sassLib === undefined) {
                    _this._sassLib = require('node-sass');
                }

                options.data = content;
                let result = _this._sassLib.renderSync(options);

                file.setExtension('css');
                file.setContent(result.css.toString());
            }
        })();
    }
}

sass.info = [{
    phase: 'compile',
    formats: 'scss',
    op: 'transpile',
    weight: 0.5,
    method: 'exec'
}];

module.exports = sass;