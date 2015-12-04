import fs from 'fs';
import fileutils from './fileutils.js';

let opfile = function (path, relativeFile, opTag, content) {
    let self = this;

    self.relativeFile = relativeFile.replace(/^\/+/, '');

    self.history = [
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

    self.getRecent = function () {
        return self.history[self.history.length - 1];
    };

    self.getContent = function () {
        return self.getRecent().content;
    };

    self.addTask = function (task, cacheable) {
        let previousItem = self.getRecent(),
            item = {
                task: task,
                tags: previousItem.tags.concat([task]),
                path: null,
                lastmod: 0,
                cached: false,
                cache: false,
                content: null
            };

        if (self.opTag !== null && cacheable !== false && (previousItem.task === null || previousItem.path !== null)) {
            item.path = './.sey/cache/' + opTag + '/' + item.tags.join('_') + '/' + self.relativeFile;
            item.cache = true;

            if (previousItem.cached !== false) {
                item.lastmod = fileutils.getLastMod(item.path);
                if (previousItem.lastmod <= item.lastmod) {
                    item.cached = true;
                    item.cache = false;
                }
            }
        }

        self.history.push(item);
        return item;
    };

    self.updateContent = function (content) {
        let currentItem = self.getRecent();

        currentItem.content = content;
        currentItem.lastmod = Date.now();
        if (currentItem.cache) {
            fileutils.writeFile(currentItem.path, currentItem.content);
            currentItem.cached = true;
        }
    };

    self.getPreviousContent = function () {
        let i = self.history.length - 2;

        if (i >= 0) {
            let item = self.history[i];

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

export default opfile;
