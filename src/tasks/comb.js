'use strict';

const deepmerge = require('../utils/deepmerge.js');

class comb {
    async exec(value, runnerOp, files) {
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

            if (this._csscombLib === undefined) {
                const csscomb = require('csscomb');
                this._csscombLib = new csscomb(options, 'css');
            }

            const result = this._csscombLib.processString(content);
            file.setContent(result);
        }
    }
}

comb.info = [
    {
        phase: 'optimization',
        formats: 'css',
        op: 'optimize',
        weight: 0.5,
        method: 'exec'
    }
];

module.exports = comb;
