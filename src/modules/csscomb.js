const deepmerge = require('../utils/deepmerge.js');

class csscomb {
    onLoad(registry) {
        registry.addTask(this, {
            phase: 'optimization',
            formats: 'css',
            op: 'optimize',
            weight: 0.8,
            method: 'exec'
        });
    }

    async exec(value, runnerOpSet, files) {
        const options = {
            'remove-empty-rulesets': true,
            'always-semicolon': true,
            'color-case': 'upper',
            'block-indent': '    ',
            'color-shorthand': false,
            'element-case': 'lower',
            'eof-newline': true,
            'leading-zero': true,
            quotes: 'single',
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
            verbose: true
        };

        if (runnerOpSet.config.csscomb !== undefined) {
            deepmerge(options, runnerOpSet.config.csscomb);
        }

        for (let file of files) {
            const content = file.getContent();

            if (this._csscombInstance === undefined) {
                const csscombType = require('csscomb');

                this._csscombInstance = new csscombType(options, 'css');
            }

            const result = this._csscombInstance.processString(content);

            file.setContent(result);
        }
    }
}

module.exports = csscomb;
