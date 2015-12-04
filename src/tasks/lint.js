let lint = function () {
    let self = this,
        linter = null;

    self.processBundle = async function (bundle, files) {
        let config;

        if (bundle.config.eslintConfig !== undefined && bundle.config.eslintConfig !== null) {
            config = bundle.config.eslintConfig;
        } else {
            config = {};
        }

        for (let fileKey in files) {
            let file = files[fileKey],
                token = file.addTask('lint');

            if (token.cached) {
                continue;
            }

            // load on demand
            if (linter === null) {
                let eslint = require('eslint');
                linter = new eslint.CLIEngine(config);
            }

            let content = file.getPreviousContent(),
                report = linter.executeOnText(content, file.relativeFile);

            for (let i = 0, length = report.results.length; i < length; i++) {
                let result = report.results[i];

                if (result.errorCount === 0 && result.warningCount === 0) {
                    continue;
                }

                reject(result);
                // console.log(result);
                // process.exit(0);
                return;
            }

            file.updateContent(content);
        }
    
        return files;
    };
};

export default lint;
