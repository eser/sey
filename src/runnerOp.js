'use strict';

const runnerOpFile = require('./runnerOpFile.js');

class runnerOp {
    constructor(bundleName, op, config) {
        this.bundleName = bundleName;
        this.op = op;
        this.config = config;
    }

    loadFiles() {
        this._files = [];

    }

    start() {
        console.log('op: ', this.op);
    }
}

module.exports = runnerOp;
