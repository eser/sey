var fs = require('fs');

var opfile = function (path, relativeFile, opTag, content) {
    var self = this;

    self.file = relativeFile;
    self.stat = fs.statSync(path);

    self.opTag = (opTag !== undefined) ? opTag : null;
    self.cacheTags = [];
    self.content = (content !== undefined) ? content : null;

    self.addCacheTag = function (tag) {
        // if (self.opTag === null) {
        //     return;
        // }

        self.cacheTags.push(tag);
    };

    self.getFromCache = function () {
        if (self.opTag === null || self.cacheTags.length === 0) {
            return false;
        }

        var cachefile = './.sey/cache/' + self.opTag + '/' + self.cacheTags.join('_') + '/' + relativeFile;

        try {
            var cachestat = fs.statSync(cachefile);
            if (self.stat.getTime() > cachestat.getTime()) {
                return false;
            }

        } catch (ex) {
            if (ex.code === 'ENOENT') {
                return false;
            } else {
                throw ex;
            }
        }

        self.content = fs.readFileSync(cachefile, 'utf8');
        return true;
    };

    self.read = function () {
        if (self.content === null) {
            self.content = fs.readFileSync(path, 'utf8');
        }

        return self.content;
    };
};

module.exports = opfile;
