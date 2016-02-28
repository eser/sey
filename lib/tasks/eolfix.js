'use strict';

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

class eolfix {
    exec(value, runnerOp, files) {
        return _asyncToGenerator(function* () {
            for (let file of files) {
                let content = file.getContent();
                file.setContent(content.replace(/(?:\r\n|\r)/g, '\n'));
            }
        })();
    }
}

module.exports = eolfix;