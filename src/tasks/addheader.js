var addheader = function (context) {
    var self = this;

    self.bundleStart = function (bundle) {
    };

    self.processFile = function (srcPath, file) {
        return file;
    };

    self.processBundle = function (files) {
        return files;
    };

    self.bundleEnd = function (bundle) {
    };
};

module.exports = addheader;
