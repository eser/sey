const deepmerge = require('../utils/deepmerge.js');

class Config {
    constructor(initialContent) {
        this.content = initialContent || {};
    }

    load(config) {
        this.content = config;
    }

    merge(config) {
        deepmerge(this.content, config);
    }

    save() {
        return this.content;
    }

    set(name, value) {
        this.content[name] = value;
    }

    get(name) {
        return this.content[name];
    }
}

module.exports = Config;
