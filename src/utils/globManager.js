'use strict';

const globAll = require('glob-all'),
    globParent = require('glob-parent');

class globManager {
    static _conversions(paths) {
        const pathArray = (paths.constructor === Array) ? paths : [paths];
        let result = [];

        for (let pathstr of pathArray) {
            if (pathstr.substring(0, 1) === '!') {
                continue;
            }

            result.push([
                pathstr,
                globParent(pathstr)
            ]);
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

    static *glob(paths) {
        const pathConversions = this._conversions(paths),
            files = globAll.sync(paths, { nosort: true, nonull: false });

        if (files !== null) {
            for (let file of files) {
                yield {
                    fullpath: file,
                    path: this._convert(pathConversions, file)
                };
            }
        }
    }
}

module.exports = globManager;
