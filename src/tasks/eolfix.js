var eolfix = function () {
    var self = this;

    self.processBundle = function (bundle, files) {
        for (var fileKey in files) {
            var file = files[fileKey],
                token = file.addTask('eolfix');

            if (token.cached) {
                continue;
            }

            var content = file.getPreviousContent();
            file.updateContent(content.replace(/(?:\r\n|\r)/g, '\n'));
        }

        return files;
    };
};

module.exports = eolfix;
