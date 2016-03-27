const deepmerge = require('./utils/deepmerge.js'),
    configBundle = require('./configBundle.js');

class config {
    constructor(initialContent) {
        this.content = {
            presets: {
                lint: [ 'init', 'preprocess', 'lint', 'finalize' ],
                build: [ 'init', 'preprocess', 'lint', 'compile', 'bundling', 'finalize' ],
                publish: [ 'init', 'preprocess', 'lint', 'compile', 'bundling', 'optimization', 'branding', 'finalize' ],
                test: [ 'init', 'preprocess', 'lint', 'compile', 'bundling', 'optimization', 'branding', 'testing', 'finalize' ],
                server: [ 'init', 'preprocess', 'lint', 'compile', 'bundling', 'optimization', 'branding', 'finalize', 'development-server' ],
                deploy: [ 'init', 'preprocess', 'lint', 'compile', 'bundling', 'optimization', 'branding', 'finalize', 'deploy' ]
            }
        };

        if (initialContent !== undefined) {
            this.merge(initialContent);
        }

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
