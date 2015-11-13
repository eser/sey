var eslint = require('eslint'),
    babel = require('babel-core');;

var rogue = function (config) {
    var self = this;

    if (rogue === self) {
        return;
    }

    self.config = config;

    self.lint = function () {
        var options = {};

        var linter = new eslint.CLIEngine(options);
        var report = linter.executeOnFiles(['./main.js']);

        console.log(report);
    };

    self.preprocess = function () {

    };

    self.transpile = function () {
        var code = '',
            options = {};

        var result = babel.transform(code, options);

        console.log(result);
    };
};

module.exports = rogue;
