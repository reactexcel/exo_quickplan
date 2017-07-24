'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CityBookingQuery = exports.CityBookingMutation = exports.CityBookingType = undefined;

var _CityBooking = require('./types/CityBooking');

var _CityBooking2 = _interopRequireDefault(_CityBooking);

var _CityBooking3 = require('./mutations/CityBooking');

var _CityBooking4 = _interopRequireDefault(_CityBooking3);

var _UpdateServiceBookingsByCityKey = require('./mutations/UpdateServiceBookingsByCityKey');

var _UpdateServiceBookingsByCityKey2 = _interopRequireDefault(_UpdateServiceBookingsByCityKey);

var _AddCityDay = require('./mutations/AddCityDay');

var _AddCityDay2 = _interopRequireDefault(_AddCityDay);

var _RemoveCityDay = require('./mutations/RemoveCityDay');

var _RemoveCityDay2 = _interopRequireDefault(_RemoveCityDay);

var _CityBooking5 = require('./queries/CityBooking');

var _CityBooking6 = _interopRequireDefault(_CityBooking5);

var _AddTourplanCityBooking = require('./mutations/AddTourplanCityBooking');

var _AddTourplanCityBooking2 = _interopRequireDefault(_AddTourplanCityBooking);

var _CancelTourplanCityBooking = require('./mutations/CancelTourplanCityBooking');

var _CancelTourplanCityBooking2 = _interopRequireDefault(_CancelTourplanCityBooking);

var _UpdateCityServicesAvailability = require('./mutations/UpdateCityServicesAvailability');

var _UpdateCityServicesAvailability2 = _interopRequireDefault(_UpdateCityServicesAvailability);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var cityBookingType = _CityBooking2.default;
var exportedCityBookingMutation = {
  addCityBooking: _CityBooking4.default,
  updateServiceBookings: _UpdateServiceBookingsByCityKey2.default,
  addCityDay: _AddCityDay2.default,
  removeCityDay: _RemoveCityDay2.default,
  addTourplanCityBooking: _AddTourplanCityBooking2.default,
  cancelTourplanCityBooking: _CancelTourplanCityBooking2.default,
  updateCityServicesAvailability: _UpdateCityServicesAvailability2.default
};

exports.CityBookingType = cityBookingType;
exports.CityBookingMutation = exportedCityBookingMutation;
exports.CityBookingQuery = _CityBooking6.default;