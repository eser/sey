'use strict';

const os = require('os'),
      fs = require('fs'),
      path = require('path'),
      globAll = require('glob-all'),
      isbinaryfile = require('isbinaryfile');

class fsManager {
    static getStat(pathstr) {
        try {
            return fs.statSync(pathstr);
        } catch (ex) {
            if (ex.code !== 'ENOENT') {
                throw ex;
            }
        }

        return null;
    }

    static getLastMod(pathstr) {
        const stat = this.getStat(pathstr);

        if (stat !== null) {
            return stat.mtime.getTime();
        }

        return -1;
    }

    static exists(pathstr) {
        const stat = this.getStat(pathstr);

        if (stat === null) {
            return false;
        }

        return true;
    }

    static existsAndNotModified(pathstr, time) {
        const lastMod = this.getLastMod(pathstr);

        if (lastMod <= time) {
            return false;
        }

        return true;
    }

    static rm(str) {
        const files = globAll.sync(str, { nosort: true, nonull: false });

        for (let file of files) {
            const stat = fs.statSync(file);

            if (file === '.' || file === '..') {
                continue;
            }

            if (stat.isDirectory()) {
                this.rmdir(file);
                continue;
            }

            fs.unlinkSync(file);
        }
    }

    static rmdir(pathstr) {
        let list;

        try {
            list = fs.readdirSync(pathstr);
        } catch (ex) {
            if (ex.code === 'ENOENT') {
                return;
            }

            throw ex;
        }

        for (let item of list) {
            const filename = path.join(pathstr, item),
                  stat = fs.statSync(filename);

            if (filename === '.' || filename === '..') {
                continue;
            }

            if (stat.isDirectory()) {
                this.rmdir(filename);
                continue;
            }

            fs.unlinkSync(filename);
        }

        fs.rmdirSync(pathstr);
    }

    static readFile(pathstr) {
        if (isbinaryfile.sync(pathstr)) {
            return fs.readFileSync(pathstr);
        }

        return fs.readFileSync(pathstr, 'utf8');
    }

    static writeFile(pathstr, content) {
        let buffer = [[pathstr, true, content]];

        while (buffer.length > 0) {
            let item = buffer[0];

            try {
                if (item[1]) {
                    if (item[2].constructor === Buffer) {
                        fs.writeFileSync(item[0], item[2], 0, item[2].length);
                    } else {
                        fs.writeFileSync(item[0], item[2]);
                    }
                } else {
                    fs.mkdirSync(item[0]);
                }

                buffer.shift();
            } catch (ex) {
                if (ex.code === 'ENOENT') {
                    let newpath = item[0];
                    do {
                        newpath = path.dirname(newpath);
                    } while (path.basename(newpath) === '.');

                    buffer.unshift([newpath, false]);
                } else {
                    throw ex;
                }
            }
        }
    }
}

module.exports = fsManager;