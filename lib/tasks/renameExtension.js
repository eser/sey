'use strict';

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

class renameExtension {
    exec(value, runnerOp, files) {
        return _asyncToGenerator(function* () {
            for (let file of files) {
                file.setExtension(value);
            }
        })();
    }
}

renameExtension.info = [{
    phase: 'bundling',
    formats: '*',
    op: 'renameExtension',
    weight: 0.5,
    method: 'exec'
}];

module.exports = renameExtension;