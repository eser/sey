'use strict';

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

class addheader {
    exec(runnerOp, files) {
        return _asyncToGenerator(function* () {
            if (runnerOp.config.banner === undefined) {
                return;
            }

            for (let file of files) {
                let content = file.getContent();
                file.setContent(runnerOp.config.banner + content);
            }
        })();
    }
}

module.exports = addheader;