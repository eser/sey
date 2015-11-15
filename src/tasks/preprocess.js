var preprocess = function (context) {
    var self = this;

    self.processFile = function (filename, content) {
        return content;
    };
};

module.exports = preprocess;
