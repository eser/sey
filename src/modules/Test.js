const deepmerge = require('../utils/deepmerge.js');

class Test {
    onLoad(moduleManager) {
        moduleManager.addTask(this, {
            phase: 'testing',
            formats: 'js',
            op: 'test',
            weight: 0.5,
            method: 'exec'
        });
    }

    async exec(value, runnerOpSet, files) {
        return {
            processedFiles: files
        };
    }
}

module.exports = Test;
