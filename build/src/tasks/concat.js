'use strict';

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { var callNext = step.bind(null, "next"); var callThrow = step.bind(null, "throw"); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(callNext, callThrow); } } callNext(); }); }; }

var opfile = require('../opfile.js');

var concat = function concat() {
    var self = this;

    self.processBundle = (function () {
        var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(bundle, files) {
            var content, fileKey, file, token;
            return regeneratorRuntime.wrap(function _callee$(_context) {
                while (1) {
                    switch (_context.prev = _context.next) {
                        case 0:
                            content = '';

                            for (fileKey in files) {
                                file = files[fileKey], token = file.addTask('concat');

                                content += file.getPreviousContent();
                            }

                            return _context.abrupt('return', [new opfile('concat', 'concat', null, content)]);

                        case 3:
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

module.exports = concat;