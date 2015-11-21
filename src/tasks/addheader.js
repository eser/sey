var addheader = function () {
    var self = this;

    self.processBundle = function (bundle, files) {
        if (bundle.config.banner === undefined || bundle.config.banner === null) {
            return files;
        }

        for (var fileKey in files) {
            var file = files[fileKey],
                token = file.addTask('addheader');

            if (token.cached) {
                continue;
            }

            var content = file.getPreviousContent();
            file.updateContent(bundle.config.banner + content);
        }

        return files;
    };
};

module.exports = addheader;
