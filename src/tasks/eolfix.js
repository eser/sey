var eolfix = function (context) {
    var self = this;

    self.processBundle = function (files) {
        for (var file in files) {
            files[file].content = files[file].content.replace(/(?:\r\n|\r)/g, '\n');
        }

        return files;
    };
};

module.exports = eolfix;
