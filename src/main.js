var CLIEngine = require('eslint').CLIEngine;

var rogue = function (config) {
    var self = this;

    if (rogue === self) {
        return;
    }

    self.config = config;

    self.lint = function () {
    	var options = {};
    	var linter = new CLIEngine(options);
    	var report = linter.executeOnFiles(['./main.js']);

    	console.log(report);
    };

    self.preprocess = function () {

    };
};

module.exports = rogue;
