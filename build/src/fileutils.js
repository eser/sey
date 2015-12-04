'use strict';

var fs = require('fs'),
    pathlib = require('path');

var fileutils = {
    writeFile: function writeFile(path, content) {
        var buffer = [[path, true, content]];

        while (buffer.length > 0) {
            var item = buffer[0];

            try {
                if (item[1]) {
                    fs.writeFileSync(item[0], item[2]);
                } else {
                    fs.mkdirSync(item[0]);
                }

                buffer.shift();
            } catch (ex) {
                if (ex.code === 'ENOENT') {
                    var newpath = item[0];
                    do {
                        newpath = pathlib.dirname(newpath);
                    } while (pathlib.basename(newpath) === '.');

                    buffer.unshift([newpath, false]);
                } else {
                    throw ex;
                }
            }
        }
    },

    getLastMod: function getLastMod(path) {
        try {
            return fs.statSync(path).mtime.getTime();
        } catch (ex) {
            if (ex.code !== 'ENOENT') {
                throw ex;
            }
        }

        return 0;
    },

    rmdir: function rmdir(path) {
        var list = fs.readdirSync(path);

        for (var i = 0, length = list.length; i < length; i++) {
            var filename = pathlib.join(path, list[i]),
                stat = fs.statSync(filename);

            if (filename === '.' || filename === '..') {
                continue;
            }

            if (stat.isDirectory()) {
                fileutils.rmdir(filename);
                continue;
            }

            fs.unlinkSync(filename);
        }

        fs.rmdirSync(path);
    }
};

module.exports = fileutils;