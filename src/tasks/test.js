'use strict';

const deepmerge = require('../utils/deepmerge.js');

class test {
    async exec(value, runnerOpSet, files) {
    }
}

test.info = [
    {
        phase: 'testing',
        formats: 'js',
        op: 'test',
        weight: 0.5,
        method: 'exec'
    }
];

module.exports = test;
