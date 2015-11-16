var lint = function (context) {
    var self = this,
        eslint = null,
        config = null;

    self.processBundle = function (files) {
        if (eslint === null) {
            eslint = require('eslint');

            if (context.bundleConfig.eslintConfig !== undefined && context.bundleConfig.eslintConfig !== null) {
                config = context.bundleConfig.eslintConfig;
            } else {
                config = {};
            }
        }

        var linter = new eslint.CLIEngine(config);

        for (var file in files) {
            var report = linter.executeOnText(files[file].content, files[file].file);

            for (var i = 0, length = report.results.length; i < length; i++) {
                var result = report.results[i];

                if (result.errorCount === 0 && result.warningCount === 0) {
                    continue;
                }

                console.log(result);
                process.exit(0);
            }
        }

        return files;
    };
};

module.exports = lint;
