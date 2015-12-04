let eolfix = function () {
    let self = this;

    self.processBundle = async function (bundle, files) {
        for (let fileKey in files) {
            let file = files[fileKey],
                token = file.addTask('eolfix');

            if (token.cached) {
                continue;
            }

            let content = file.getPreviousContent();
            file.updateContent(content.replace(/(?:\r\n|\r)/g, '\n'));
        }

        return files;
    };
};

export default eolfix;
