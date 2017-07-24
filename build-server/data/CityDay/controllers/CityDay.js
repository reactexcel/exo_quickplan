'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.updateCityDays = exports.addMeal = exports.changeNote = exports.getCityDays = exports.remove = exports.selectServiceBookings = exports.getCityDay = exports.togglePreselection = exports.updateServicesByCityDayKey = undefined;

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var selectServiceBookings = function () {
  var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(_ref2) {
    var cityDayKey = _ref2.cityDayKey,
        slot = _ref2.slot,
        tourKeys = _ref2.tourKeys,
        selectedServiceBookingKeys = _ref2.selectedServiceBookingKeys;
    var newServices, aqlQuery, result;
    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            if (!(tourKeys && tourKeys.length)) {
              _context.next = 5;
              break;
            }

            _context.next = 3;
            return _promise2.default.all(tourKeys.map(function (tour) {
              return (0, _ServiceBooking.addServiceBooking)((0, _extends3.default)({
                cityDayKey: cityDayKey,
                slot: slot
              }, tour));
            }));

          case 3:
            newServices = _context.sent;

            selectedServiceBookingKeys = (selectedServiceBookingKeys || []).concat(newServices.map(function (service) {
              return service._key;
            })); // eslint-disable-line no-param-reassign

          case 5:

            // update the select book In edge as inactive=false,  update unselect as inactive=true;
            aqlQuery = '\n     LET startSlot = document(concat(\'serviceBookings/\', @selectedServiceBookingKeys[0])).startSlot\n     FOR vertex, edge IN outBOUND @cityDayId bookIn\n       FILTER IS_SAME_COLLECTION (\'serviceBookings\', vertex) AND vertex.startSlot == startSlot\n       LET active = POSITION(@selectedServiceBookingKeys, vertex._key)\n       UPDATE edge WITH { inactive:  !active } IN bookIn\n  ';
            _context.next = 8;
            return _database.db.query(aqlQuery, {
              cityDayId: 'cityDays/' + cityDayKey,
              selectedServiceBookingKeys: selectedServiceBookingKeys || []
            });

          case 8:
            result = _context.sent;
            return _context.abrupt('return', { cityDayKey: cityDayKey, slot: slot });

          case 10:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this);
  }));

  return function selectServiceBookings(_x) {
    return _ref.apply(this, arguments);
  };
}();

var getCityDays = function () {
  var _ref5 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee3(vertexId) {
    var aqlQuery, result;
    return _regenerator2.default.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            aqlQuery = '\n    FOR vertex, edge\n    IN 1..1 OUTBOUND @vertexId\n    GRAPH \'exo-dev\'\n    FILTER\n      IS_SAME_COLLECTION(\'cityDays\', vertex) AND\n      IS_SAME_COLLECTION(\'bookIn\', edge)\n    RETURN vertex\n  ';
            _context3.next = 3;
            return _database.db.query(aqlQuery, { vertexId: vertexId });

          case 3:
            result = _context3.sent;
            return _context3.abrupt('return', result.all());

          case 5:
          case 'end':
            return _context3.stop();
        }
      }
    }, _callee3, this);
  }));

  return function getCityDays(_x3) {
    return _ref5.apply(this, arguments);
  };
}();

var addMeal = function () {
  var _ref8 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee5(_ref9) {
    var cityDayKey = _ref9.cityDayKey,
        mealOrder = _ref9.mealOrder,
        mealType = _ref9.mealType,
        mealNote = _ref9.mealNote;
    var cityDay, timeSlot;
    return _regenerator2.default.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            _context5.next = 2;
            return cityDays.firstExample({ _key: cityDayKey });

          case 2:
            cityDay = _context5.sent;

            if (!cityDay.timeSlots) {
              cityDay.timeSlots = [{
                slotOrder: 1,
                meal: { type: 'No meal arranged' }
              }, {
                slotOrder: 2,
                meal: { type: 'No meal arranged' }
              }, {
                slotOrder: 3,
                meal: { type: 'No meal arranged' }
              }];
            }
            timeSlot = cityDay.timeSlots.find(function (timeSlot) {
              return timeSlot.slotOrder === mealOrder;
            });

            timeSlot.meal = { type: mealType, note: mealNote };
            _context5.next = 8;
            return cityDays.updateByExample({ _key: cityDayKey }, cityDay);

          case 8:
            return _context5.abrupt('return', cityDay);

          case 9:
          case 'end':
            return _context5.stop();
        }
      }
    }, _callee5, this);
  }));

  return function addMeal(_x5) {
    return _ref8.apply(this, arguments);
  };
}();

var _request = require('../../../utils/request');

var _request2 = _interopRequireDefault(_request);

var _environment = require('../../../config/environment');

var _environment2 = _interopRequireDefault(_environment);

var _database = require('../../database');

var _ServiceBooking = require('../../ServiceBooking/controllers/ServiceBooking');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var graph = _database.db.graph(_environment2.default.arango.databaseName);
var cityDays = graph.vertexCollection('cityDays');

var bookInEdgeCollection = _database.db.edgeCollection('bookIn');

function updateServicesByCityDayKey(args) {
  return (0, _request2.default)('http://localhost:8529/_db/exo-dev/bbt/cityday/patch-tours-by-city-day-key', _request.POST, args);
}

function togglePreselection(args) {
  return (0, _request2.default)('http://localhost:8529/_db/exo-dev/bbt/cityday/toggle-preselect-tour', _request.POST, args);
}

function getCityDay(args) {
  return (0, _request2.default)(_environment2.default.foxx.url + '/cityday/get-tours-by-city-day-key', _request.POST, args);
}

var remove = function () {
  var _ref3 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee2(cityDayKey) {
    var serviceBookings;
    return _regenerator2.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.next = 2;
            return (0, _ServiceBooking.getServiceBookings)('cityDays/' + cityDayKey);

          case 2:
            serviceBookings = _context2.sent;
            _context2.next = 5;
            return _promise2.default.all(serviceBookings.map(function (_ref4) {
              var _key = _ref4._key;
              return (0, _ServiceBooking.remove)(_key);
            }));

          case 5:
            return _context2.abrupt('return', cityDays.remove(cityDayKey));

          case 6:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, undefined);
  }));

  return function remove(_x2) {
    return _ref3.apply(this, arguments);
  };
}();

var changeNote = function () {
  var _ref6 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee4(_ref7) {
    var cityDayKey = _ref7.cityDayKey,
        note = _ref7.note;
    var aqlQuery, result;
    return _regenerator2.default.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            aqlQuery = '\n    FOR cityDay in cityDays\n      FILTER cityDay._id == @cityDayId\n      UPDATE cityDay WITH { note: @note } IN cityDays\n      RETURN NEW\n  ';
            _context4.next = 3;
            return _database.db.query(aqlQuery, {
              cityDayId: 'cityDays/' + cityDayKey,
              note: note
            });

          case 3:
            result = _context4.sent;
            return _context4.abrupt('return', result.next());

          case 5:
          case 'end':
            return _context4.stop();
        }
      }
    }, _callee4, undefined);
  }));

  return function changeNote(_x4) {
    return _ref6.apply(this, arguments);
  };
}();

function updateCityDays(key, unavailableSlots) {
  cityDays.updateByExample({ _key: key.toString() }, { unavailableSlots: unavailableSlots });
  return {};
}

exports.updateServicesByCityDayKey = updateServicesByCityDayKey;
exports.togglePreselection = togglePreselection;
exports.getCityDay = getCityDay;
exports.selectServiceBookings = selectServiceBookings;
exports.remove = remove;
exports.getCityDays = getCityDays;
exports.changeNote = changeNote;
exports.addMeal = addMeal;
exports.updateCityDays = updateCityDays;