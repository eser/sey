import deepmerge from 'deepmerge';

let less = function () {
    let lessLib = null;

    this.processBundle = async (bundle, files) => {
        let options = {
        };
        
        if (bundle.config.lessConfig !== undefined && bundle.config.lessConfig !== null) {
            options = deepmerge(bundle.config.lessConfig, options);
        }

        for (let fileKey in files) {
            let file = files[fileKey],
                token = file.addTask('less');

            if (token.cached) {
                continue;
            }

            // load on demand
            if (lessLib === null) {
                lessLib = require('less');
            }

            options.filename = file.relativeFile;

            let content = file.getPreviousContent();

            let result = await lessLib.parse(options, content);
            file.updateContent(result.css);
        }

        return files;
    };
};

export default less;
