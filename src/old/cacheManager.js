const path = require('path'),
    fsManager = require('./fsManager.js');

class cacheManager {
    constructor() {
        this.basePath = './';
    }

    getCachedFilePath(filepath) {
        const absolutePath = path.join(this.basePath, filepath);

        return absolutePath;
    }

    checkCachedFileValid(filepath, lastMod) {
        const cacheFilepath = this.getCachedFilePath(filepath);

        return fsManager.existsAndNotModified(cacheFilepath, lastMod);
    }
}

module.exports = new cacheManager();
