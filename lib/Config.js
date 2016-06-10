'use strict';

const deepmerge = require('./utils/deepmerge.js'),
      ConfigBundle = require('./ConfigBundle.js');

class Config {
    constructor(initialContent) {
        this.content = {
            global: {
                destination: './build/'
            }
        };

        if (initialContent !== undefined) {
            this.merge(initialContent);
        }

        this.bundles = {};
    }

    static addOp(name) {
        if (name in ConfigBundle.prototype) {
            return;
        }

        ConfigBundle.prototype[name] = function (value) {
            return this.op(name, value);
        };
    }

    load(content) {
        this.content = content;
    }

    merge(content) {
        deepmerge(this.content, content);
    }

    set(name, content) {
        const encapsulated = {};

        encapsulated[this.name] = content;

        this.merge(encapsulated);
    }

    save() {
        return this.content;
    }

    bundle(name) {
        if (!(name in this.bundles)) {
            this.bundles[name] = new ConfigBundle(this, name);
        }

        return this.bundles[name];
    }
}

module.exports = Config;