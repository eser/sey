/*global sey */
'use strict';

const crc = require('crc'),
    fsManager = require('./utils/fsManager.js');

class runnerOpFile {
    constructor(file, hash, content) {
        this.file = file;

        if (hash === undefined) {
            this.hash = crc.crc32(
                String(fsManager.getLastMod(file.fullpath)),
                crc.crc32(file.fullpath)
            );
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
        return sey.workingPath + '/' + this.hash.toString(16) /* + '_' + this.file.path */;
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

    setContent(content) {
        this.content = content;

        fsManager.writeFile(this.hashFile, this.content);
    }
}

module.exports = runnerOpFile;
