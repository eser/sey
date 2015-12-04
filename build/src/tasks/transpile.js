'use strict';

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { var callNext = step.bind(null, "next"); var callThrow = step.bind(null, "throw"); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(callNext, callThrow); } } callNext(); }); }; }

var deepmerge = require('deepmerge');

var transpile = function transpile() {
    var self = this,
        babel = null;

    self.processBundle = (function () {
        var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(bundle, files) {
            var options, fileKey, file, token, content, result;
            return regeneratorRuntime.wrap(function _callee$(_context) {
                while (1) {
                    switch (_context.prev = _context.next) {
                        case 0:
                            options = {
                                ast: false,
                                presets: ['es2015'],

                                ignore: /(bower_components)|(node_modules)/,
                                only: null
                            };

                            if (bundle.config.babelConfig !== undefined && bundle.config.babelConfig !== null) {
                                options = deepmerge(bundle.config.babelConfig, options);
                            }

                            _context.t0 = regeneratorRuntime.keys(files);

                        case 3:
                            if ((_context.t1 = _context.t0()).done) {
                                _context.next = 14;
                                break;
                            }

                            fileKey = _context.t1.value;
                            file = files[fileKey], token = file.addTask('preprocess');

                            if (!token.cached) {
                                _context.next = 8;
                                break;
                            }

                            return _context.abrupt('continue', 3);

                        case 8:

                            // load on demand
                            if (babel === null) {
                                babel = require('babel-core');
                            }

                            options.filename = file.relativeFile;

                            content = file.getPreviousContent(), result = babel.transform(content, options);

                            file.updateContent(result.code);
                            _context.next = 3;
                            break;

                        case 14:
                            return _context.abrupt('return', files);

                        case 15:
                        case 'end':
                            return _context.stop();
                    }
                }
            }, _callee, this);
        }));

        return function (_x, _x2) {
            return ref.apply(this, arguments);
        };
    })();
};

module.exports = transpile;