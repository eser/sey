'use strict';

const deepmerge = require('./utils/deepmerge.js'),
      ConfigBundle = require('./ConfigBundle.js');

class Config {
    constructor(initialContent) {
        this.content = {
            global: {
                presets: {
                    lint: ['init', 'preprocess', 'lint', 'finalize'],
                    build: ['init', 'preprocess', 'lint', 'compile', 'bundling', 'finalize'],
                    publish: ['init', 'preprocess', 'lint', 'compile', 'bundling', 'optimization', 'branding', 'finalize'],
                    test: ['init', 'preprocess', 'lint', 'compile', 'bundling', 'optimization', 'branding', 'testing', 'finalize'],
                    server: ['init', 'preprocess', 'lint', 'compile', 'bundling', 'optimization', 'branding', 'finalize', 'development-server'],
                    deploy: ['init', 'preprocess', 'lint', 'compile', 'bundling', 'optimization', 'branding', 'finalize', 'deploy']
                }
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

    save() {
        return this.content;
    }

    bundle(name) {
        if (!(name in this.bundles)) {
            this.bundles[name] = new ConfigBundle(this, name);
        }

        return this.bundles[name];
    }

    setGlobal(options) {
        this.bundle('global').set(options);
    }
}

module.exports = Config;