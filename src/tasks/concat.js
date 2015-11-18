var opfile = require('../opfile.js');

var concat = function (context) {
    var self = this;

    self.processBundle = function (files) {
        var content = '';

        for (var file in files) {
            content += files[file].read();
        }

        return [
            new opfile('concat', 'concat', null, content)
        ];
    };
};

module.exports = concat;
