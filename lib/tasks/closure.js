'use strict';

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

const deepmerge = require('../utils/deepmerge.js');

class closure {
    exec(runnerOp, files) {
        /*
        let options = {};
        if (runnerOp.config.closure !== undefined) {
            deepmerge(options, runnerOp.config.closure);
        }
         for (let file of files) {
            const content = file.getContent();
             if (this._closureLib === undefined) {
                this._closureLib = require('closurecompiler');
            }
             options.filename = file.file.fullpath;
            // options.filenameRelative = file.file.path;
            // options.sourceFileName = file.file.path;
             // TODO FIXME write content into a temporary file?
            // TODO callback mechanism
            const result = this._closureLib.compile(content, options);
             file.setContent(result.code);
        }
        */

        return _asyncToGenerator(function* () {})();
    }
}

module.exports = closure;