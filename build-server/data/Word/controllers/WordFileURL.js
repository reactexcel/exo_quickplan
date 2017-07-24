'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getWordURL = undefined;

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var getWordURL = function () {
  var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(args) {
    var tripKey, showDayNotes, showImages, showDescriptions, showCategoryAmounts, showLineAmounts, base64, convertFile;
    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            tripKey = args.tripKey, showDayNotes = args.showDayNotes, showImages = args.showImages, showDescriptions = args.showDescriptions, showCategoryAmounts = args.showCategoryAmounts, showLineAmounts = args.showLineAmounts;
            _context.next = 3;
            return (0, _request2.default)('http://localhost:8529/_db/exo-dev/bbt/convert/getBase64', _request.POST, { tripKey: tripKey, showDayNotes: showDayNotes, showImages: showImages, showDescriptions: showDescriptions, showCategoryAmounts: showCategoryAmounts, showLineAmounts: showLineAmounts });

          case 3:
            base64 = _context.sent;
            _context.next = 6;
            return new _promise2.default(function (resolve, reject) {
              cloudconvert.convert({
                inputformat: 'html',
                outputformat: 'docx',
                input: 'base64',
                wait: true,
                download: false,
                file: base64.fileBase64,
                converteroptions: {
                  embed_images: true
                },
                filename: tripKey + '.html'
              }).pipe(_write2.default.stream('../../docs/' + tripKey + '.doc').on('finish', function () {
                resolve({ url: '/assets/docs/' + tripKey + '.doc' });
              }).on('error', function () {
                reject('you error param');
              }));
            });

          case 6:
            convertFile = _context.sent;
            return _context.abrupt('return', convertFile);

          case 8:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this);
  }));

  return function getWordURL(_x) {
    return _ref.apply(this, arguments);
  };
}();

var _write = require('write');

var _write2 = _interopRequireDefault(_write);

var _request = require('../../../utils/request');

var _request2 = _interopRequireDefault(_request);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var cloudconvert = new (require('cloudconvert'))('u1FZiHJGOlz8u67WOUcAP_e3fkyA81nJ11kqkhUTSP4mxpEXJb8e0DJMSiwgagFoUnIKdD4Oec1aFb8xkjJbPw');

exports.getWordURL = getWordURL;