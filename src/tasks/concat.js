var opfile = require('../opfile.js');

var concat = function () {
    var self = this;

    self.processBundle = function (bundle, files) {
        var content = '';

        for (var fileKey in files) {
            var file = files[fileKey],
                token = file.addTask('concat');

            content += file.getPreviousContent();
        }

        return [
            new opfile('concat', 'concat', null, content)
        ];
    };
};

module.exports = concat;
