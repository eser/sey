'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { var callNext = step.bind(null, "next"); var callThrow = step.bind(null, "throw"); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(callNext, callThrow); } } callNext(); }); }; }

var addheader = function addheader() {
    var self = this;

    self.processBundle = (function () {
        var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(bundle, files) {
            var fileKey, file, token, content;
            return regeneratorRuntime.wrap(function _callee$(_context) {
                while (1) {
                    switch (_context.prev = _context.next) {
                        case 0:
                            if (!(bundle.config.banner === undefined || bundle.config.banner === null)) {
                                _context.next = 2;
                                break;
                            }

                            return _context.abrupt('return', files);

                        case 2:
                            _context.t0 = regeneratorRuntime.keys(files);

                        case 3:
                            if ((_context.t1 = _context.t0()).done) {
                                _context.next = 12;
                                break;
                            }

                            fileKey = _context.t1.value;
                            file = files[fileKey], token = file.addTask('addheader');

                            if (!token.cached) {
                                _context.next = 8;
                                break;
                            }

                            return _context.abrupt('continue', 3);

                        case 8:
                            content = file.getPreviousContent();

                            file.updateContent(bundle.config.banner + content);
                            _context.next = 3;
                            break;

                        case 12:
                            return _context.abrupt('return', files);

                        case 13:
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

exports.default = addheader;