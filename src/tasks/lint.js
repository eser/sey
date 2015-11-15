var lint = function (context) {
    var self = this,
        eslint = null;

    self.processFile = function (srcPath, file) {
        if (eslint === null) {
            eslint = require('eslint');
        }

        var options = {};

        var linter = new eslint.CLIEngine(options);
        // var report = linter.executeOnFiles(['./main.js']);

        return file;
    };
};

module.exports = lint;
