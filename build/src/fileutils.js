'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var fileutils = {
    writeFile: function writeFile(path, content) {
        var buffer = [[path, true, content]];

        while (buffer.length > 0) {
            var item = buffer[0];

            try {
                if (item[1]) {
                    _fs2.default.writeFileSync(item[0], item[2]);
                } else {
                    _fs2.default.mkdirSync(item[0]);
                }

                buffer.shift();
            } catch (ex) {
                if (ex.code === 'ENOENT') {
                    var newpath = item[0];
                    do {
                        newpath = _path2.default.dirname(newpath);
                    } while (_path2.default.basename(newpath) === '.');

                    buffer.unshift([newpath, false]);
                } else {
                    throw ex;
                }
            }
        }
    },

    getLastMod: function getLastMod(path) {
        try {
            return _fs2.default.statSync(path).mtime.getTime();
        } catch (ex) {
            if (ex.code !== 'ENOENT') {
                throw ex;
            }
        }

        return 0;
    },

    rmdir: function rmdir(path) {
        var list = _fs2.default.readdirSync(path);

        for (var i = 0, length = list.length; i < length; i++) {
            var filename = _path2.default.join(path, list[i]),
                stat = _fs2.default.statSync(filename);

            if (filename === '.' || filename === '..') {
                continue;
            }

            if (stat.isDirectory()) {
                fileutils.rmdir(filename);
                continue;
            }

            _fs2.default.unlinkSync(filename);
        }

        _fs2.default.rmdirSync(path);
    }
};

exports.default = fileutils;