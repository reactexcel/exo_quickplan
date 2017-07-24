'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getDefaultToursForCity = exports.remove = exports.getCityBookings = exports.updateServicesAvailability = exports.removeCityBooking = exports.getCityLocation = exports.getCityBooking = exports.updateServicesByCityKey = exports.removeCityDay = exports.addCityDay = exports.removeTourplanCityBookings = exports.addTourplanCityBookings = exports.addCityBooking = undefined;

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _taggedTemplateLiteral2 = require('babel-runtime/helpers/taggedTemplateLiteral');

var _taggedTemplateLiteral3 = _interopRequireDefault(_taggedTemplateLiteral2);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var addCityBooking = function () {
  var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(args) {
    var response, cursor, queryResult, countryBooking, trip, countryIndex, cityIndex, originIndex, originCityBookingKey, destinationCityBookingKey, previousCountryKey, previousCountry, previousCityOrder, cityAfterKey, cityAfterId, errorEdge, _transferEdgeCollection;

    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return (0, _request2.default)('http://localhost:8529/_db/exo-dev/bbt/citybooking', _request.POST, args);

          case 2:
            response = _context.sent;
            _context.prev = 3;
            cursor = void 0;
            _context.next = 7;
            return _database.db.query((0, _arangojs.aql)(_templateObject, response._id, response._id));

          case 7:
            cursor = _context.sent;
            _context.next = 10;
            return cursor.next();

          case 10:
            queryResult = _context.sent;
            countryBooking = queryResult.countryBooking, trip = queryResult.trip;

            // Skip if first city and country

            if (!(countryBooking.cityOrder.length < 1 && trip.countryOrder.length <= 1)) {
              _context.next = 14;
              break;
            }

            return _context.abrupt('return', response);

          case 14:

            // Set origin/destination city
            countryIndex = trip.countryOrder.indexOf(countryBooking._key);
            cityIndex = countryBooking.cityOrder.indexOf(response._key);
            originIndex = cityIndex === 0 ? cityIndex : cityIndex - 1;
            originCityBookingKey = countryBooking.cityOrder[originIndex];
            destinationCityBookingKey = response._key;

            // If across country and is first city then link to last city of previous country

            if (!(countryIndex > 0 && cityIndex === 0)) {
              _context.next = 26;
              break;
            }

            previousCountryKey = trip.countryOrder[countryIndex - 1];
            _context.next = 23;
            return _database.db.collection('countryBookings').firstExample({ _key: previousCountryKey });

          case 23:
            previousCountry = _context.sent;
            previousCityOrder = previousCountry.cityOrder;


            originCityBookingKey = previousCityOrder[previousCityOrder.length - 1];

          case 26:
            _context.next = 28;
            return (0, _TransferPlacement.addTransferPlacement)({
              originCityBookingKey: originCityBookingKey,
              destinationCityBookingKey: destinationCityBookingKey
            });

          case 28:
            _context.next = 30;
            return (0, _TransferPlacement.addDepartureTransferPlacement)({ tripKey: trip._key });

          case 30:
            if (!(cityIndex !== countryBooking.cityOrder.length - 1)) {
              _context.next = 44;
              break;
            }

            cityAfterKey = countryBooking.cityOrder[cityIndex + 1];
            cityAfterId = 'cityBookings/' + cityAfterKey;
            _context.next = 35;
            return _database.db.query((0, _arangojs.aql)(_templateObject2, cityAfterId));

          case 35:
            cursor = _context.sent;
            _context.next = 38;
            return cursor.next();

          case 38:
            errorEdge = _context.sent;
            _transferEdgeCollection = _database.db.edgeCollection('transfer');

            // Update error edge

            _context.next = 42;
            return _transferEdgeCollection.remove(errorEdge);

          case 42:
            _context.next = 44;
            return _transferEdgeCollection.save({}, response._id, errorEdge._to);

          case 44:
            _context.next = 49;
            break;

          case 46:
            _context.prev = 46;
            _context.t0 = _context['catch'](3);

            console.log(_context.t0);

          case 49:
            return _context.abrupt('return', response);

          case 50:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this, [[3, 46]]);
  }));

  return function addCityBooking(_x) {
    return _ref.apply(this, arguments);
  };
}();

var getCityLocation = function () {
  var _ref2 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee2(cityBookingKey) {
    var locationCollection, cityBookingId, cursor, locationEdge;
    return _regenerator2.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            locationCollection = _database.db.collection('locations');
            cityBookingId = 'cityBookings/' + cityBookingKey;
            _context2.next = 4;
            return _database.db.query((0, _arangojs.aql)(_templateObject3, cityBookingId));

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

  return function getCityLocation(_x2) {
    return _ref2.apply(this, arguments);
  };
}();

// added to remove city
var removeCityBooking = function () {
  var _ref3 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee3(args) {
    var removeCityKey, countryBookingComplete, cityOrder, checkRemoveCityIndex, prevCityKey, nextCityKey, aa, bb, transferPlacementKeyToUpdate, edge, _bb, _transferPlacementKeyToUpdate, _edge, countryBooking, new_cityOrder;

    return _regenerator2.default.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            // remove city from cityBookings
            // let cityBooking = await cityBookings.firstExample( { _key: args.cityBookingKey.toString() } );
            // if( cityBooking ){
            //   await cityBookings.remove({ _key: args.cityBookingKey.toString() });
            // }
            // first check if countryBookingKey exist and  remove cityBookingKey from cityOrder

            // start -- need to update transfer origin of next city
            removeCityKey = args.cityBookingKey;
            _context3.next = 3;
            return (0, _CountryBooking.getCountryBooking)(args.countryBookingKey);

          case 3:
            countryBookingComplete = _context3.sent;
            cityOrder = countryBookingComplete.cityOrder;
            checkRemoveCityIndex = cityOrder.indexOf(removeCityKey);
            prevCityKey = -1;
            nextCityKey = -1;

            if (typeof cityOrder[checkRemoveCityIndex - 1] !== 'undefined') {
              prevCityKey = cityOrder[checkRemoveCityIndex - 1];
            }
            if (typeof cityOrder[checkRemoveCityIndex + 1] !== 'undefined') {
              nextCityKey = cityOrder[checkRemoveCityIndex + 1];
            }

            if (!(prevCityKey !== -1 && nextCityKey !== -1)) {
              _context3.next = 23;
              break;
            }

            _context3.next = 13;
            return (0, _TransferPlacement.getTransferPlacementByCityBookingKey)({ cityBookingKey: prevCityKey });

          case 13:
            aa = _context3.sent;
            _context3.next = 16;
            return (0, _TransferPlacement.getTransferPlacementByCityBookingKey)({ cityBookingKey: nextCityKey });

          case 16:
            bb = _context3.sent;
            transferPlacementKeyToUpdate = bb._key;
            _context3.next = 20;
            return transferEdgeCollection.removeByExample({ _to: 'transferPlacements/' + transferPlacementKeyToUpdate });

          case 20:
            edge = _context3.sent;
            _context3.next = 23;
            return transferEdgeCollection.save({}, 'cityBookings/' + prevCityKey, 'transferPlacements/' + transferPlacementKeyToUpdate);

          case 23:
            if (!(prevCityKey === -1 && nextCityKey !== -1)) {
              _context3.next = 33;
              break;
            }

            _context3.next = 26;
            return (0, _TransferPlacement.getTransferPlacementByCityBookingKey)({ cityBookingKey: nextCityKey });

          case 26:
            _bb = _context3.sent;
            _transferPlacementKeyToUpdate = _bb._key;
            _context3.next = 30;
            return transferEdgeCollection.removeByExample({ _to: 'transferPlacements/' + _transferPlacementKeyToUpdate });

          case 30:
            _edge = _context3.sent;
            _context3.next = 33;
            return transferEdgeCollection.save({}, 'cityBookings/' + nextCityKey, 'transferPlacements/' + _transferPlacementKeyToUpdate);

          case 33:
            _context3.next = 35;
            return countryBookings.firstExample({ _key: args.countryBookingKey.toString() });

          case 35:
            countryBooking = _context3.sent;

            if (!(countryBooking && countryBooking.cityOrder && countryBooking.cityOrder.length > 0)) {
              _context3.next = 41;
              break;
            }

            _lodash2.default.pull(countryBooking.cityOrder, args.cityBookingKey.toString());
            new_cityOrder = countryBooking.cityOrder;
            _context3.next = 41;
            return countryBookings.updateByExample({ _key: args.countryBookingKey.toString() }, {
              cityOrder: new_cityOrder
            });

          case 41:

            if (args.cityBookingKey) {
              deleteCityBooking(args.cityBookingKey);
            }

            return _context3.abrupt('return', {});

          case 43:
          case 'end':
            return _context3.stop();
        }
      }
    }, _callee3, this);
  }));

  return function removeCityBooking(_x3) {
    return _ref3.apply(this, arguments);
  };
}();

var getCityBookings = function () {
  var _ref8 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee5(vertexId) {
    var aqlQuery, result;
    return _regenerator2.default.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            aqlQuery = '\n    FOR vertex, edge\n    IN 1..1 OUTBOUND @vertexId\n    GRAPH \'exo-dev\'\n    FILTER\n      IS_SAME_COLLECTION(\'cityBookings\', vertex) AND\n      IS_SAME_COLLECTION(\'bookIn\', edge)\n    RETURN vertex\n  ';
            _context5.next = 3;
            return _database.db.query(aqlQuery, { vertexId: vertexId });

          case 3:
            result = _context5.sent;
            return _context5.abrupt('return', result.all());

          case 5:
          case 'end':
            return _context5.stop();
        }
      }
    }, _callee5, this);
  }));

  return function getCityBookings(_x5) {
    return _ref8.apply(this, arguments);
  };
}();

// get the default(implicit) tours preselection for city


var getDefaultToursForCity = function () {
  var _ref9 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee6(cityBookingKey) {
    var cityBookingId, aqlQuery, result;
    return _regenerator2.default.wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            cityBookingId = 'cityBookings/' + cityBookingKey;
            // 1. get the ta offices which handle the trip.
            // 2. get the default tour for that ta offices in that city

            aqlQuery = '\n    let cityBooking = document(@cityBookingId)\n    let locationId = first(FOR vertex, edge IN OUTBOUND cityBooking._id locatedIn RETURN edge._to)\n    let proposalId = FIRST(FOR vertex, edge\n        IN 3..3 INBOUND cityBooking._id\n        GRAPH \'exo-dev\'\n        FILTER IS_SAME_COLLECTION(\'proposals\', vertex)\n        RETURN vertex._id)\n    let taUserId = first(for vertex, edge in OUTBOUND proposalId workedBy filter edge.created != true and vertex.role == \'TA\' return edge._to)\n    let officeId = first(for edge in worksFor filter edge._from == taUserId return edge._to)\n    for selectedEdge in selected\n        let tourId = selectedEdge._to\n        filter selectedEdge._from == officeId and selectedEdge.default == true\n        and Length(FOR vertex, edge IN 1..1 OUTBOUND tourId GRAPH \'exo-dev\'\n            FILTER edge._to == locationId\n            RETURN vertex  ) > 0\n        return tourId\n    ';
            _context6.next = 4;
            return _database.db.query(aqlQuery, { cityBookingId: cityBookingId });

          case 4:
            result = _context6.sent;
            return _context6.abrupt('return', result.all());

          case 6:
          case 'end':
            return _context6.stop();
        }
      }
    }, _callee6, this);
  }));

  return function getDefaultToursForCity(_x6) {
    return _ref9.apply(this, arguments);
  };
}();

var _templateObject = (0, _taggedTemplateLiteral3.default)(['\n      LET cityBookingEdge = (FOR vertex, edge IN INBOUND ', ' bookIn RETURN edge)[0]\n      LET countryBookingEdge = (FOR vertex, edge IN INBOUND cityBookingEdge._from bookIn RETURN edge)[0]\n\n      LET cityBooking = DOCUMENT(', ')\n      LET countryBooking = DOCUMENT(countryBookingEdge._to)\n      LET trip = DOCUMENT(countryBookingEdge._from)\n\n      RETURN {countryBooking, trip}'], ['\n      LET cityBookingEdge = (FOR vertex, edge IN INBOUND ', ' bookIn RETURN edge)[0]\n      LET countryBookingEdge = (FOR vertex, edge IN INBOUND cityBookingEdge._from bookIn RETURN edge)[0]\n\n      LET cityBooking = DOCUMENT(', ')\n      LET countryBooking = DOCUMENT(countryBookingEdge._to)\n      LET trip = DOCUMENT(countryBookingEdge._from)\n\n      RETURN {countryBooking, trip}']),
    _templateObject2 = (0, _taggedTemplateLiteral3.default)(['\n        LET afterEdge = (FOR vertex, edge IN INBOUND ', ' transfer RETURN edge)[0]\n        LET errorEdge = (FOR vertex, edge IN INBOUND afterEdge._from transfer RETURN edge)[0]\n        RETURN errorEdge'], ['\n        LET afterEdge = (FOR vertex, edge IN INBOUND ', ' transfer RETURN edge)[0]\n        LET errorEdge = (FOR vertex, edge IN INBOUND afterEdge._from transfer RETURN edge)[0]\n        RETURN errorEdge']),
    _templateObject3 = (0, _taggedTemplateLiteral3.default)(['\n    RETURN (FOR vertex, edge IN OUTBOUND DOCUMENT(', ') locatedIn RETURN edge)[0]'], ['\n    RETURN (FOR vertex, edge IN OUTBOUND DOCUMENT(', ') locatedIn RETURN edge)[0]']);

var _arangojs = require('arangojs');

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _request = require('../../../utils/request');

var _request2 = _interopRequireDefault(_request);

var _environment = require('../../../config/environment');

var _environment2 = _interopRequireDefault(_environment);

var _TransferPlacement = require('../../TransferPlacement/controllers/TransferPlacement');

var _database = require('../../database');

var _AccommodationPlacement = require('../../AccomodationPlacement/controllers/AccommodationPlacement');

var _CityDay = require('../../CityDay/controllers/CityDay');

var _CountryBooking = require('../../CountryBooking/controllers/CountryBooking');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var graph = _database.db.graph(_environment2.default.arango.databaseName);
var graphCityBookings = graph.vertexCollection('cityBookings');
var cityBookings = _database.db.collection('cityBookings');
var countryBookings = _database.db.collection('countryBookings');
var transferEdgeCollection = _database.db.edgeCollection('transfer');

function addTourplanCityBookings(args) {
  return (0, _request2.default)('http://localhost:8529/_db/exo-dev/bbt/citybooking/create-tourplan-bookings-from-cityKey', _request.POST, args);
}

function removeTourplanCityBookings(args) {
  return (0, _request2.default)('http://localhost:8529/_db/exo-dev/bbt/citybooking/remove-tourplan-bookings-from-cityKey', _request.POST, args);
}

function addCityDay(args) {
  return (0, _request2.default)('http://localhost:8529/_db/exo-dev/bbt/cityday', _request.POST, args);
}

function removeCityDay(args) {
  return (0, _request2.default)('http://localhost:8529/_db/exo-dev/bbt/cityday/remove-city-day', _request.POST, args);
}

function updateServicesByCityKey(args) {
  return (0, _request2.default)('http://localhost:8529/_db/exo-dev/bbt/citybooking/patch-tours-by-city-key', _request.POST, args);
}

function getCityBooking(args) {
  return (0, _request2.default)(_environment2.default.foxx.url + '/citybooking/get-service-bookings-by-city-key', _request.POST, args);
}

function deleteCityBooking(cityBookingKey) {
  try {
    return (0, _request2.default)('http://localhost:8529/_db/exo-dev/bbt/citybooking/' + cityBookingKey, _request.DELETE);
  } catch (e) {
    return false;
  }
}

function updateServicesAvailability(args) {
  return (0, _request2.default)('http://localhost:8529/_db/exo-dev/bbt/citybooking/check-services-availability', _request.POST, args);
}

var remove = function () {
  var _ref4 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee4(cityBookingKey) {
    var transferPlacements, accomodationPlacements, cityDays;
    return _regenerator2.default.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            _context4.next = 2;
            return (0, _TransferPlacement.getTransferPlacements)('cityBookings/' + cityBookingKey);

          case 2:
            transferPlacements = _context4.sent;
            _context4.next = 5;
            return _promise2.default.all(transferPlacements.map(function (_ref5) {
              var _key = _ref5._key;
              return (0, _TransferPlacement.remove)(_key);
            }));

          case 5:
            _context4.next = 7;
            return (0, _AccommodationPlacement.getAccommodationPlacements)('cityBookings/' + cityBookingKey);

          case 7:
            accomodationPlacements = _context4.sent;
            _context4.next = 10;
            return _promise2.default.all(accomodationPlacements.map(function (_ref6) {
              var _key = _ref6._key;
              return (0, _AccommodationPlacement.remove)(_key);
            }));

          case 10:
            _context4.next = 12;
            return (0, _CityDay.getCityDays)('cityBookings/' + cityBookingKey);

          case 12:
            cityDays = _context4.sent;
            _context4.next = 15;
            return _promise2.default.all(cityDays.map(function (_ref7) {
              var _key = _ref7._key;
              return (0, _CityDay.remove)(_key);
            }));

          case 15:
            return _context4.abrupt('return', graphCityBookings.remove(cityBookingKey));

          case 16:
          case 'end':
            return _context4.stop();
        }
      }
    }, _callee4, undefined);
  }));

  return function remove(_x4) {
    return _ref4.apply(this, arguments);
  };
}();

exports.addCityBooking = addCityBooking;
exports.addTourplanCityBookings = addTourplanCityBookings;
exports.removeTourplanCityBookings = removeTourplanCityBookings;
exports.addCityDay = addCityDay;
exports.removeCityDay = removeCityDay;
exports.updateServicesByCityKey = updateServicesByCityKey;
exports.getCityBooking = getCityBooking;
exports.getCityLocation = getCityLocation;
exports.removeCityBooking = removeCityBooking;
exports.updateServicesAvailability = updateServicesAvailability;
exports.getCityBookings = getCityBookings;
exports.remove = remove;
exports.getDefaultToursForCity = getDefaultToursForCity;