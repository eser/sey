'use strict';

const crc = require('crc'),
    fsManager = require('./utils/fsManager.js');

class runnerOpFile {
    constructor(file, content) {
        this.file = file;
        this.hash = crc.crc32(file.fullpath);
        this.cachedFilepath = null;
        this.cachedFileMod = -1;

        if (content !== undefined) {
            this.setContent(content);
        } else {
            this.content = null;
            this.modified = fsManager.getLastMod(this.file.fullpath);
        }
    }

    setContent(content) {
        this.content = content;
        this.modified = Date.now();
    }

    addHash(tag) {
        this.hash = crc.crc32(tag, this.hash);
        this.cachedFilepath = this.cacheFilename(this.hash, this.file.fullpath);
        this.cachedFileMod = fsManager.getLastMod(this.cachedFilepath);
    }

    isModified() {
        return (this.modified > this.cachedFileMod);
    }

    getHash() {
        return this.hash.toString(16);
    }

    write() {
    }

    static cacheFilename(hash, filepath) {
        return hash.toString(16) /* + '_' + filepath */;
    }
}

module.exports = runnerOpFile;
