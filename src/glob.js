import globAll from 'glob-all';
import globParent from 'glob-parent';
import opfile from './opfile.js';

// private
let globConversions = function (paths) {
    let pathArray = (paths.constructor === Array) ? paths : [paths],
        result = [];

    for (let i = 0, length = pathArray.length; i < length; i++) {
        let path = pathArray[i];

        if (path.substring(0, 1) === '!') {
            continue;
        }

        result.push([
            path,
            globParent(path)
        ]);
    }

    return result;
};

let globConvert = function (conversions, path) {
    for (let i = 0, length = conversions.length; i < length; i++) {
        if (conversions[i][1] === path.substring(0, conversions[i][1].length)) {
            return path.substring(conversions[i][1].length);
        }
    }

    return path;
};

// public
let globFiles = function (paths, opTag) {
    let pathConversions = globConversions(paths),
        files = globAll.sync(paths, { nosort: true, nonull: false }),
        result = {};

    if (files !== null) {
        for (let i = 0, length = files.length; i < length; i++) {
            let file = files[i];

            result[file] = new opfile(file, globConvert(pathConversions, file), opTag, null);
        }
    }

    return result;
};

export default globFiles;
