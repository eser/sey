'use strict';

const crc = require('crc'),
    fsManager = require('./utils/fsManager.js');

class runnerOpFile {
    constructor(file, content) {
        this.file = file;
        this.hash = crc.crc32(
            String(fsManager.getLastMod(file.fullpath)),
            crc.crc32(file.fullpath)
        );
        this._content = content;
    }

    cacheFilename() {
        return sey.workingPath + '/' + this.hash.toString(16) /* + '_' + this.file.path */;
    }

    addHash(tag) {
        this.hash = crc.crc32(tag, this.hash);
        this.hashFilePath = this.cacheFilename();

        return this.checkCacheValidity();
    }

    checkCacheValidity() {
        const fileModified = fsManager.getLastMod(this.hashFilePath);

        // if file does not exist
        if (fileModified === -1) {
            return false;
        }

        return true;
    }

    getHash() {
        return this.hash.toString(16);
    }

    getContent() {
        if (this._content === undefined) {
            this._content = ''; // TODO read cache or regular file
        }

        return this._content;
    }

    setContent(content) {
        this._content = content;

        // TODO write cache file
    }
}

module.exports = runnerOpFile;
