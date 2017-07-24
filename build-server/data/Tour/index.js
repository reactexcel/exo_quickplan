'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TourMutation = exports.TourType = exports.AccessibleTourQuery = undefined;

var _Tour = require('./types/Tour');

var _Tour2 = _interopRequireDefault(_Tour);

var _AccessibleTours = require('./queries/AccessibleTours');

var _AccessibleTours2 = _interopRequireDefault(_AccessibleTours);

var _UpdateTourPaxs = require('./mutations/UpdateTourPaxs');

var _UpdateTourPaxs2 = _interopRequireDefault(_UpdateTourPaxs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var exportedAccessibleTourQuery = _AccessibleTours2.default;
var exportedTourType = _Tour2.default;

var exportedTourMutation = {
  updateTourPaxs: _UpdateTourPaxs2.default
};
exports.AccessibleTourQuery = exportedAccessibleTourQuery;
exports.TourType = exportedTourType;
exports.TourMutation = exportedTourMutation;