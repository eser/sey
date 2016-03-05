'use strict';

const deepmerge = require('../utils/deepmerge.js');

class test {
    info() {
        return [
            {
                phase: 'testing',
                formats: 'js',
                op: 'test',
                weight: 0.5,
                method: 'exec'
            }
        ];
    }

    async exec(value, runnerOp, files) {
    }
}

module.exports = test;
