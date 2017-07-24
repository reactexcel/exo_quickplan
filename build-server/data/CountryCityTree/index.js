'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CountryCityTreeMutation = exports.CountryCityTreeQuery = undefined;

var _CountryCityTree = require('./queries/CountryCityTree');

var _CountryCityTree2 = _interopRequireDefault(_CountryCityTree);

var _CountryCityTree3 = require('./mutations/CountryCityTree');

var _CountryCityTree4 = _interopRequireDefault(_CountryCityTree3);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var exportedTreeQuery = _CountryCityTree2.default;
var exportedTreeMutation = {
  countryCityTreeMutation: _CountryCityTree4.default
};
exports.CountryCityTreeQuery = exportedTreeQuery;
exports.CountryCityTreeMutation = exportedTreeMutation;