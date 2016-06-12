'use strict';

/*global sey */
const crc = require('crc'),
      pathinfo = require('../utils/pathinfo.js'),
      fsManager = require('../utils/fsManager.js');

class SourceFile {
    constructor(file, hash, content) {
        this.file = file;

        if (hash === undefined) {
            this.hash = crc.crc32(String(fsManager.getLastMod(file.fullpath)), crc.crc32(file.fullpath));
        } else {
            this.hash = hash;
        }

        if (content === undefined) {
            this.contentFile = this.file.fullpath;
            this.cached = true;
        } else {
            this.content = content;
            this.cached = false;
        }
    }

    cacheFilename() {
        return `${ sey.workingPath }/${ this.hash.toString(16) }`; // + `_${this.file.path}`
    }

    addHash(tag) {
        this.hash = crc.crc32(tag, this.hash);
        this.hashFile = this.cacheFilename();

        if (this.cached) {
            const fileModified = fsManager.getLastMod(this.hashFile);

            // if file does not exist
            if (fileModified === -1) {
                this.cached = false;

                return;
            }

            this.content = undefined;
            this.contentFile = this.hashFile;
        }
    }

    getHash() {
        return this.hash.toString(16);
    }

    getContent() {
        if (this.content === undefined) {
            this.content = fsManager.readFile(this.contentFile);
        }

        return this.content;
    }

    setFilename(filename) {
        const dirname = pathinfo.dirname(this.file.path);

        this.file.path = `${ dirname }/${ filename }`;
    }

    getExtension() {
        return pathinfo.extension(this.file.path);
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

    setExtension(extension) {
        const dirname = pathinfo.dirname(this.file.path),
              basename = pathinfo.basename(this.file.path);

        this.file.path = `${ dirname }/${ basename }`;
        if (extension) {
            this.file.path += `.${ extension }`;
        }
    }

    setContent(content) {
        this.content = content;

        fsManager.writeFile(this.hashFile, this.content);
    }
}

module.exports = SourceFile;