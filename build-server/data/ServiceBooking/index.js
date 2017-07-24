'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CheckServicesAvailabilityQuery = exports.ServiceBooking = exports.ServiceBookingControllerQuery = exports.RemoveServiceBookingType = exports.TourplanBookingType = exports.ServiceBookingMutation = exports.ServiceBookingInputType = exports.ServiceBookingType = undefined;

var _ServiceBooking = require('./types/ServiceBooking');

var _ServiceBooking2 = _interopRequireDefault(_ServiceBooking);

var _ServiceBookingInput = require('./types/ServiceBookingInput');

var _ServiceBookingInput2 = _interopRequireDefault(_ServiceBookingInput);

var _TourplanBookingType = require('./types/TourplanBookingType');

var _TourplanBookingType2 = _interopRequireDefault(_TourplanBookingType);

var _AddTourplanBooking = require('./mutations/AddTourplanBooking');

var _AddTourplanBooking2 = _interopRequireDefault(_AddTourplanBooking);

var _AddTourplanBookings = require('./mutations/AddTourplanBookings');

var _AddTourplanBookings2 = _interopRequireDefault(_AddTourplanBookings);

var _CancelTourplanBooking = require('./mutations/CancelTourplanBooking');

var _CancelTourplanBooking2 = _interopRequireDefault(_CancelTourplanBooking);

var _CancelTourplanBookings = require('./mutations/CancelTourplanBookings');

var _CancelTourplanBookings2 = _interopRequireDefault(_CancelTourplanBookings);

var _ServiceBookingStatus = require('./types/ServiceBookingStatus');

var _ServiceBookingStatus2 = _interopRequireDefault(_ServiceBookingStatus);

var _RemoveServiceBooking = require('./mutations/RemoveServiceBooking');

var _RemoveServiceBooking2 = _interopRequireDefault(_RemoveServiceBooking);

var _UpdateServiceBooking = require('./mutations/UpdateServiceBooking');

var _UpdateServiceBooking2 = _interopRequireDefault(_UpdateServiceBooking);

var _UpdateServiceAvailability = require('./mutations/UpdateServiceAvailability');

var _UpdateServiceAvailability2 = _interopRequireDefault(_UpdateServiceAvailability);

var _UpdateServicesAvailability = require('./mutations/UpdateServicesAvailability');

var _UpdateServicesAvailability2 = _interopRequireDefault(_UpdateServicesAvailability);

var _ChangeServiceDaySlot = require('./mutations/ChangeServiceDaySlot');

var _ChangeServiceDaySlot2 = _interopRequireDefault(_ChangeServiceDaySlot);

var _CheckServiceBookingPaxStatus = require('./queries/CheckServiceBookingPaxStatus');

var _CheckServiceBookingPaxStatus2 = _interopRequireDefault(_CheckServiceBookingPaxStatus);

var _ServiceBooking3 = require('./queries/ServiceBooking');

var _ServiceBooking4 = _interopRequireDefault(_ServiceBooking3);

var _CheckServicesAvailability = require('./queries/CheckServicesAvailability');

var _CheckServicesAvailability2 = _interopRequireDefault(_CheckServicesAvailability);

var _ConfirmServiceAvailability = require('./mutations/ConfirmServiceAvailability');

var _ConfirmServiceAvailability2 = _interopRequireDefault(_ConfirmServiceAvailability);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var serviceBookingType = _ServiceBooking2.default;
// import ServiceBookingMutation from './mutations/ServiceBooking';

var serviceBookingInputType = _ServiceBookingInput2.default;
var tourplanBookingType = _TourplanBookingType2.default;
var removeServiceBookingType = _ServiceBookingStatus2.default;
var exportedServiceBookingMutation = {
  addTourplanBooking: _AddTourplanBooking2.default, // TODO: Remove and use batch version instead
  cancelTourplanBooking: _CancelTourplanBooking2.default, // TODO: Remove and use batch version instead
  addTourplanBookings: _AddTourplanBookings2.default,
  cancelTourplanBookings: _CancelTourplanBookings2.default,
  removeServiceBooking: _RemoveServiceBooking2.default,
  updateServiceBooking: _UpdateServiceBooking2.default,
  updateServiceAvailability: _UpdateServiceAvailability2.default,
  updateServicesAvailability: _UpdateServicesAvailability2.default,
  changeServiceDaySlot: _ChangeServiceDaySlot2.default,
  confirmServiceAvailability: _ConfirmServiceAvailability2.default
};
var exportedCheckServicesAvailabilityQuery = _CheckServicesAvailability2.default;

exports.ServiceBookingType = serviceBookingType;
exports.ServiceBookingInputType = serviceBookingInputType;
exports.ServiceBookingMutation = exportedServiceBookingMutation;
exports.TourplanBookingType = tourplanBookingType;
exports.RemoveServiceBookingType = removeServiceBookingType;
exports.ServiceBookingControllerQuery = _CheckServiceBookingPaxStatus2.default;
exports.ServiceBooking = _ServiceBooking4.default;
exports.CheckServicesAvailabilityQuery = exportedCheckServicesAvailabilityQuery;