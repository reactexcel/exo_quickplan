'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.LocationQuery = exports.LocationType = undefined;

var _Location = require('./types/Location');

var _Location2 = _interopRequireDefault(_Location);

var _Location3 = require('./queries/Location');

var _Location4 = _interopRequireDefault(_Location3);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var locationType = _Location2.default;
var exportedLocationQuery = _Location4.default;

exports.LocationType = locationType;
exports.LocationQuery = exportedLocationQuery;