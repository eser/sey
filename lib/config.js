'use strict';

const deepmerge = require('./utils/deepmerge.js'),
      configBundle = require('./configBundle.js');

class config {
    constructor(initialContent) {
        this.content = initialContent || {};
        this.bundles = {};
    }

    load(content) {
        this.content = content;
    }

    merge(content) {
        deepmerge(this.content, content);
    }

    save() {
        return this.content;
    }

    bundle(name) {
        if (!(name in this.bundles)) {
            this.bundles[name] = new configBundle(this, name);
        }

        return this.bundles[name];
    }
}

module.exports = config;