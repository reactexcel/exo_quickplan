'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.confirmServiceAvailability = exports.getServiceBookings = exports.remove = exports.updateServicesAvailability = exports.updateServiceAvailability = exports.checkServicesAvailability = exports.getTransferPaxStatuses = exports.checkPaxStatus = exports.getServiceBooking = exports.changeServiceDaySlot = exports.cancelTourplanBookings = exports.addTourplanBookings = exports.cancelTourplanBooking = exports.addTourplanBooking = exports.updateServiceBooking = exports.removeServiceBooking = exports.addServiceBooking = undefined;

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _typeof2 = require('babel-runtime/helpers/typeof');

var _typeof3 = _interopRequireDefault(_typeof2);

// Used by function getTransferPaxStatuses
var getTransferPaxErrors = function () {
  var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(serviceBookingKey) {
    var tripAqlQuery, tripResult, _ref2, trips, transfers, paxs, aqlQuery, result;

    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            tripAqlQuery = '\n    LET serviceBookingId = CONCAT(\'serviceBookings/\', @serviceBookingKey)\n    LET transfers = (FOR transferVertex IN 1..1 OUTBOUND serviceBookingId GRAPH \'exo-dev\'\n      FILTER IS_SAME_COLLECTION(\'transfers\', transferVertex)\n      RETURN transferVertex)\n    LET trips = (for tripVertex in 4..4 INBOUND serviceBookingId GRAPH \'exo-dev\'\n      FILTER IS_SAME_COLLECTION(\'trips\', tripVertex)\n      COLLECT trip = tripVertex\n      return trip)\n    return { trips, transfers }\n  ';
            _context.next = 3;
            return _database.db.query(tripAqlQuery, { serviceBookingKey: serviceBookingKey });

          case 3:
            tripResult = _context.sent;
            _context.next = 6;
            return tripResult.next();

          case 6:
            _ref2 = _context.sent;
            trips = _ref2.trips;
            transfers = _ref2.transfers;

            if (!(!trips || !trips.length)) {
              _context.next = 11;
              break;
            }

            return _context.abrupt('return', []);

          case 11:
            _context.next = 13;
            return getTripPaxList(trips[0]._key);

          case 13:
            paxs = _context.sent;
            aqlQuery = '\n    FOR pax IN @paxs\n      FOR transfer IN @transfers\n        FILTER !transfer.pax[pax.ageGroup].allowed\n        LET paxInfo = transfer.pax[pax.ageGroup]\n        LET ageGroup = SUBSTITUTE(pax.ageGroup, {\n          \'infants\': \'Infants\',\n          \'adults\': \'Adults\',\n          \'children\': \'Children\'})\n        LET message = CONCAT(ageGroup , \' (\', paxInfo.ageFrom, \'-\', paxInfo.ageTo, \') not allowed\')\n        RETURN { severity: 20, message: message  }';
            _context.next = 17;
            return _database.db.query(aqlQuery, { paxs: paxs, transfers: transfers });

          case 17:
            result = _context.sent;
            return _context.abrupt('return', result.all());

          case 19:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this);
  }));

  return function getTransferPaxErrors(_x) {
    return _ref.apply(this, arguments);
  };
}();

// the trips paxs list and auto calculate the ageGroup of every pax.


var getTripPaxList = function () {
  var _ref3 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee2(tripKey) {
    var aqlQuery, paxsResult, _ref4, paxList, tripStrtDate;

    return _regenerator2.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            aqlQuery = '\n    LET tripId = CONCAT(\'trips/\', @tripKey)\n    LET trip = document(tripId)\n    LET paxList = (FOR pax IN 1..1 OUTBOUND tripId GRAPH \'exo-dev\'\n      FILTER IS_SAME_COLLECTION(\'paxs\', pax)\n      RETURN pax)\n    RETURN { paxList, tripStrtDate: trip.startDate }';
            _context2.next = 3;
            return _database.db.query(aqlQuery, { tripKey: tripKey });

          case 3:
            paxsResult = _context2.sent;
            _context2.next = 6;
            return paxsResult.next();

          case 6:
            _ref4 = _context2.sent;
            paxList = _ref4.paxList;
            tripStrtDate = _ref4.tripStrtDate;

            paxList.map(function (pax) {
              return calculatePaxAgeGroup(pax, tripStrtDate);
            });
            return _context2.abrupt('return', paxList);

          case 11:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, this);
  }));

  return function getTripPaxList(_x2) {
    return _ref3.apply(this, arguments);
  };
}();

var getTransferPaxStatuses = function () {
  var _ref5 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee3(serviceBookingKey) {
    var transferPaxErrors;
    return _regenerator2.default.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            if (!(serviceBookingKey && serviceBookingKey !== null && serviceBookingKey !== '')) {
              _context3.next = 12;
              break;
            }

            _context3.prev = 1;
            _context3.next = 4;
            return getTransferPaxErrors(serviceBookingKey);

          case 4:
            transferPaxErrors = _context3.sent;
            return _context3.abrupt('return', transferPaxErrors);

          case 8:
            _context3.prev = 8;
            _context3.t0 = _context3['catch'](1);

            console.log('getTransferPaxStatuses error', _context3.t0);

          case 11:
            return _context3.abrupt('return', []);

          case 12:
            return _context3.abrupt('return', []);

          case 13:
          case 'end':
            return _context3.stop();
        }
      }
    }, _callee3, this, [[1, 8]]);
  }));

  return function getTransferPaxStatuses(_x3) {
    return _ref5.apply(this, arguments);
  };
}();

var updateServiceAvailability = function () {
  var _ref6 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee4(args) {
    var result;
    return _regenerator2.default.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            _context4.next = 2;
            return (0, _request2.default)('http://localhost:8529/_db/exo-dev/bbt/servicebooking/check-service-availability', _request.POST, args);

          case 2:
            result = _context4.sent;
            return _context4.abrupt('return', result);

          case 4:
          case 'end':
            return _context4.stop();
        }
      }
    }, _callee4, this);
  }));

  return function updateServiceAvailability(_x4) {
    return _ref6.apply(this, arguments);
  };
}();

var updateServicesAvailability = function () {
  var _ref7 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee5(args) {
    var result;
    return _regenerator2.default.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            _context5.next = 2;
            return (0, _request2.default)('http://localhost:8529/_db/exo-dev/bbt/servicebooking/check-services-availability', _request.POST, args);

          case 2:
            result = _context5.sent;
            return _context5.abrupt('return', result);

          case 4:
          case 'end':
            return _context5.stop();
        }
      }
    }, _callee5, this);
  }));

  return function updateServicesAvailability(_x5) {
    return _ref7.apply(this, arguments);
  };
}();

// used for confirm serviceBooking is available after checked when it's on Request.


var confirmServiceAvailability = function () {
  var _ref8 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee6(_ref9) {
    var serviceBookingKey = _ref9.serviceBookingKey;
    var serviceBooking;
    return _regenerator2.default.wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            _context6.prev = 0;
            _context6.next = 3;
            return serviceBookings.firstExample({ _key: serviceBookingKey });

          case 3:
            serviceBooking = _context6.sent;

            if (!(serviceBooking.status && serviceBooking.status.state === 'On Request')) {
              _context6.next = 9;
              break;
            }

            serviceBooking.isConfirmed = true;
            serviceBooking.status.state = 'Available';
            _context6.next = 9;
            return serviceBookings.updateByExample({ _key: serviceBookingKey }, (0, _extends3.default)({}, serviceBooking));

          case 9:
            return _context6.abrupt('return', serviceBooking);

          case 12:
            _context6.prev = 12;
            _context6.t0 = _context6['catch'](0);

            console.log('error in Confirm service availability', _context6.t0);

          case 15:
            return _context6.abrupt('return', { serviceBookingKey: serviceBookingKey });

          case 16:
          case 'end':
            return _context6.stop();
        }
      }
    }, _callee6, this, [[0, 12]]);
  }));

  return function confirmServiceAvailability(_x6) {
    return _ref8.apply(this, arguments);
  };
}();

var remove = function () {
  var _ref10 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee7(serviceBookingKey) {
    var roomConfigs, activities, paxs;
    return _regenerator2.default.wrap(function _callee7$(_context7) {
      while (1) {
        switch (_context7.prev = _context7.next) {
          case 0:
            _context7.next = 2;
            return (0, _RoomConfig.getRoomConfigs)('serviceBookings/' + serviceBookingKey);

          case 2:
            roomConfigs = _context7.sent;
            _context7.next = 5;
            return _promise2.default.all(roomConfigs.map(function (_ref11) {
              var _key = _ref11._key;
              return (0, _RoomConfig.remove)(_key);
            }));

          case 5:
            _context7.next = 7;
            return (0, _Activity.getActivities)('serviceBookings/' + serviceBookingKey);

          case 7:
            activities = _context7.sent;
            _context7.next = 10;
            return _promise2.default.all(activities.map(function (_ref12) {
              var _key = _ref12._key;
              return (0, _Activity.remove)(_key);
            }));

          case 10:
            _context7.next = 12;
            return (0, _Pax.getPaxs)('serviceBookings/' + serviceBookingKey);

          case 12:
            paxs = _context7.sent;
            _context7.next = 15;
            return _promise2.default.all(paxs.map(function (_ref13) {
              var _key = _ref13._key;
              return (0, _Pax.remove)(_key);
            }));

          case 15:
            return _context7.abrupt('return', serviceBookings.remove(serviceBookingKey));

          case 16:
          case 'end':
            return _context7.stop();
        }
      }
    }, _callee7, this);
  }));

  return function remove(_x7) {
    return _ref10.apply(this, arguments);
  };
}();

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

var _request = require('../../../utils/request');

var _request2 = _interopRequireDefault(_request);

var _environment = require('../../../config/environment');

var _environment2 = _interopRequireDefault(_environment);

var _database = require('../../database');

var _RoomConfig = require('../../RoomConfig/controllers/RoomConfig');

var _Activity = require('../../Activity/controllers/Activity');

var _Pax = require('../../Pax/controllers/Pax');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var graph = _database.db.graph(_environment2.default.arango.databaseName);
var serviceBookings = graph.vertexCollection('serviceBookings');

function addServiceBooking(args) {
  return (0, _request2.default)('http://localhost:8529/_db/exo-dev/bbt/servicebooking', _request.POST, args);
}

function getServiceBooking(args) {
  var objArgs = args;

  if ((typeof args === 'undefined' ? 'undefined' : (0, _typeof3.default)(args)) !== 'object') {
    objArgs = {
      serviceBookingKey: args
    };
  }
  return (0, _request2.default)(_environment2.default.foxx.url + '/servicebooking/get-service-booking-by-key', _request.POST, objArgs);
}

function removeServiceBooking(args) {
  return (0, _request2.default)('http://localhost:8529/_db/exo-dev/bbt/servicebooking/' + args.serviceBookingKey, _request.DELETE, args);
}

function updateServiceBooking(patchData) {
  var serviceBookingKey = patchData.serviceBookingKey;
  delete patchData.serviceBookingKey; // eslint-disable-line no-param-reassign

  return (0, _request2.default)('http://localhost:8529/_db/exo-dev/bbt/servicebooking/' + serviceBookingKey, _request.PATCH, patchData);
}

// TODO: Remove and only use batch request (below)
function addTourplanBooking(args) {
  return (0, _request2.default)('http://localhost:8529/_db/exo-dev/bbt/servicebooking/create-update-tourplan-booking', _request.POST, args);
}

// TODO: Remove and only use batch request (below)
function cancelTourplanBooking(args) {
  return (0, _request2.default)('http://localhost:8529/_db/exo-dev/bbt/servicebooking/remove-servicebooking-tourplan', _request.POST, args);
}

function addTourplanBookings(args) {
  return (0, _request2.default)('http://localhost:8529/_db/exo-dev/bbt/servicebooking/create-update-tourplan-bookings', _request.POST, args);
}

function cancelTourplanBookings(args) {
  return (0, _request2.default)('http://localhost:8529/_db/exo-dev/bbt/servicebooking/remove-servicebookings-tourplan', _request.POST, args);
}

function changeServiceDaySlot(args) {
  return (0, _request2.default)('http://localhost:8529/_db/exo-dev/bbt/servicebooking/change-service-day-slot', _request.POST, args);
}

function checkPaxStatus(args) {
  return (0, _request2.default)(_environment2.default.foxx.url + '/servicebooking/check-pax-status', _request.POST, args);
}

function calculatePaxAgeGroup(pax, tripStartDate) {
  if (pax.ageGroup && pax.ageGroup !== '') {
    return;
  }

  var ageOnArrival = void 0;
  if (pax.dateOfBirth && pax.dateOfBirth !== '') {
    ageOnArrival = (0, _moment2.default)(new Date(tripStartDate)).diff((0, _moment2.default)(pax.dateOfBirth, 'D MMMM, YYYY'), 'years');
  } else {
    ageOnArrival = pax.ageOnArrival;
  }
  var age = _lodash2.default.parseInt(ageOnArrival);

  if (age < 2) {
    pax.ageGroup = 'infants'; // eslint-disable-line no-param-reassign
  } else if (age < 12) {
    pax.ageGroup = 'children'; // eslint-disable-line no-param-reassign
  } else {
    // eslint-disable-line no-else-return
    pax.ageGroup = 'adults'; // eslint-disable-line no-param-reassign
  }
}

function checkServicesAvailability(args) {
  var result = (0, _request2.default)('http://localhost:8529/_db/exo-dev/bbt/servicebooking/check-services-availability', _request.POST, args);
  return result;
}

var getServiceBookings = function () {
  var _ref14 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee8(vertexId) {
    var aqlQuery, result;
    return _regenerator2.default.wrap(function _callee8$(_context8) {
      while (1) {
        switch (_context8.prev = _context8.next) {
          case 0:
            aqlQuery = '\n      FOR serviceBooking, edge\n          IN 1..1 OUTBOUND @vertexId GRAPH \'exo-dev\'\n          FILTER\n              IS_SAME_COLLECTION(\'serviceBookings\', serviceBooking) AND\n              IS_SAME_COLLECTION(\'bookIn\', edge)\n          RETURN serviceBooking\n  ';
            _context8.next = 3;
            return _database.db.query(aqlQuery, { vertexId: vertexId });

          case 3:
            result = _context8.sent;
            return _context8.abrupt('return', result.all());

          case 5:
          case 'end':
            return _context8.stop();
        }
      }
    }, _callee8, undefined);
  }));

  return function getServiceBookings(_x8) {
    return _ref14.apply(this, arguments);
  };
}();

exports.addServiceBooking = addServiceBooking;
exports.removeServiceBooking = removeServiceBooking;
exports.updateServiceBooking = updateServiceBooking;
exports.addTourplanBooking = addTourplanBooking;
exports.cancelTourplanBooking = cancelTourplanBooking;
exports.addTourplanBookings = addTourplanBookings;
exports.cancelTourplanBookings = cancelTourplanBookings;
exports.changeServiceDaySlot = changeServiceDaySlot;
exports.getServiceBooking = getServiceBooking;
exports.checkPaxStatus = checkPaxStatus;
exports.getTransferPaxStatuses = getTransferPaxStatuses;
exports.checkServicesAvailability = checkServicesAvailability;
exports.updateServiceAvailability = updateServiceAvailability;
exports.updateServicesAvailability = updateServicesAvailability;
exports.remove = remove;
exports.getServiceBookings = getServiceBookings;
exports.confirmServiceAvailability = confirmServiceAvailability;