let addheader = function () {
    let self = this;

    self.processBundle = async function (bundle, files) {
        if (bundle.config.banner === undefined || bundle.config.banner === null) {
            return files;
        }

        for (let fileKey in files) {
            let file = files[fileKey],
                token = file.addTask('addheader');

            if (token.cached) {
                continue;
            }

            let content = file.getPreviousContent();
            file.updateContent(bundle.config.banner + content);
        }
    
        return files;
    };
};

export default addheader;
