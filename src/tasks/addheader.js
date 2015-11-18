var addheader = function (context) {
    var self = this;

    self.processBundle = function (files) {
        if (context.bundleConfig.banner === undefined || context.bundleConfig.banner === null) {
            return files;
        }

        for (var file in files) {
            files[file].content = context.bundleConfig.banner + files[file].read();
        }

        return files;
    };
};

module.exports = addheader;
