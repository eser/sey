const fs = require('fs'),
    fileutils = require('./fileutils.js');

let opfile = function (path, relativeFile, opTag, content) {
    this.relativeFile = relativeFile.replace(/^\/+/, '');

    this.history = [
        {
            task: null,
            tags: [],
            path: path,
            lastmod: fileutils.getLastMod(path),
            cached: true,
            cache: false,
            content: content // || null
        }
    ];

    this.getRecent = () => {
        return this.history[this.history.length - 1];
    };

    this.getContent = () => {
        return this.getRecent().content;
    };

    this.addTask = (task, cacheable) => {
        let previousItem = this.getRecent(),
            item = {
                task: task,
                tags: previousItem.tags.concat([task]),
                path: null,
                lastmod: 0,
                cached: false,
                cache: false,
                content: null
            };

        if (this.opTag !== null && cacheable !== false && (previousItem.task === null || previousItem.path !== null)) {
            item.path = './.sey/cache/' + opTag + '/' + item.tags.join('_') + '/' + this.relativeFile;
            item.cache = true;

            if (previousItem.cached !== false) {
                item.lastmod = fileutils.getLastMod(item.path);
                if (previousItem.lastmod <= item.lastmod) {
                    item.cached = true;
                    item.cache = false;
                }
            }
        }

        this.history.push(item);
        return item;
    };

    this.updateContent = (content) => {
        let currentItem = this.getRecent();

        currentItem.content = content;
        currentItem.lastmod = Date.now();
        if (currentItem.cache) {
            fileutils.writeFile(currentItem.path, currentItem.content);
            currentItem.cached = true;
        }
    };

    this.getPreviousContent = () => {
        let i = this.history.length - 2;

        if (i >= 0) {
            let item = this.history[i];

            if (item.content !== null) {
                return item.content;
            }

            if (item.cached !== false) {
                item.content = fs.readFileSync(item.path, 'utf8');
                return item.content;
            }
        }

        return null;
    };
};

module.exports = opfile;
