'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getDefaultTours = exports.updateTourPaxs = exports.getAccessibleTours = undefined;

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var updateTourPaxs = function () {
  var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(args) {
    var serviceBookingKey, paxKeys, bookInEdge, roomConfigId, deleteRet, newRoomConfig, roomConfigToPaxsEdges, updateRet;
    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            // return request(`${config.foxx.url}/servicebooking/paxs/${args.serviceBookingKey}`, PUT, args);
            serviceBookingKey = args.serviceBookingKey, paxKeys = args.paxKeys;

            // NOTES, Refactor to make tours use roomConfig collection

            _context.next = 3;
            return bookInEdgeCollection.outEdges('serviceBookings/' + serviceBookingKey);

          case 3:
            bookInEdge = _context.sent;
            roomConfigId = void 0;

            if (!(bookInEdge && bookInEdge.length)) {
              _context.next = 12;
              break;
            }

            roomConfigId = bookInEdge[0]._to;
            _context.next = 9;
            return participateEdgeCollection.removeByExample({ _from: roomConfigId });

          case 9:
            deleteRet = _context.sent;
            _context.next = 18;
            break;

          case 12:
            _context.next = 14;
            return roomConfigsCollection.save({ roomType: 'sg' });

          case 14:
            newRoomConfig = _context.sent;
            _context.next = 17;
            return bookInEdgeCollection.save({ _from: 'serviceBookings/' + serviceBookingKey, _to: newRoomConfig._id });

          case 17:
            roomConfigId = newRoomConfig._id;

          case 18:
            roomConfigToPaxsEdges = paxKeys.map(function (paxKey) {
              return { _from: roomConfigId, _to: 'paxs/' + paxKey };
            });
            _context.next = 21;
            return participateEdgeCollection.import(roomConfigToPaxsEdges);

          case 21:
            updateRet = _context.sent;
            return _context.abrupt('return', serviceBookingsCollection.firstExample({ _key: serviceBookingKey }));

          case 23:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this);
  }));

  return function updateTourPaxs(_x) {
    return _ref.apply(this, arguments);
  };
}();

// get the default preselection tours for the agent of that city


var getDefaultTours = function () {
  var _ref2 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee2(locationId, officesId) {
    var aqlQuery, result;
    return _regenerator2.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            aqlQuery = '\n    let toursOfCity = (FOR vertex, edge IN 1..1 INBOUND @locationId GRAPH \'exo-dev\'\n      FILTER IS_SAME_COLLECTION(\'tours\', vertex)\n      RETURN vertex._id)\n    let defaultTours = (\n      FOR selection IN selectedFor\n      FILTER selection._from == @officesId && selection.default == true\n      RETURN selection._to)\n    let tourIds = INTERSECTION(toursOfCity, defaultTours)\n    for tourId in tourIds\n      return document(tourId)\n  ';
            _context2.next = 3;
            return _database.db.query(aqlQuery, {
              locationId: locationId, officesId: officesId
            });

          case 3:
            result = _context2.sent;
            return _context2.abrupt('return', result.next());

          case 5:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, this);
  }));

  return function getDefaultTours(_x2, _x3) {
    return _ref2.apply(this, arguments);
  };
}();

var _request = require('../../../utils/request');

var _request2 = _interopRequireDefault(_request);

var _environment = require('../../../config/environment');

var _environment2 = _interopRequireDefault(_environment);

var _database = require('../../database');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var serviceBookingsCollection = _database.db.collection('serviceBookings');
var roomConfigsCollection = _database.db.collection('roomConfigs');
var bookInEdgeCollection = _database.db.edgeCollection('bookIn');
var participateEdgeCollection = _database.db.edgeCollection('participate');

function getAccessibleTours(args) {
  var country = args.country,
      city = args.city,
      date = args.date,
      cityDayKey = args.cityDayKey,
      officeKey = args.officeKey;

  return (0, _request2.default)('http://localhost:8529/_db/exo-dev/bbt/accessibletours', _request.POST, { country: country, city: city, date: date, cityDayKey: cityDayKey, officeKey: officeKey });
}

exports.getAccessibleTours = getAccessibleTours;
exports.updateTourPaxs = updateTourPaxs;
exports.getDefaultTours = getDefaultTours;