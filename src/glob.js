var globAll = require('glob-all'),
    globParent = require('glob-parent'),
    opfile = require('./opfile.js');

// private
var globConversions = function (paths) {
    var pathArray = (paths.constructor === Array) ? paths : [paths],
        result = [];

    for (var i = 0, length = pathArray.length; i < length; i++) {
        var path = pathArray[i];

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

var globConvert = function (conversions, path) {
    for (var i = 0, length = conversions.length; i < length; i++) {
        if (conversions[i][1] === path.substring(0, conversions[i][1].length)) {
            return path.substring(conversions[i][1].length);
        }
    }

    return path;
};

// public
var globFiles = function (paths, opTag) {
    var pathConversions = globConversions(paths),
        files = globAll.sync(paths, { nosort: true, nonull: false }),
        result = {};

    if (files !== null) {
        for (var i = 0, length = files.length; i < length; i++) {
            var file = files[i];

            result[file] = new opfile(file, globConvert(pathConversions, file), opTag, null);
        }
    }

    return result;
};

module.exports = globFiles;
