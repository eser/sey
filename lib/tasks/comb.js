'use strict';

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

const deepmerge = require('../utils/deepmerge.js');

class comb {
    exec(runnerOp, files) {
        var _this = this;

        return _asyncToGenerator(function* () {
            let options = {
                'remove-empty-rulesets': true,
                'always-semicolon': true,
                'color-case': 'upper',
                'block-indent': '    ',
                'color-shorthand': false,
                'element-case': 'lower',
                'eof-newline': true,
                'leading-zero': true,
                'quotes': 'single',
                'space-before-colon': '',
                'space-after-colon': ' ',
                'space-before-combinator': ' ',
                'space-after-combinator': ' ',
                'space-between-declarations': '\n',
                'space-before-opening-brace': ' ',
                'space-after-opening-brace': '\n',
                'space-after-selector-delimiter': ' ',
                'space-before-selector-delimiter': '',
                'space-before-closing-brace': '\n',
                'strip-spaces': true,
                'tab-size': 4,
                'unitless-zero': true,
                'vendor-prefix-align': true,
                'verbose': true
            };
            if (runnerOp.config.csscomb !== undefined) {
                deepmerge(options, runnerOp.config.csscomb);
            }

            for (let file of files) {
                const content = file.getContent();

                if (_this._csscombLib === undefined) {
                    const csscomb = require('csscomb');
                    _this._csscombLib = new csscomb(options, 'css');
                }

                const result = _this._csscombLib.processString(content);
                file.setContent(result);
            }
        })();
    }
}

module.exports = comb;