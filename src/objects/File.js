const pathinfo = require('../utils/pathinfo.js');

class File {
    constructor(path, lastModified) {
        this.path = path;
        this.lastModified = lastModified;
    }

    getExtension() {
        return pathinfo.extension(this.path);
    }

    checkExtensionMatching(extensions) {
        const currentExtension = this.getExtension();

        for (let extension of extensions) {
            if (extension === '*' || extension === currentExtension) {
                return true;
            }
        }

        return false;
    }

    setFilename(filename) {
        const dirname = pathinfo.dirname(this.path);

        this.path = `${dirname}/${filename}`;
    }

    setExtension(extension) {
        const dirname = pathinfo.dirname(this.path),
            basename = pathinfo.basename(this.path);

        this.path = `${dirname}/${basename}`;
        if (extension) {
            this.path += `.${extension}`;
        }
    }
}

module.exports = File;
