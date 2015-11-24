var lint = function () {
    var self = this,
        linter = null;

    self.processBundle = function (bundle, files) {
        var config;

        if (bundle.config.eslintConfig !== undefined && bundle.config.eslintConfig !== null) {
            config = bundle.config.eslintConfig;
        } else {
            config = {};
        }

        for (var fileKey in files) {
            var file = files[fileKey],
                token = file.addTask('lint');

            if (token.cached) {
                continue;
            }

            // load on demand
            if (linter === null) {
                var eslint = require('eslint');
                linter = new eslint.CLIEngine(config);
            }

            var content = file.getPreviousContent(),
                report = linter.executeOnText(content, file.relativeFile);

            for (var i = 0, length = report.results.length; i < length; i++) {
                var result = report.results[i];

                if (result.errorCount === 0 && result.warningCount === 0) {
                    continue;
                }

                console.log(result);
                process.exit(0);
            }

            file.updateContent(content);
        }

        return files;
    };
};

module.exports = lint;
