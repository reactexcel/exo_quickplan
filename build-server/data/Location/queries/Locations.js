'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _graphql = require('graphql');

var _Location = require('../types/Location');

var _Location2 = _interopRequireDefault(_Location);

var _Location3 = require('../controllers/Location');

var locationCtrl = _interopRequireWildcard(_Location3);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  type: new _graphql.GraphQLList(_Location2.default),
  resolve: function () {
    var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee() {
      var locations;
      return _regenerator2.default.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.next = 2;
              return locationCtrl.getAllLocations();

            case 2:
              _context.t0 = _context.sent;

              if (_context.t0) {
                _context.next = 5;
                break;
              }

              _context.t0 = [];

            case 5:
              locations = _context.t0;
              return _context.abrupt('return', locations.map(function (location) {
                var combinedLocation = location[0];
                combinedLocation.name = location.map(function (l) {
                  return l.name;
                }).join(', ');
                return combinedLocation;
              }));

            case 7:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee, undefined);
    }));

    return function resolve() {
      return _ref.apply(this, arguments);
    };
  }()
};