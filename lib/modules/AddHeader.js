'use strict';

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

class AddHeader {
    onLoad(moduleManager) {
        moduleManager.addTask(this, {
            phase: 'branding',
            formats: '*',
            op: 'addheader',
            weight: 0.5,
            method: 'exec'
        });
    }

    exec(value, opSet, opFiles) {
        return _asyncToGenerator(function* () {
            if (opSet.bundle.config.banner === undefined) {
                return;
            }

            /*
            for (let opFile of opFiles) {
                const content = opFile.getContent();
                 opFile.setContent(opSet.bundle.config.banner + content);
            }
            */

            return {
                processedFiles: opFiles
            };
        })();
    }
}

module.exports = AddHeader;