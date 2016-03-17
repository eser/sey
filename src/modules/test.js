'use strict';

const deepmerge = require('../utils/deepmerge.js');

class test {
    onLoad(registry) {
        registry.addTask(this, {
            phase: 'testing',
            formats: 'js',
            op: 'test',
            weight: 0.5,
            method: 'exec'
        });
    }

    async exec(value, runnerOpSet, files) {
    }
}

module.exports = test;
