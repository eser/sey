var eolfix = function (context) {
    var self = this;

    self.processFile = function (filename, content) {
        return content.replace(/(?:\r\n|\r)/g, '\n');
    };
};

module.exports = eolfix;
