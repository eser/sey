'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _fileutils = require('./fileutils.js');

var _fileutils2 = _interopRequireDefault(_fileutils);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var opfile = function opfile(path, relativeFile, opTag, content) {
    var self = this;

    self.relativeFile = relativeFile.replace(/^\/+/, '');

    self.history = [{
        task: null,
        tags: [],
        path: path,
        lastmod: _fileutils2.default.getLastMod(path),
        cached: true,
        cache: false,
        content: content // || null
    }];

    self.getRecent = function () {
        return self.history[self.history.length - 1];
    };

    self.getContent = function () {
        return self.getRecent().content;
    };

    self.addTask = function (task, cacheable) {
        var previousItem = self.getRecent(),
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
                item.lastmod = _fileutils2.default.getLastMod(item.path);
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
        var currentItem = self.getRecent();

        currentItem.content = content;
        currentItem.lastmod = Date.now();
        if (currentItem.cache) {
            _fileutils2.default.writeFile(currentItem.path, currentItem.content);
            currentItem.cached = true;
        }
    };

    self.getPreviousContent = function () {
        var i = self.history.length - 2;

        if (i >= 0) {
            var item = self.history[i];

            if (item.content !== null) {
                return item.content;
            }

            if (item.cached !== false) {
                item.content = _fs2.default.readFileSync(item.path, 'utf8');
                return item.content;
            }
        }

        return null;
    };
};

exports.default = opfile;