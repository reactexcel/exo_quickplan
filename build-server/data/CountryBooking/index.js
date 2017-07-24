'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.GetServicesByCountryBookingKeyQuery = exports.CountryBookingMutation = exports.CountryBookingType = undefined;

var _CountryBooking = require('./types/CountryBooking');

var _CountryBooking2 = _interopRequireDefault(_CountryBooking);

var _AddCountryBooking = require('./mutations/AddCountryBooking');

var _AddCountryBooking2 = _interopRequireDefault(_AddCountryBooking);

var _GetServicesByCountryBookingKey = require('./queries/GetServicesByCountryBookingKey');

var _GetServicesByCountryBookingKey2 = _interopRequireDefault(_GetServicesByCountryBookingKey);

var _AddTourplanCountryBooking = require('./mutations/AddTourplanCountryBooking');

var _AddTourplanCountryBooking2 = _interopRequireDefault(_AddTourplanCountryBooking);

var _CancelTourplanCountryBooking = require('./mutations/CancelTourplanCountryBooking');

var _CancelTourplanCountryBooking2 = _interopRequireDefault(_CancelTourplanCountryBooking);

var _UpdateCountryServicesAvailability = require('./mutations/UpdateCountryServicesAvailability');

var _UpdateCountryServicesAvailability2 = _interopRequireDefault(_UpdateCountryServicesAvailability);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var countryBookingType = _CountryBooking2.default;
var exportedCountryBookingMutation = {
  addCountryBooking: _AddCountryBooking2.default,
  addTourplanCountryBooking: _AddTourplanCountryBooking2.default,
  cancelTourplanCountryBooking: _CancelTourplanCountryBooking2.default,
  updateCountryServicesAvailability: _UpdateCountryServicesAvailability2.default
};
var exportedGetServicesByCountryBookingKeyQuery = _GetServicesByCountryBookingKey2.default;

exports.CountryBookingType = countryBookingType;
exports.CountryBookingMutation = exportedCountryBookingMutation;
exports.GetServicesByCountryBookingKeyQuery = exportedGetServicesByCountryBookingKeyQuery;