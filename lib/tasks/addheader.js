'use strict';

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

class addheader {
    exec(value, runnerOpSet, files) {
        return _asyncToGenerator(function* () {
            if (runnerOpSet.config.banner === undefined) {
                return;
            }

            for (let file of files) {
                let content = file.getContent();
                file.setContent(runnerOpSet.config.banner + content);
            }
        })();
    }
}

addheader.info = [{
    phase: 'branding',
    formats: '*',
    op: 'addheader',
    weight: 0.5,
    method: 'exec'
}];

module.exports = addheader;