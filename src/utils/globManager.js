'use strict';

const globAll = require('glob-all'),
    globParent = require('glob-parent');

class globManager {
    static _conversions(paths) {
        const pathArray = (paths.constructor === Array) ? paths : [paths],
            pathArrayLength = pathArray.length;
        let result = new Array(pathArrayLength);

        for (let i = 0; i < pathArrayLength; i++) {
            const pathstr = pathArray[i];
            if (pathstr.substring(0, 1) === '!') {
                continue;
            }

            result[i] = [
                pathstr,
                globParent(pathstr)
            ];
        }

        return result;
    }

    static _convert(conversions, pathstr) {
        for (let conversion of conversions) {
            if (conversion[1] === pathstr.substring(0, conversion[1].length)) {
                return pathstr.substring(conversion[1].length);
            }
        }

        return pathstr;
    }

    static glob(paths, noDirs) {
        const pathConversions = this._conversions(paths),
            files = globAll.sync(paths, { nosort: true, nonull: false, nodir: (noDirs === true) }),
            filesLength = files.length;

        let fileObjects = new Array(filesLength);
        for (let i = 0; i < filesLength; i++) {
            fileObjects[i] = {
                fullpath: files[i],
                path: this._convert(pathConversions, files[i])
            };
        }

        return fileObjects;
    }
}

module.exports = globManager;
