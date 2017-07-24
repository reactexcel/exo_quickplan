'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CityDayQuery = exports.CityDayMutation = exports.CityDayType = undefined;

var _CityDay = require('./types/CityDay');

var _CityDay2 = _interopRequireDefault(_CityDay);

var _UpdateServiceBookingsByCityDayKey = require('./mutations/UpdateServiceBookingsByCityDayKey');

var _UpdateServiceBookingsByCityDayKey2 = _interopRequireDefault(_UpdateServiceBookingsByCityDayKey);

var _TogglePreselection = require('./mutations/TogglePreselection');

var _TogglePreselection2 = _interopRequireDefault(_TogglePreselection);

var _SelectServiceBookings = require('./mutations/SelectServiceBookings');

var _SelectServiceBookings2 = _interopRequireDefault(_SelectServiceBookings);

var _AddMeal = require('./mutations/AddMeal');

var _AddMeal2 = _interopRequireDefault(_AddMeal);

var _CityDay3 = require('./queries/CityDay');

var _CityDay4 = _interopRequireDefault(_CityDay3);

var _ChangeNote = require('./mutations/ChangeNote');

var _ChangeNote2 = _interopRequireDefault(_ChangeNote);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var cityDayType = _CityDay2.default;
var exportedCityDayMutation = {
  updateToursByCityDayKey: _UpdateServiceBookingsByCityDayKey2.default,
  togglePreselection: _TogglePreselection2.default,
  selectServiceBookings: _SelectServiceBookings2.default,
  addMeal: _AddMeal2.default,
  ChangeNote: _ChangeNote2.default
};

exports.CityDayType = cityDayType;
exports.CityDayMutation = exportedCityDayMutation;
exports.CityDayQuery = _CityDay4.default;