'use strict';

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { var callNext = step.bind(null, "next"); var callThrow = step.bind(null, "throw"); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(callNext, callThrow); } } callNext(); }); }; }

var lint = function lint() {
    var self = this,
        linter = null;

    self.processBundle = (function () {
        var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(bundle, files) {
            var config, fileKey, file, token, eslint, content, report, i, length, result;
            return regeneratorRuntime.wrap(function _callee$(_context) {
                while (1) {
                    switch (_context.prev = _context.next) {
                        case 0:

                            if (bundle.config.eslintConfig !== undefined && bundle.config.eslintConfig !== null) {
                                config = bundle.config.eslintConfig;
                            } else {
                                config = {};
                            }

                            _context.t0 = regeneratorRuntime.keys(files);

                        case 2:
                            if ((_context.t1 = _context.t0()).done) {
                                _context.next = 22;
                                break;
                            }

                            fileKey = _context.t1.value;
                            file = files[fileKey], token = file.addTask('lint');

                            if (!token.cached) {
                                _context.next = 7;
                                break;
                            }

                            return _context.abrupt('continue', 2);

                        case 7:

                            // load on demand
                            if (linter === null) {
                                eslint = require('eslint');

                                linter = new eslint.CLIEngine(config);
                            }

                            content = file.getPreviousContent(), report = linter.executeOnText(content, file.relativeFile);
                            i = 0, length = report.results.length;

                        case 10:
                            if (!(i < length)) {
                                _context.next = 19;
                                break;
                            }

                            result = report.results[i];

                            if (!(result.errorCount === 0 && result.warningCount === 0)) {
                                _context.next = 14;
                                break;
                            }

                            return _context.abrupt('continue', 16);

                        case 14:

                            reject(result);
                            // console.log(result);
                            // process.exit(0);
                            return _context.abrupt('return');

                        case 16:
                            i++;
                            _context.next = 10;
                            break;

                        case 19:

                            file.updateContent(content);
                            _context.next = 2;
                            break;

                        case 22:
                            return _context.abrupt('return', files);

                        case 23:
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

module.exports = lint;