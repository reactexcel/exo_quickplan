'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getTripBudget = exports.remove = exports.getItinerarySummary = exports.getTripTravellerSummary = exports.getLocations = exports.getPaxs = exports.getCombinerCountryBooking = exports.updateTripPaxEdges = exports.updateTripStartDate = exports.updateTrip = exports.cloneTrip = exports.deleteTrip = exports.removeTourplanTripBookings = exports.addTourplanTripBookings = exports.getTrip = exports.getProposalTrips = exports.addTrip = undefined;

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var addTrip = function () {
  var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(args) {
    var proposalKey, saveDoc, locations, proposalCountry, addCountryRsp, proposalCity, addCityRsp;
    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            proposalKey = args.proposalKey;
            _context.next = 3;
            return (0, _request2.default)('http://localhost:8529/_db/exo-dev/bbt/trips', _request.POST, args);

          case 3:
            saveDoc = _context.sent;
            _context.prev = 4;
            _context.next = 7;
            return (0, _Proposal.getLocation)(proposalKey);

          case 7:
            _context.t0 = _context.sent;

            if (_context.t0) {
              _context.next = 10;
              break;
            }

            _context.t0 = [];

          case 10:
            locations = _context.t0[0];

            if (!(locations && locations.length)) {
              _context.next = 23;
              break;
            }

            // auto add the first country for the trip
            proposalCountry = locations.find(function (location) {
              return location.type === 'country';
            });
            addCountryRsp = null;

            if (!proposalCountry) {
              _context.next = 18;
              break;
            }

            _context.next = 17;
            return (0, _CountryBooking.addCountryBooking)({
              tripKey: saveDoc._key,
              order: 'before',
              addedIndex: 0,
              countryCode: proposalCountry.name
            });

          case 17:
            addCountryRsp = _context.sent;

          case 18:

            // auto add the first city for the first countryBooking
            proposalCity = locations.find(function (location) {
              return location.type === 'city';
            });

            if (!(proposalCity && addCountryRsp && addCountryRsp._key)) {
              _context.next = 23;
              break;
            }

            _context.next = 22;
            return (0, _CityBooking.addCityBooking)({
              cityCode: proposalCity.name,
              cityIndex: 0,
              countryBookingKey: addCountryRsp._key
            });

          case 22:
            addCityRsp = _context.sent;

          case 23:
            _context.next = 28;
            break;

          case 25:
            _context.prev = 25;
            _context.t1 = _context['catch'](4);

            console.log('add default country and city for trip failed', _context.t1);

          case 28:
            return _context.abrupt('return', saveDoc);

          case 29:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this, [[4, 25]]);
  }));

  return function addTrip(_x) {
    return _ref.apply(this, arguments);
  };
}();

var updateTripStartDate = function () {
  var _ref2 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee2(_ref3) {
    var _key = _ref3._key,
        startDate = _ref3.startDate,
        endDate = _ref3.endDate;
    var aqlQuery, result;
    return _regenerator2.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            aqlQuery = '\n    FOR t IN trips\n      FILTER t._id == @tripId\n      UPDATE t WITH { startDate: @startDate, endDate: @endDate} IN trips\n      RETURN NEW\n  ';
            _context2.next = 3;
            return _database.db.query(aqlQuery, {
              tripId: 'trips/' + _key,
              startDate: startDate,
              endDate: endDate
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

  return function updateTripStartDate(_x2) {
    return _ref2.apply(this, arguments);
  };
}();

var updateTrip = function () {
  var _ref4 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee3(args) {
    var tripKey, doc;
    return _regenerator2.default.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            tripKey = args._key;
            _context3.next = 3;
            return tripsCollection.updateByExample({ _key: tripKey }, args);

          case 3:
            _context3.next = 5;
            return tripsCollection.firstExample({ _key: tripKey });

          case 5:
            doc = _context3.sent;
            return _context3.abrupt('return', doc);

          case 7:
          case 'end':
            return _context3.stop();
        }
      }
    }, _callee3, this);
  }));

  return function updateTrip(_x3) {
    return _ref4.apply(this, arguments);
  };
}();

var getTripTravellerSummary = function () {
  var _ref5 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee4(tripKey) {
    var edges, paxs, ret;
    return _regenerator2.default.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            _context4.next = 2;
            return participateEdgeCollection.outEdges('trips/' + tripKey);

          case 2:
            edges = _context4.sent;
            _context4.next = 5;
            return paxsCollection.lookupByKeys(edges.map(function (edge) {
              return edge._to;
            }));

          case 5:
            paxs = _context4.sent;
            ret = { adults: 0, children: 0, infants: 0 };

            paxs.map(function (pax) {
              return ret[pax.ageGroup]++;
            });
            return _context4.abrupt('return', ret);

          case 9:
          case 'end':
            return _context4.stop();
        }
      }
    }, _callee4, this);
  }));

  return function getTripTravellerSummary(_x4) {
    return _ref5.apply(this, arguments);
  };
}();

var getItinerarySummary = function () {
  var _ref6 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee6(trip) {
    var _this = this;

    var countryOrder, countries;
    return _regenerator2.default.wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            countryOrder = trip.countryOrder || [];
            _context6.next = 3;
            return countryBookingsCollection.lookupByKeys(countryOrder.map(function (key) {
              return 'countryBookings/' + key;
            }));

          case 3:
            countries = _context6.sent;
            _context6.next = 6;
            return _promise2.default.all(countries.map(function () {
              var _ref7 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee5(country) {
                var cityOrder, cities;
                return _regenerator2.default.wrap(function _callee5$(_context5) {
                  while (1) {
                    switch (_context5.prev = _context5.next) {
                      case 0:
                        cityOrder = country.cityOrder || [];
                        _context5.next = 3;
                        return cityBookingsCollection.lookupByKeys(cityOrder.map(function (key) {
                          return 'cityBookings/' + key;
                        }));

                      case 3:
                        cities = _context5.sent;
                        return _context5.abrupt('return', { country: country.countryCode, cities: cities.map(function (city) {
                            return city.cityCode;
                          }) });

                      case 5:
                      case 'end':
                        return _context5.stop();
                    }
                  }
                }, _callee5, _this);
              }));

              return function (_x6) {
                return _ref7.apply(this, arguments);
              };
            }()));

          case 6:
            return _context6.abrupt('return', _context6.sent);

          case 7:
          case 'end':
            return _context6.stop();
        }
      }
    }, _callee6, this);
  }));

  return function getItinerarySummary(_x5) {
    return _ref6.apply(this, arguments);
  };
}();

/* async function getTripsByProposalKey({ proposalKey }) {
  try {
    const edges = await bookInEdgeCollection.outEdges(`proposals/${proposalKey}`);
    const trips = await tripsCollection.lookupByKeys(edges.map(edge => edge._to));
    await Promise.all(trips.map(async (trip) => {
      trip.traveller = await getTripTravellerSummary(trip._key); // eslint-disable-line no-param-reassign
      trip.itinerary = await getItinerarySummary(trip); // eslint-disable-line no-param-reassign
    }));
    return trips;
  } catch (e) {
    console.log('[Trip Controllers] get Trips By Proposal Key error,', e);
    return {};
  }
}*/

var deleteTrip = function () {
  var _ref8 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee7(_ref9) {
    var tripKey = _ref9.tripKey;
    var proposalBookInTripsEdges, tripsBookInCountryBookingsEdges, tripsParticipatePaxsEdges, tripsLocatedInEdges;
    return _regenerator2.default.wrap(function _callee7$(_context7) {
      while (1) {
        switch (_context7.prev = _context7.next) {
          case 0:
            _context7.prev = 0;
            _context7.next = 3;
            return tripsCollection.remove({ _key: tripKey });

          case 3:
            _context7.next = 5;
            return bookInEdgeCollection.inEdges('trips/' + tripKey);

          case 5:
            proposalBookInTripsEdges = _context7.sent;
            _context7.next = 8;
            return bookInEdgeCollection.removeByKeys(proposalBookInTripsEdges.map(function (edge) {
              return edge._id;
            }));

          case 8:
            _context7.next = 10;
            return bookInEdgeCollection.outEdges('trips/' + tripKey);

          case 10:
            tripsBookInCountryBookingsEdges = _context7.sent;
            _context7.next = 13;
            return bookInEdgeCollection.removeByKeys(tripsBookInCountryBookingsEdges.map(function (edge) {
              return edge._id;
            }));

          case 13:
            _context7.next = 15;
            return participateEdgeCollection.outEdges('trips/' + tripKey);

          case 15:
            tripsParticipatePaxsEdges = _context7.sent;
            _context7.next = 18;
            return participateEdgeCollection.removeByKeys(tripsParticipatePaxsEdges.map(function (edge) {
              return edge._id;
            }));

          case 18:
            _context7.next = 20;
            return locatedInEdgeCollection.outEdges('trips/' + tripKey);

          case 20:
            tripsLocatedInEdges = _context7.sent;
            _context7.next = 23;
            return locatedInEdgeCollection.removeByKeys(tripsLocatedInEdges.map(function (edge) {
              return edge._id;
            }));

          case 23:
            return _context7.abrupt('return', { tripKey: tripKey });

          case 26:
            _context7.prev = 26;
            _context7.t0 = _context7['catch'](0);

            console.log('[Trip Controllers] delete trip error,', _context7.t0);
            return _context7.abrupt('return', {});

          case 30:
          case 'end':
            return _context7.stop();
        }
      }
    }, _callee7, this, [[0, 26]]);
  }));

  return function deleteTrip(_x7) {
    return _ref8.apply(this, arguments);
  };
}();

// Clone trip clone and existing trip in the proposal into a new one.


var cloneTrip = function () {
  var _ref10 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee8(_ref11) {
    var tripKey = _ref11.tripKey;
    var newTrip, proposalBookInTripsEdges, newEdges;
    return _regenerator2.default.wrap(function _callee8$(_context8) {
      while (1) {
        switch (_context8.prev = _context8.next) {
          case 0:
            _context8.prev = 0;
            _context8.next = 3;
            return (0, _TripClone2.default)('trips/' + tripKey);

          case 3:
            newTrip = _context8.sent;
            _context8.next = 6;
            return bookInEdgeCollection.inEdges('trips/' + tripKey);

          case 6:
            proposalBookInTripsEdges = _context8.sent;
            newEdges = proposalBookInTripsEdges.map(function (edge) {
              return { _from: edge._from, _to: newTrip._id };
            });
            _context8.next = 10;
            return bookInEdgeCollection.import(newEdges);

          case 10:
            return _context8.abrupt('return', newTrip);

          case 13:
            _context8.prev = 13;
            _context8.t0 = _context8['catch'](0);

            // Add Transaction
            console.log('[Trip Controllers] clone trip error,', _context8.t0);
            return _context8.abrupt('return', {});

          case 17:
          case 'end':
            return _context8.stop();
        }
      }
    }, _callee8, this, [[0, 13]]);
  }));

  return function cloneTrip(_x8) {
    return _ref10.apply(this, arguments);
  };
}();

var getPaxs = function () {
  var _ref13 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee9(tripKey) {
    var aqlQuery, result;
    return _regenerator2.default.wrap(function _callee9$(_context9) {
      while (1) {
        switch (_context9.prev = _context9.next) {
          case 0:
            aqlQuery = '\n    FOR vertex\n      IN 1..1 OUTBOUND @tripId GRAPH \'exo-dev\'\n      FILTER\n        IS_SAME_COLLECTION(\'paxs\', vertex)\n      RETURN vertex\n  ';
            _context9.next = 3;
            return _database.db.query(aqlQuery, {
              tripId: 'trips/' + tripKey
            });

          case 3:
            result = _context9.sent;
            return _context9.abrupt('return', result.all());

          case 5:
          case 'end':
            return _context9.stop();
        }
      }
    }, _callee9, this);
  }));

  return function getPaxs(_x9) {
    return _ref13.apply(this, arguments);
  };
}();

var updateTripPaxEdges = function () {
  var _ref14 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee10(_ref15) {
    var tripKey = _ref15.tripKey,
        tripPaxKeys = _ref15.tripPaxKeys;
    return _regenerator2.default.wrap(function _callee10$(_context10) {
      while (1) {
        switch (_context10.prev = _context10.next) {
          case 0:
            _context10.next = 2;
            return removeTripPaxEdges(tripKey);

          case 2:
            _context10.next = 4;
            return _promise2.default.all(tripPaxKeys.map(function (paxKey) {
              return insertTripPaxEdge({ tripKey: tripKey, paxKey: paxKey });
            }));

          case 4:
            return _context10.abrupt('return', getPaxs(tripKey));

          case 5:
          case 'end':
            return _context10.stop();
        }
      }
    }, _callee10, this);
  }));

  return function updateTripPaxEdges(_x10) {
    return _ref14.apply(this, arguments);
  };
}();

var getCombinerCountryBooking = function () {
  var _ref16 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee11(tripKey) {
    var aqlQuery, result;
    return _regenerator2.default.wrap(function _callee11$(_context11) {
      while (1) {
        switch (_context11.prev = _context11.next) {
          case 0:
            aqlQuery = '\n    FOR countryBooking, edge\n    IN 1..1 OUTBOUND @tripId GRAPH \'exo-dev\'\n    FILTER\n        IS_SAME_COLLECTION(\'countryBookings\', countryBooking) AND\n        edge.combiner == true\n    RETURN countryBooking\n  ';
            _context11.next = 3;
            return _database.db.query(aqlQuery, {
              tripId: 'trips/' + tripKey
            });

          case 3:
            result = _context11.sent;
            return _context11.abrupt('return', result.next());

          case 5:
          case 'end':
            return _context11.stop();
        }
      }
    }, _callee11, this);
  }));

  return function getCombinerCountryBooking(_x11) {
    return _ref16.apply(this, arguments);
  };
}();

var getLocations = function () {
  var _ref17 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee12(tripKey) {
    var aqlQuery, result;
    return _regenerator2.default.wrap(function _callee12$(_context12) {
      while (1) {
        switch (_context12.prev = _context12.next) {
          case 0:
            aqlQuery = '\n    RETURN UNIQUE(\n      FOR vertex, edge, path\n        IN 1..2 OUTBOUND @tripId\n        GRAPH \'exo-dev\'\n        FILTER\n            NOT IS_NULL(vertex) AND\n            IS_SAME_COLLECTION(\'locations\', vertex) AND\n            ((\n              LENGTH (path.vertices) == 3 AND\n              path.vertices[2].type == \'country\'\n            ) OR (\n               LENGTH (path.vertices) == 2 AND\n              path.vertices[1].type == \'country\'\n            ))\n        LET firstWithEdge = [MERGE(path.vertices[1], path.edges[0])]\n        RETURN UNION(firstWithEdge, SLICE(path.vertices, 2))\n    )\n  ';
            _context12.next = 3;
            return _database.db.query(aqlQuery, {
              tripId: 'trips/' + tripKey
            });

          case 3:
            result = _context12.sent;
            return _context12.abrupt('return', result.next());

          case 5:
          case 'end':
            return _context12.stop();
        }
      }
    }, _callee12, this);
  }));

  return function getLocations(_x12) {
    return _ref17.apply(this, arguments);
  };
}();

var getTripBudgetByType = function () {
  var _ref22 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee14(tripId, placementType) {
    var aqlQuery, result;
    return _regenerator2.default.wrap(function _callee14$(_context14) {
      while (1) {
        switch (_context14.prev = _context14.next) {
          case 0:
            aqlQuery = '\n    let prices = (FOR vertex, edge in 4..4 OUTBOUND @tripId GRAPH \'exo-dev\'\n    filter IS_SAME_COLLECTION(\'serviceBookings\', vertex)\n    and IS_SAME_COLLECTION(\'bookIn\', edge)\n    and IS_SAME_COLLECTION(@placementType, edge._from)\n    and vertex.price != null\n    and vertex.price.amount != null\n    return vertex.price.amount)\n    return SUM(prices)\n  ';
            _context14.next = 3;
            return _database.db.query(aqlQuery, {
              tripId: tripId,
              placementType: placementType
            });

          case 3:
            result = _context14.sent;
            return _context14.abrupt('return', result.next());

          case 5:
          case 'end':
            return _context14.stop();
        }
      }
    }, _callee14, this);
  }));

  return function getTripBudgetByType(_x14, _x15) {
    return _ref22.apply(this, arguments);
  };
}();

var getTripBudget = function () {
  var _ref23 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee15(tripKey) {
    var tripId, budgets;
    return _regenerator2.default.wrap(function _callee15$(_context15) {
      while (1) {
        switch (_context15.prev = _context15.next) {
          case 0:
            tripId = 'trips/' + tripKey;
            budgets = {
              hotels: { planned: 0, actual: 0 },
              tours: { planned: 0, actual: 0 },
              transfers: { planned: 0, actual: 0 },
              total: { planned: 0, actual: 0 }
            };
            _context15.next = 4;
            return getTripBudgetByType(tripId, 'accommodationPlacements');

          case 4:
            budgets.hotels.actual = _context15.sent;
            _context15.next = 7;
            return getTripBudgetByType(tripId, 'cityDays');

          case 7:
            budgets.tours.actual = _context15.sent;
            _context15.next = 10;
            return getTripBudgetByType(tripId, 'transferPlacements');

          case 10:
            budgets.transfers.actual = _context15.sent;

            budgets.total.actual = budgets.hotels.actual + budgets.tours.actual + budgets.transfers.actual;
            return _context15.abrupt('return', budgets);

          case 13:
          case 'end':
            return _context15.stop();
        }
      }
    }, _callee15, this);
  }));

  return function getTripBudget(_x16) {
    return _ref23.apply(this, arguments);
  };
}();

var _request = require('../../../utils/request');

var _request2 = _interopRequireDefault(_request);

var _database = require('../../database');

var _TripClone = require('./TripClone');

var _TripClone2 = _interopRequireDefault(_TripClone);

var _Activity = require('../../Activity/controllers/Activity');

var _Pax = require('../../Pax/controllers/Pax');

var _environment = require('../../../config/environment');

var _environment2 = _interopRequireDefault(_environment);

var _TransferPlacement = require('../../TransferPlacement/controllers/TransferPlacement');

var _CountryBooking = require('../../CountryBooking/controllers/CountryBooking');

var _Proposal = require('../../Proposal/controllers/Proposal');

var _CityBooking = require('../../CityBooking/controllers/CityBooking');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var graph = _database.db.graph(_environment2.default.arango.databaseName);
var trips = graph.vertexCollection('trips');

var tripsCollection = _database.db.collection('trips');
var paxsCollection = _database.db.collection('paxs');
var countryBookingsCollection = _database.db.collection('countryBookings');
var cityBookingsCollection = _database.db.collection('cityBookings');

var bookInEdgeCollection = _database.db.edgeCollection('bookIn');
var participateEdgeCollection = _database.db.edgeCollection('participate');
var locatedInEdgeCollection = _database.db.edgeCollection('locatedIn');

function getProposalTrips(args) {
  return (0, _request2.default)('http://localhost:8529/_db/exo-dev/bbt/trips/trips-from-proposal', _request.POST, args);
}

function getTrip(args) {
  return (0, _request2.default)('http://localhost:8529/_db/exo-dev/bbt/trips/trip-by-tripKey', _request.POST, args);
}

function addTourplanTripBookings(args) {
  return (0, _request2.default)('http://localhost:8529/_db/exo-dev/bbt/trips/create-tourplan-bookings-from-tripKey', _request.POST, args);
}

function removeTourplanTripBookings(args) {
  return (0, _request2.default)('http://localhost:8529/_db/exo-dev/bbt/trips/remove-tourplan-bookings-from-tripKey', _request.POST, args);
}

var removeTripPaxEdges = function removeTripPaxEdges(tripKey) {
  var aqlQuery = '\n   FOR p IN participate\n    FILTER\n        p._from == @tripId\n    REMOVE { _key: p._key } IN participate\n  ';

  return _database.db.query(aqlQuery, {
    tripId: 'trips/' + tripKey
  });
};

var insertTripPaxEdge = function insertTripPaxEdge(_ref12) {
  var tripKey = _ref12.tripKey,
      paxKey = _ref12.paxKey;

  var aqlQuery = '\n      INSERT {\n        _from: @tripId,\n        _to: @paxId\n      } IN participate\n    ';

  return _database.db.query(aqlQuery, {
    tripId: 'trips/' + tripKey,
    paxId: 'paxs/' + paxKey
  });
};

var remove = function () {
  var _ref18 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee13(tripKey) {
    var activities, transferPlacements, countryBookings;
    return _regenerator2.default.wrap(function _callee13$(_context13) {
      while (1) {
        switch (_context13.prev = _context13.next) {
          case 0:
            _context13.next = 2;
            return (0, _Activity.getActivities)('trips/' + tripKey);

          case 2:
            activities = _context13.sent;
            _context13.next = 5;
            return _promise2.default.all(activities.map(function (_ref19) {
              var _key = _ref19._key;
              return (0, _Activity.remove)(_key);
            }));

          case 5:
            _context13.next = 7;
            return (0, _TransferPlacement.getTransferPlacements)('trips/' + tripKey);

          case 7:
            transferPlacements = _context13.sent;
            _context13.next = 10;
            return _promise2.default.all(transferPlacements.map(function (_ref20) {
              var _key = _ref20._key;
              return (0, _TransferPlacement.remove)(_key);
            }));

          case 10:
            _context13.next = 12;
            return (0, _CountryBooking.getCountryBookings)('trips/' + tripKey);

          case 12:
            countryBookings = _context13.sent;
            _context13.next = 15;
            return _promise2.default.all(countryBookings.map(function (_ref21) {
              var _key = _ref21._key;
              return (0, _CountryBooking.remove)(_key);
            }));

          case 15:

            // remove trip inbound edges (bookIn) and trip itself
            trips.remove(tripKey);

          case 16:
          case 'end':
            return _context13.stop();
        }
      }
    }, _callee13, undefined);
  }));

  return function remove(_x13) {
    return _ref18.apply(this, arguments);
  };
}();

exports.addTrip = addTrip;
exports.getProposalTrips = getProposalTrips;
exports.getTrip = getTrip;
exports.addTourplanTripBookings = addTourplanTripBookings;
exports.removeTourplanTripBookings = removeTourplanTripBookings;
exports.deleteTrip = deleteTrip;
exports.cloneTrip = cloneTrip;
exports.updateTrip = updateTrip;
exports.updateTripStartDate = updateTripStartDate;
exports.updateTripPaxEdges = updateTripPaxEdges;
exports.getCombinerCountryBooking = getCombinerCountryBooking;
exports.getPaxs = getPaxs;
exports.getLocations = getLocations;
exports.getTripTravellerSummary = getTripTravellerSummary;
exports.getItinerarySummary = getItinerarySummary;
exports.remove = remove;
exports.getTripBudget = getTripBudget;