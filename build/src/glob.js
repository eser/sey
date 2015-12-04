'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _globAll = require('glob-all');

var _globAll2 = _interopRequireDefault(_globAll);

var _globParent = require('glob-parent');

var _globParent2 = _interopRequireDefault(_globParent);

var _opfile = require('./opfile.js');

var _opfile2 = _interopRequireDefault(_opfile);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// private
var globConversions = function globConversions(paths) {
    var pathArray = paths.constructor === Array ? paths : [paths],
        result = [];

    for (var i = 0, length = pathArray.length; i < length; i++) {
        var path = pathArray[i];

        if (path.substring(0, 1) === '!') {
            continue;
        }

        result.push([path, (0, _globParent2.default)(path)]);
    }

    return result;
};

var globConvert = function globConvert(conversions, path) {
    for (var i = 0, length = conversions.length; i < length; i++) {
        if (conversions[i][1] === path.substring(0, conversions[i][1].length)) {
            return path.substring(conversions[i][1].length);
        }
    }

    return path;
};

// public
var globFiles = function globFiles(paths, opTag) {
    var pathConversions = globConversions(paths),
        files = _globAll2.default.sync(paths, { nosort: true, nonull: false }),
        result = {};

    if (files !== null) {
        for (var i = 0, length = files.length; i < length; i++) {
            var file = files[i];

            result[file] = new _opfile2.default(file, globConvert(pathConversions, file), opTag, null);
        }
    }

    return result;
};

exports.default = globFiles;