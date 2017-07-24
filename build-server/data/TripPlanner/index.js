'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TripPlannerMutation = exports.TripPlannerQuery = exports.TripPlannerType = undefined;

var _Trip = require('./types/Trip');

var _Trip2 = _interopRequireDefault(_Trip);

var _Trip3 = require('./queries/Trip');

var _Trip4 = _interopRequireDefault(_Trip3);

var _AddTrip = require('./mutations/AddTrip');

var _AddTrip2 = _interopRequireDefault(_AddTrip);

var _AddCountry = require('./mutations/AddCountry');

var _AddCountry2 = _interopRequireDefault(_AddCountry);

var _RemoveCountry = require('./mutations/RemoveCountry');

var _RemoveCountry2 = _interopRequireDefault(_RemoveCountry);

var _AddCity = require('./mutations/AddCity');

var _AddCity2 = _interopRequireDefault(_AddCity);

var _RemoveCity = require('./mutations/RemoveCity');

var _RemoveCity2 = _interopRequireDefault(_RemoveCity);

var _UpdateCity = require('./mutations/UpdateCity');

var _UpdateCity2 = _interopRequireDefault(_UpdateCity);

var _UpdateDay = require('./mutations/UpdateDay');

var _UpdateDay2 = _interopRequireDefault(_UpdateDay);

var _RemoveDay = require('./mutations/RemoveDay');

var _RemoveDay2 = _interopRequireDefault(_RemoveDay);

var _UpdateService = require('./mutations/UpdateService');

var _UpdateService2 = _interopRequireDefault(_UpdateService);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var exportedTripPlannerQuery = _Trip4.default;
var exportedTripPlannerType = { TripTripPlanner: _Trip2.default };
var exportedTripPlannerMutation = {
  addTripTripPlanner: _AddTrip2.default,
  addCountryTripPlanner: _AddCountry2.default,
  removeCountryTripPlanner: _RemoveCountry2.default,
  addCityTripPlanner: _AddCity2.default,
  removeCityTripPlanner: _RemoveCity2.default,
  updateCityTripPlanner: _UpdateCity2.default,
  updateDayTripPlanner: _UpdateDay2.default,
  removeDayTripPlanner: _RemoveDay2.default,
  updateServiceTripPlanner: _UpdateService2.default
};

exports.TripPlannerType = exportedTripPlannerType;
exports.TripPlannerQuery = exportedTripPlannerQuery;
exports.TripPlannerMutation = exportedTripPlannerMutation;