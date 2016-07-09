/*global sey */
const pathinfo = require('../utils/pathinfo.js'),
    fsManager = require('../utils/fsManager.js');

class TargetFile {
    constructor(sourceFile, content) {
        this.sourceFiles = [ sourceFile ];
        this.file = sourceFile.path;
    }

    getExtension() {
        return pathinfo.extension(this.file);
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
        const dirname = pathinfo.dirname(this.file);

        this.file = `${dirname}/${filename}`;
    }

    setExtension(extension) {
        const dirname = pathinfo.dirname(this.file),
            basename = pathinfo.basename(this.file);

        this.file = `${dirname}/${basename}`;
        if (extension) {
            this.file += `.${extension}`;
        }
    }

    check(outputFolder) {
        const outputFile = `${outputFolder}/${this.file}`,
            outputFileLastMod = fsManager.getLastMod(outputFile);

        if (outputFileLastMod === -1) {
            return true;
        }

        for (let i = 0, length = this.sourceFiles.length; i < length; i++) {
            const sourceFile = this.sourceFiles[i];

            const sourceFileLastMod = fsManager.getLastMod(sourceFile.fullpath);

            if (outputFileLastMod < sourceFileLastMod) {
                return true;
            }
        }

        // TODO check if filelist changed (.sey/filelists.json)

        return false;
    }
}

module.exports = TargetFile;
