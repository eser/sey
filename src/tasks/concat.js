var concat = function (context) {
    var self = this;

    self.processBundle = function (files) {
        var content = '';

        for (var file in files) {
            content += files[file].content;
        }

        return [
            { file: 'concat', content: content }
        ];
    };
};

module.exports = concat;
