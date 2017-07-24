'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _graphql = require('graphql');

var _graphqlRelay = require('graphql-relay');

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _CountryBooking = require('../../CountryBooking/types/CountryBooking');

var _CountryBooking2 = _interopRequireDefault(_CountryBooking);

var _ServiceBooking = require('../../ServiceBooking/types/ServiceBooking');

var _ServiceBooking2 = _interopRequireDefault(_ServiceBooking);

var _TransferPlacement = require('../../TransferPlacement/types/TransferPlacement');

var _TransferPlacement2 = _interopRequireDefault(_TransferPlacement);

var _TransferPlacement3 = require('../../TransferPlacement/controllers/TransferPlacement');

var _Trip = require('../controllers/Trip');

var _Pax = require('../../Pax/types/Pax');

var _Pax2 = _interopRequireDefault(_Pax);

var _Location = require('../../Location/types/Location');

var _Location2 = _interopRequireDefault(_Location);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var TripTravellersSummary = new _graphql.GraphQLObjectType({
  name: 'TripTravellersSummary',
  fields: function fields() {
    return {
      adults: {
        type: _graphql.GraphQLInt,
        resolve: function resolve(_ref) {
          var adults = _ref.adults;
          return adults || 0;
        }
      },
      children: {
        type: _graphql.GraphQLInt,
        resolve: function resolve(_ref2) {
          var children = _ref2.children;
          return children || 0;
        }
      },
      infants: {
        type: _graphql.GraphQLInt,
        resolve: function resolve(_ref3) {
          var infants = _ref3.infants;
          return infants || 0;
        }
      }
    };
  }
});

var ItinerarySummary = new _graphql.GraphQLObjectType({
  name: 'TripItinerarySummary',
  fields: function fields() {
    return {
      country: {
        type: _graphql.GraphQLString
      },
      cities: {
        type: new _graphql.GraphQLList(_graphql.GraphQLString)
      }
    };
  }
});

var TripBudgetUnit = new _graphql.GraphQLObjectType({
  name: 'TripBudgetUnit',
  fields: function fields() {
    return {
      planned: {
        type: _graphql.GraphQLInt,
        resolve: function resolve(_ref4) {
          var planned = _ref4.planned;
          return planned || 0;
        }
      },
      actual: {
        type: _graphql.GraphQLInt,
        resolve: function resolve(_ref5) {
          var actual = _ref5.actual;
          return actual || 0;
        }
      }
    };
  }
});

var TripBudget = new _graphql.GraphQLObjectType({
  name: 'TripBudget',
  fields: function fields() {
    return {
      total: {
        type: TripBudgetUnit,
        resolve: function resolve(_ref6) {
          var total = _ref6.total;
          return total || {};
        }
      },
      hotels: {
        type: TripBudgetUnit,
        resolve: function resolve(_ref7) {
          var hotels = _ref7.hotels;
          return hotels || {};
        }
      },
      tours: {
        type: TripBudgetUnit,
        resolve: function resolve(_ref8) {
          var tours = _ref8.tours;
          return tours || {};
        }
      },
      transfers: {
        type: TripBudgetUnit,
        resolve: function resolve(_ref9) {
          var tours = _ref9.tours;
          return tours || {};
        }
      }
    };
  }
});

var departureCityOrigin = new _graphql.GraphQLObjectType({
  name: 'DepartureCityOrigin',
  fields: function fields() {
    return {
      _key: {
        type: _graphql.GraphQLString
      },
      _id: {
        type: _graphql.GraphQLString
      },
      cityCode: {
        type: _graphql.GraphQLString
      },
      startDate: {
        type: _graphql.GraphQLString
      },
      durationNights: {
        type: _graphql.GraphQLString
      },
      startDay: {
        type: _graphql.GraphQLString
      },
      durationDays: {
        type: _graphql.GraphQLString
      }
    };
  }
});

var departureTransfer = new _graphql.GraphQLObjectType({
  name: 'DepartureTransfer',
  fields: function fields() {
    return {
      _key: {
        type: _graphql.GraphQLString
      },
      _id: {
        type: _graphql.GraphQLString
      },
      type: {
        type: _graphql.GraphQLString
      }
    };
  }
});

var departureTransferPlacement = new _graphql.GraphQLObjectType({
  name: 'DepartureTransferPlacement',
  fields: function fields() {
    return {
      _key: {
        type: _graphql.GraphQLString
      },
      _id: {
        type: _graphql.GraphQLString
      },
      type: {
        type: _graphql.GraphQLString
      },
      departureTransfer: {
        type: new _graphql.GraphQLList(departureTransfer)
      },
      departureCityOrigin: {
        type: departureCityOrigin
      },
      transferPlacement: {
        type: _TransferPlacement2.default,
        resolve: function () {
          var _ref10 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(departureTransferPlacement) {
            return _regenerator2.default.wrap(function _callee$(_context) {
              while (1) {
                switch (_context.prev = _context.next) {
                  case 0:
                    _context.next = 2;
                    return (0, _TransferPlacement3.getTransferPlacement)(departureTransferPlacement._key);

                  case 2:
                    return _context.abrupt('return', _context.sent);

                  case 3:
                  case 'end':
                    return _context.stop();
                }
              }
            }, _callee, undefined);
          }));

          return function resolve(_x) {
            return _ref10.apply(this, arguments);
          };
        }()
      }
    };
  }
});

exports.default = new _graphql.GraphQLObjectType({
  name: 'QueryTripType',
  fields: function fields() {
    return {
      _key: {
        type: _graphql.GraphQLString
      },
      name: {
        type: _graphql.GraphQLString
      },
      status: {
        type: _graphql.GraphQLString
      },
      startDate: {
        type: _graphql.GraphQLString
      },
      endDate: {
        type: _graphql.GraphQLString
      },
      durationDays: {
        type: _graphql.GraphQLInt
      },
      lastBookedDay: {
        type: _graphql.GraphQLInt
      },
      notes: {
        type: _graphql.GraphQLString
      },
      countryOrder: {
        type: new _graphql.GraphQLList(_graphql.GraphQLID),
        resolve: function resolve(res) {
          if (res.countryOrder) return res.countryOrder.map(function (countryId) {
            return (0, _graphqlRelay.toGlobalId)('CountryBooking', countryId);
          });
          return [];
        }
      },
      countryBookings: {
        type: new _graphql.GraphQLList(_CountryBooking2.default),
        description: 'Countries in the trip'
      },
      combinerCountryBooking: {
        type: _CountryBooking2.default,
        resolve: function () {
          var _ref11 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee2(_ref12) {
            var _key = _ref12._key;
            return _regenerator2.default.wrap(function _callee2$(_context2) {
              while (1) {
                switch (_context2.prev = _context2.next) {
                  case 0:
                    _context2.next = 2;
                    return (0, _Trip.getCombinerCountryBooking)(_key);

                  case 2:
                    _context2.t0 = _context2.sent;

                    if (_context2.t0) {
                      _context2.next = 5;
                      break;
                    }

                    _context2.t0 = {};

                  case 5:
                    return _context2.abrupt('return', _context2.t0);

                  case 6:
                  case 'end':
                    return _context2.stop();
                }
              }
            }, _callee2, undefined);
          }));

          return function resolve(_x2) {
            return _ref11.apply(this, arguments);
          };
        }()
      },
      paxs: {
        type: new _graphql.GraphQLList(_Pax2.default),
        resolve: function () {
          var _ref13 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee3(_ref14) {
            var _key = _ref14._key;
            return _regenerator2.default.wrap(function _callee3$(_context3) {
              while (1) {
                switch (_context3.prev = _context3.next) {
                  case 0:
                    _context3.next = 2;
                    return (0, _Trip.getPaxs)(_key);

                  case 2:
                    _context3.t0 = _context3.sent;

                    if (_context3.t0) {
                      _context3.next = 5;
                      break;
                    }

                    _context3.t0 = [];

                  case 5:
                    return _context3.abrupt('return', _context3.t0);

                  case 6:
                  case 'end':
                    return _context3.stop();
                }
              }
            }, _callee3, undefined);
          }));

          return function resolve(_x3) {
            return _ref13.apply(this, arguments);
          };
        }()
      },
      combinerLocation: {
        type: _Location2.default,
        resolve: function () {
          var _ref15 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee4(_ref16) {
            var _key = _ref16._key;
            var locations, location, combinedLocation;
            return _regenerator2.default.wrap(function _callee4$(_context4) {
              while (1) {
                switch (_context4.prev = _context4.next) {
                  case 0:
                    _context4.next = 2;
                    return (0, _Trip.getLocations)(_key);

                  case 2:
                    _context4.t0 = _context4.sent;

                    if (_context4.t0) {
                      _context4.next = 5;
                      break;
                    }

                    _context4.t0 = [];

                  case 5:
                    locations = _context4.t0;
                    location = locations.find(function (l) {
                      return _lodash2.default.get(l, '[0].combiner');
                    });

                    if (!(!location || !location.length)) {
                      _context4.next = 9;
                      break;
                    }

                    return _context4.abrupt('return', {});

                  case 9:
                    combinedLocation = location[0];

                    combinedLocation.name = location.map(function (l) {
                      return l.name;
                    }).join(', ');
                    return _context4.abrupt('return', combinedLocation);

                  case 12:
                  case 'end':
                    return _context4.stop();
                }
              }
            }, _callee4, undefined);
          }));

          return function resolve(_x4) {
            return _ref15.apply(this, arguments);
          };
        }()
      },
      budget: {
        type: TripBudget,
        resolve: function () {
          var _ref17 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee5(_ref18) {
            var _key = _ref18._key;
            return _regenerator2.default.wrap(function _callee5$(_context5) {
              while (1) {
                switch (_context5.prev = _context5.next) {
                  case 0:
                    _context5.next = 2;
                    return (0, _Trip.getTripBudget)(_key);

                  case 2:
                    _context5.t0 = _context5.sent;

                    if (_context5.t0) {
                      _context5.next = 5;
                      break;
                    }

                    _context5.t0 = {};

                  case 5:
                    return _context5.abrupt('return', _context5.t0);

                  case 6:
                  case 'end':
                    return _context5.stop();
                }
              }
            }, _callee5, undefined);
          }));

          return function resolve(_x5) {
            return _ref17.apply(this, arguments);
          };
        }()
      },
      traveller: {
        type: TripTravellersSummary,
        resolve: function () {
          var _ref19 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee6(_ref20) {
            var _key = _ref20._key;
            return _regenerator2.default.wrap(function _callee6$(_context6) {
              while (1) {
                switch (_context6.prev = _context6.next) {
                  case 0:
                    _context6.next = 2;
                    return (0, _Trip.getTripTravellerSummary)(_key);

                  case 2:
                    _context6.t0 = _context6.sent;

                    if (_context6.t0) {
                      _context6.next = 5;
                      break;
                    }

                    _context6.t0 = {};

                  case 5:
                    return _context6.abrupt('return', _context6.t0);

                  case 6:
                  case 'end':
                    return _context6.stop();
                }
              }
            }, _callee6, undefined);
          }));

          return function resolve(_x6) {
            return _ref19.apply(this, arguments);
          };
        }()
      },
      itinerary: {
        type: new _graphql.GraphQLList(ItinerarySummary),
        resolve: function () {
          var _ref21 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee7(trip) {
            return _regenerator2.default.wrap(function _callee7$(_context7) {
              while (1) {
                switch (_context7.prev = _context7.next) {
                  case 0:
                    _context7.next = 2;
                    return (0, _Trip.getItinerarySummary)(trip);

                  case 2:
                    _context7.t0 = _context7.sent;

                    if (_context7.t0) {
                      _context7.next = 5;
                      break;
                    }

                    _context7.t0 = [];

                  case 5:
                    return _context7.abrupt('return', _context7.t0);

                  case 6:
                  case 'end':
                    return _context7.stop();
                }
              }
            }, _callee7, undefined);
          }));

          return function resolve(_x7) {
            return _ref21.apply(this, arguments);
          };
        }()
      },
      departureTransferPlacement: {
        type: departureTransferPlacement,
        description: 'Trip Departure'
      }
    };
  }
});