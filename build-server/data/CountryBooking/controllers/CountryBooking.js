'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getCountryBookings = exports.remove = exports.updateServicesAvailability = exports.getCountryLocation = exports.removeTourplanCountryBookings = exports.addTourplanCountryBookings = exports.getCountryBooking = exports.addCountryBooking = undefined;

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _taggedTemplateLiteral2 = require('babel-runtime/helpers/taggedTemplateLiteral');

var _taggedTemplateLiteral3 = _interopRequireDefault(_taggedTemplateLiteral2);

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var addCountryBooking = function () {
  var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(args) {
    var args_order, args_addedIndex, save_args, response, added_country_key, trip, existingCountryOrder, newCountryOrder, keyWhereToSaveNew, uIndex;
    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            args_order = args.order;
            args_addedIndex = args.addedIndex;
            save_args = {
              tripKey: args.tripKey,
              countryCode: args.countryCode,
              clientMutationId: args.clientMutationId
            };
            _context.next = 5;
            return (0, _request2.default)('http://localhost:8529/_db/exo-dev/bbt/countrybooking', _request.POST, save_args);

          case 5:
            response = _context.sent;


            // try {
            //   // Create location edges
            //   const thaiCountry = await locationCollection.firstExample({name: "Thailand"});
            //   // await locatedInEdgeCollection.save({}, thaiCountry._id, response._id);
            //   const result = await db.query(aql`
            //     INSERT {_from: ${response._id}, _to: ${thaiCountry._id}} IN locatedIn
            //   `);
            // } catch (e) {
            //   console.log(e);
            // }

            // start
            // to change country order on the basis of args_addedIndex & args_order
            // first get trip country orders
            added_country_key = response._key;
            _context.next = 9;
            return tripCtrl.getTrip({ _key: args.tripKey });

          case 9:
            trip = _context.sent;
            existingCountryOrder = trip.countryOrder;
            newCountryOrder = [];

            newCountryOrder = existingCountryOrder;
            if (args_order.toString() === 'before' || args_order.toString() === 'after') {
              _lodash2.default.pull(newCountryOrder, added_country_key);
              keyWhereToSaveNew = args_addedIndex; // this is key of on which option is selected

              if (args_order.toString() === 'before') {
                newCountryOrder.splice(args_addedIndex, 0, added_country_key);
              } else {
                uIndex = args_addedIndex + 1;

                newCountryOrder.splice(uIndex, 0, added_country_key);
              }
            }
            trip.countryOrder = newCountryOrder;
            _context.next = 17;
            return tripCtrl.updateTrip(trip._key, trip);

          case 17:
            return _context.abrupt('return', response);

          case 18:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this);
  }));

  return function addCountryBooking(_x) {
    return _ref.apply(this, arguments);
  };
}();

var getCountryLocation = function () {
  var _ref2 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee2(countryBookingKey) {
    var locationCollection, countryBookingId, cursor, locationEdge;
    return _regenerator2.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            locationCollection = _database.db.collection('locations');
            countryBookingId = 'countryBookings/' + countryBookingKey;
            _context2.next = 4;
            return _database.db.query((0, _arangojs.aql)(_templateObject, countryBookingId));

          case 4:
            cursor = _context2.sent;
            _context2.next = 7;
            return cursor.next();

          case 7:
            locationEdge = _context2.sent;
            _context2.next = 10;
            return locationCollection.firstExample({ _id: locationEdge._to });

          case 10:
            return _context2.abrupt('return', _context2.sent);

          case 11:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, this);
  }));

  return function getCountryLocation(_x2) {
    return _ref2.apply(this, arguments);
  };
}();

var getCountryBookings = function () {
  var _ref5 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee4(vertexId) {
    var aqlQuery, result;
    return _regenerator2.default.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            aqlQuery = '\n    FOR vertex, edge\n    IN 1..1 OUTBOUND @vertexId\n    GRAPH \'exo-dev\'\n    FILTER\n      IS_SAME_COLLECTION(\'countryBookings\', vertex) AND\n      IS_SAME_COLLECTION(\'bookIn\', edge)\n    RETURN vertex\n  ';
            _context4.next = 3;
            return _database.db.query(aqlQuery, { vertexId: vertexId });

          case 3:
            result = _context4.sent;
            return _context4.abrupt('return', result.all());

          case 5:
          case 'end':
            return _context4.stop();
        }
      }
    }, _callee4, this);
  }));

  return function getCountryBookings(_x4) {
    return _ref5.apply(this, arguments);
  };
}();

var _templateObject = (0, _taggedTemplateLiteral3.default)(['\n    RETURN (FOR vertex, edge IN OUTBOUND DOCUMENT(', ') locatedIn RETURN edge)[0]'], ['\n    RETURN (FOR vertex, edge IN OUTBOUND DOCUMENT(', ') locatedIn RETURN edge)[0]']);

var _arangojs = require('arangojs');

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _database = require('../../database');

var _environment = require('../../../config/environment');

var _environment2 = _interopRequireDefault(_environment);

var _request = require('../../../utils/request');

var _request2 = _interopRequireDefault(_request);

var _Trip = require('../../TripPlanner/controllers/Trip');

var tripCtrl = _interopRequireWildcard(_Trip);

var _CityBooking = require('../../CityBooking/controllers/CityBooking');

var _Pax = require('../../Pax/controllers/Pax');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var graph = _database.db.graph(_environment2.default.arango.databaseName);
var countryBookings = graph.vertexCollection('countryBookings');

function getCountryBooking(countryBookingKey) {
  return (0, _request2.default)('http://localhost:8529/_db/exo-dev/bbt/countrybooking/get-service-bookings-by-country-key', _request.POST, { countryBookingKey: countryBookingKey });
}

function addTourplanCountryBookings(args) {
  return (0, _request2.default)('http://localhost:8529/_db/exo-dev/bbt/countrybooking/create-tourplan-bookings-from-countryKey', _request.POST, args);
}

function removeTourplanCountryBookings(args) {
  return (0, _request2.default)('http://localhost:8529/_db/exo-dev/bbt/countrybooking/remove-tourplan-bookings-from-countryKey', _request.POST, args);
}

function updateServicesAvailability(args) {
  return (0, _request2.default)('http://localhost:8529/_db/exo-dev/bbt/countrybooking/check-services-availability', _request.POST, args);
}

var remove = function () {
  var _ref3 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee3(countryBookingKey) {
    var cityBookings;
    return _regenerator2.default.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.next = 2;
            return (0, _CityBooking.getCityBookings)('countryBookings/' + countryBookingKey);

          case 2:
            cityBookings = _context3.sent;
            _context3.next = 5;
            return _promise2.default.all(cityBookings.map(function (_ref4) {
              var _key = _ref4._key;
              return (0, _CityBooking.remove)(_key);
            }));

          case 5:
            return _context3.abrupt('return', countryBookings.remove(countryBookingKey));

          case 6:
          case 'end':
            return _context3.stop();
        }
      }
    }, _callee3, undefined);
  }));

  return function remove(_x3) {
    return _ref3.apply(this, arguments);
  };
}();

exports.addCountryBooking = addCountryBooking;
exports.getCountryBooking = getCountryBooking;
exports.addTourplanCountryBookings = addTourplanCountryBookings;
exports.removeTourplanCountryBookings = removeTourplanCountryBookings;
exports.getCountryLocation = getCountryLocation;
exports.updateServicesAvailability = updateServicesAvailability;
exports.remove = remove;
exports.getCountryBookings = getCountryBookings;