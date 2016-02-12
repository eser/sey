import deepmerge from 'deepmerge';

let transpile = function () {
    let babel = null;

    this.processBundle = async (bundle, files) => {
        let options = {
            ast: false,
            presets: ['es2015'],

            ignore: /(bower_components)|(node_modules)/,
            only: null
        };
        
        if (bundle.config.babelConfig !== undefined && bundle.config.babelConfig !== null) {
            options = deepmerge(bundle.config.babelConfig, options);
        }

        for (let fileKey in files) {
            let file = files[fileKey],
                token = file.addTask('preprocess');

            if (token.cached) {
                continue;
            }

            // load on demand
            if (babel === null) {
                babel = require('babel-core');
            }

            options.filename = file.relativeFile;

            let content = file.getPreviousContent(),
                result = babel.transform(content, options);

            file.updateContent(result.code);
        }

        return files;
    };
};

export default transpile;
