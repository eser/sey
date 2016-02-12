'use strict';

const crc = require('crc'),
    fsManager = require('./utils/fsManager.js');

class runnerOpFile {
    constructor(filepath, content) {
        this.filepath = filepath;
        this.hash = crc.crc32(filepath);
        this.cachedFilepath = null;
        this.cachedFileMod = -1;

        if (content !== undefined) {
            this.setContent(content);
        } else {
            this.content = null;
            this.modified = fsManager.getLastMod(this.filepath);
        }
    }

    setContent(content) {
        this.content = content;
        this.modified = Date.now();
    }

    addHash(tag) {
        this.hash = crc.crc32(tag, this.hash);
        this.cachedFilepath = this.cacheFilename(this.hash, this.filepath);
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
