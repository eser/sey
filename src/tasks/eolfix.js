var eolfix = function (context) {
    var self = this;

    self.processFile = function (srcPath, file) {
        file.content = file.content.replace(/(?:\r\n|\r)/g, '\n');

        return file;
    };
};

module.exports = eolfix;
