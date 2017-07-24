'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.GetTripQuery = exports.TripMutation = exports.TripType = undefined;

var _Trip = require('./types/Trip');

var _Trip2 = _interopRequireDefault(_Trip);

var _AddTrip = require('./mutations/AddTrip');

var _AddTrip2 = _interopRequireDefault(_AddTrip);

var _GetTrip = require('./queries/GetTrip');

var _GetTrip2 = _interopRequireDefault(_GetTrip);

var _UpdateStartDate = require('./mutations/UpdateStartDate');

var _UpdateStartDate2 = _interopRequireDefault(_UpdateStartDate);

var _UpdateTripPaxEdges = require('./mutations/UpdateTripPaxEdges');

var _UpdateTripPaxEdges2 = _interopRequireDefault(_UpdateTripPaxEdges);

var _DeleteTrip = require('./mutations/DeleteTrip');

var _DeleteTrip2 = _interopRequireDefault(_DeleteTrip);

var _CloneTrip = require('./mutations/CloneTrip');

var _CloneTrip2 = _interopRequireDefault(_CloneTrip);

var _AddTourplanTripBooking = require('./mutations/AddTourplanTripBooking');

var _AddTourplanTripBooking2 = _interopRequireDefault(_AddTourplanTripBooking);

var _CancelTourplanTripBooking = require('./mutations/CancelTourplanTripBooking');

var _CancelTourplanTripBooking2 = _interopRequireDefault(_CancelTourplanTripBooking);

var _UpdateTrip = require('./mutations/UpdateTrip');

var _UpdateTrip2 = _interopRequireDefault(_UpdateTrip);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var tripType = _Trip2.default;
var exportedTripMutation = {
  addTrip: _AddTrip2.default,
  UpdateStartDate: _UpdateStartDate2.default,
  UpdateTripPaxEdges: _UpdateTripPaxEdges2.default,
  deleteTrip: _DeleteTrip2.default,
  cloneTrip: _CloneTrip2.default,
  addTourplanTripBooking: _AddTourplanTripBooking2.default,
  cancelTourplanTripBooking: _CancelTourplanTripBooking2.default,
  updateTrip: _UpdateTrip2.default
};
var exportedGetTripQuery = _GetTrip2.default;

exports.TripType = tripType;
exports.TripMutation = exportedTripMutation;
exports.GetTripQuery = exportedGetTripQuery;