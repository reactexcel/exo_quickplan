'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

// clone Trip document and clone trip--BookIn-->countryBooking edges
var cloneTrip = function () {
  var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(tripId) {
    var oldTrip, newCountryBookings, countryOrder, newTrip, handle, edges;
    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return queryTripAll(tripId);

          case 2:
            oldTrip = _context.sent;
            _context.next = 5;
            return cloneCountryBookings(oldTrip.countryBookings);

          case 5:
            newCountryBookings = _context.sent;


            cleanDoc(oldTrip, ['countryBookings']);
            countryOrder = newCountryBookings.map(function (countryBooking) {
              return countryBooking._key;
            });
            newTrip = (0, _assign2.default)({}, oldTrip, {
              countryOrder: countryOrder, // new countryOrder
              status: 'Draft',
              // createdOn: newDate(),
              updatedOn: newDate()
            });
            _context.next = 11;
            return tripsCollection.save(newTrip);

          case 11:
            handle = _context.sent;


            // import new trip--BookIn-->countryBooking edges
            edges = newCountryBookings.map(function (countryBooking) {
              return { _from: handle._id, _to: countryBooking._id };
            });
            _context.next = 15;
            return bookInEdgeCollection.import(edges);

          case 15:
            return _context.abrupt('return', handle);

          case 16:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this);
  }));

  return function cloneTrip(_x) {
    return _ref.apply(this, arguments);
  };
}();

// query all trips and related edges in one query for Optimization.


var queryTripAll = function () {
  var _ref2 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee2(tripId) {
    var aqlQuery, result;
    return _regenerator2.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            aqlQuery = '\n  LET trip = DOCUMENT(@tripId)\n  LET tripCountryOrder = NOT_NULL(trip.countryOrder) ? trip.countryOrder : []\n  LET countryBookings = (\n    FOR countryBookingKey IN tripCountryOrder\n      LET countryBookingId = CONCAT(\'countryBookings/\', countryBookingKey)\n      LET countryBooking = DOCUMENT(countryBookingId)\n      LET countryBookingCityOrder = NOT_NULL(countryBooking.cityOrder) ? countryBooking.cityOrder : []\n      RETURN MERGE(countryBooking, {\n        locatedInIds: (FOR vertex, edge IN OUTBOUND countryBookingId locatedIn RETURN edge._to)\n      }, {cityBookings: (\n        FOR cityBookingKey IN countryBookingCityOrder\n          LET cityBookingId = CONCAT(\'cityBookings/\', cityBookingKey)\n          LET cityBooking = DOCUMENT(cityBookingId)\n          LET cityBookingEdges = (FOR vertex, edge IN OUTBOUND cityBookingId bookIn RETURN edge)\n          LET theAccommodationPlacements = (\n              FOR cityBookingEdge IN cityBookingEdges\n                FOR accommodationPlacement IN accommodationPlacements\n                  FILTER accommodationPlacement._id == cityBookingEdge._to\n                LET supplyEdges = (FOR vertex, edge IN OUTBOUND accommodationPlacement._id use RETURN edge)\n                LET accommodationsEdges = (FOR vertex, edge IN OUTBOUND accommodationPlacement._id preselect RETURN edge)\n                RETURN MERGE(accommodationPlacement,\n                    {supplier: FIRST(\n                        FOR supplyEdge IN supplyEdges\n                      FOR supplier IN suppliers\n                        FILTER supplyEdge._to == supplier._id\n                        RETURN supplier._id)},\n                    {accommodations: (\n                        FOR accommodationsEdge in accommodationsEdges\n                            FOR accommodation in accommodations\n                            FILTER accommodationsEdge._to == accommodation._id\n                            RETURN accommodation._id)},\n                      { serviceBookings: (\n                    LET serviceBookingEdges = (FOR vertex, edge IN OUTBOUND cityBookingEdge._to bookIn RETURN edge)\n                    FOR serviceBookingEdge IN serviceBookingEdges\n                    FOR serviceBooking IN serviceBookings\n                      FILTER serviceBooking._id == serviceBookingEdge._to\n                      RETURN MERGE(serviceBooking,\n                          { useEdgesIds: (\n                            LET useEdges = (FOR vertex, edge IN OUTBOUND serviceBooking._id use RETURN edge)\n                            FOR edge IN useEdges\n                              RETURN edge._to)},\n                         { bookInEdgesIds: (\n                            LET bookInEdges = (FOR vertex, edge IN OUTBOUND serviceBooking._id bookIn RETURN edge)\n                            FOR edge IN bookInEdges\n                              RETURN edge._to\n                              )})\n                    )}\n                )\n            )\n          LET cityBookingDayOrder = NOT_NULL(cityBooking.dayOrder) ? cityBooking.dayOrder : []\n          LET theCityDays = (\n            FOR cityDayKey IN cityBookingDayOrder\n              LET cityDayId = CONCAT(\'cityDays/\', cityDayKey)\n              LET cityDay = DOCUMENT(cityDayId)\n              RETURN MERGE(cityDay,\n                { serviceBookings: (\n                  LET serviceBookingIds = (FOR vertex, edge IN OUTBOUND cityDay._id bookIn RETURN edge)\n                  FOR serviceBookingId IN serviceBookingIds\n                    FOR serviceBooking IN serviceBookings\n                      FILTER serviceBooking._id == serviceBookingId._to\n                      RETURN MERGE(serviceBooking,\n                          { useEdgesIds: (\n                            LET useEdges = (FOR vertex, edge IN OUTBOUND serviceBooking._id use RETURN edge)\n                            FOR edge IN useEdges\n                              RETURN edge._to)},\n                         { bookInEdgesIds: (\n                            LET bookInEdges = (FOR vertex, edge IN OUTBOUND serviceBooking._id bookIn RETURN edge)\n                            FOR edge IN bookInEdges\n                              RETURN edge._to\n                              )})\n                )},\n                { tours: (\n                    LET toursEdges = ( FOR vertx, edge in OUTBOUND cityDayId preselect RETURN edge )\n                    FOR toursEdge in toursEdges\n                        return toursEdge._to)\n                })\n          )\n          RETURN MERGE(cityBooking, {locatedInIds: (FOR vertex, edge IN OUTBOUND cityBookingId locatedIn RETURN edge._to)},\n              {accommodationPlacements: theAccommodationPlacements, cityDays: theCityDays})\n        )})\n      )\n      RETURN MERGE(trip, {countryBookings: countryBookings})\n  ';
            _context2.next = 3;
            return _database.db.query(aqlQuery, {
              tripId: tripId
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

  return function queryTripAll(_x2) {
    return _ref2.apply(this, arguments);
  };
}();

// clone the all countryBookings concurrently, return a new ordered countryBookings
// and clone the TransferPlacements between new cityBookings.


var cloneCountryBookings = function () {
  var _ref3 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee4(oldcountryBookings) {
    var _this = this;

    var countryBookings, newCountryBookings, allCityBookingsInOrder;
    return _regenerator2.default.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            _context4.next = 2;
            return _promise2.default.all(oldcountryBookings.map(function () {
              var _ref4 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee3(oldCountryBooking, idx) {
                var newCountryBooking;
                return _regenerator2.default.wrap(function _callee3$(_context3) {
                  while (1) {
                    switch (_context3.prev = _context3.next) {
                      case 0:
                        _context3.next = 2;
                        return cloneCountryBooking(oldCountryBooking);

                      case 2:
                        newCountryBooking = _context3.sent;
                        return _context3.abrupt('return', { order: idx, newCountryBooking: newCountryBooking });

                      case 4:
                      case 'end':
                        return _context3.stop();
                    }
                  }
                }, _callee3, _this);
              }));

              return function (_x4, _x5) {
                return _ref4.apply(this, arguments);
              };
            }()));

          case 2:
            countryBookings = _context4.sent;

            // ordered countryBookings
            newCountryBookings = countryBookings.sort(function (a, b) {
              return a.order - b.order;
            }).map(function (item) {
              return item.newCountryBooking;
            });

            // all cityBookings in all the countryBookings in Order, clone all transfers between the cities

            allCityBookingsInOrder = [];

            newCountryBookings.map(function (countryBooking) {
              allCityBookingsInOrder = allCityBookingsInOrder.concat(countryBooking.newCityBookings);return allCityBookingsInOrder;
            });

            if (!(allCityBookingsInOrder.length > 0)) {
              _context4.next = 9;
              break;
            }

            _context4.next = 9;
            return cloneTransferPlacements(allCityBookingsInOrder);

          case 9:
            return _context4.abrupt('return', newCountryBookings);

          case 10:
          case 'end':
            return _context4.stop();
        }
      }
    }, _callee4, this);
  }));

  return function cloneCountryBookings(_x3) {
    return _ref3.apply(this, arguments);
  };
}();

// Clone Country Booking document and output edges.
// Edge 1. countryBooking--BookIn-->cityBooking edges
// Edge 2. countryBooking--locatedIn-->locations


var cloneCountryBooking = function () {
  var _ref5 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee5(oldCountryBooking) {
    var newCityBookings, locatedInIds, cityOrder, newCountryBooking, handle, edges, locatedInEdges;
    return _regenerator2.default.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            _context5.next = 2;
            return cloneCityBookings(oldCountryBooking.cityBookings);

          case 2:
            newCityBookings = _context5.sent;
            locatedInIds = oldCountryBooking.locatedInIds;

            // clear the injected edges field 'cityBookings' and locatedInIds
            // clear: qpBookingId, tpBookingId, tpBookingRef.

            cleanDoc(oldCountryBooking, ['qpBookingId', 'tpBookingId', 'tpBookingRef', 'cityBookings', 'locatedInIds']);
            cityOrder = newCityBookings.map(function (cityBooking) {
              return cityBooking._key;
            });
            newCountryBooking = (0, _assign2.default)({}, oldCountryBooking, {
              cityOrder: cityOrder, // new cityOrder
              updatedOn: newDate()
            });
            _context5.next = 9;
            return countryBookingsCollection.save(newCountryBooking);

          case 9:
            handle = _context5.sent;


            // import new countryBooking--BookIn-->cityBooking edges
            edges = newCityBookings.map(function (cityBooking) {
              return { _from: handle._id, _to: cityBooking._id };
            });
            _context5.next = 13;
            return bookInEdgeCollection.import(edges);

          case 13:

            // import new countryBooking--locatedIn-->locations edges.
            locatedInEdges = locatedInIds.map(function (locationId) {
              return { _from: handle._id, _to: locationId };
            });
            _context5.next = 16;
            return locatedInEdgeCollection.import(locatedInEdges);

          case 16:
            return _context5.abrupt('return', (0, _extends3.default)({}, handle, { newCityBookings: newCityBookings }));

          case 17:
          case 'end':
            return _context5.stop();
        }
      }
    }, _callee5, this);
  }));

  return function cloneCountryBooking(_x6) {
    return _ref5.apply(this, arguments);
  };
}();

// clone the all cityBookings concurrently, return a new ordered cityBookings


var cloneCityBookings = function () {
  var _ref6 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee7(oldCityBookings) {
    var _this2 = this;

    var newCityBookings;
    return _regenerator2.default.wrap(function _callee7$(_context7) {
      while (1) {
        switch (_context7.prev = _context7.next) {
          case 0:
            _context7.next = 2;
            return _promise2.default.all(oldCityBookings.map(function () {
              var _ref7 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee6(oldCityBooking, idx) {
                var newCityBooking;
                return _regenerator2.default.wrap(function _callee6$(_context6) {
                  while (1) {
                    switch (_context6.prev = _context6.next) {
                      case 0:
                        _context6.next = 2;
                        return cloneCityBooking(oldCityBooking);

                      case 2:
                        newCityBooking = _context6.sent;
                        return _context6.abrupt('return', { order: idx, newCityBooking: newCityBooking });

                      case 4:
                      case 'end':
                        return _context6.stop();
                    }
                  }
                }, _callee6, _this2);
              }));

              return function (_x8, _x9) {
                return _ref7.apply(this, arguments);
              };
            }()));

          case 2:
            newCityBookings = _context7.sent;
            return _context7.abrupt('return', newCityBookings.sort(function (a, b) {
              return a.order - b.order;
            }).map(function (item) {
              return item.newCityBooking;
            }));

          case 4:
          case 'end':
            return _context7.stop();
        }
      }
    }, _callee7, this);
  }));

  return function cloneCityBookings(_x7) {
    return _ref6.apply(this, arguments);
  };
}();

// clone CityBooking document, and the output edges.
// Edge 1: cityBooking --bookin--> cityDay
// Edge 2: cityBooking --bookin--> accommodationPlacement
// Edge 3: cityBooking --locatedIn--> locations


var cloneCityBooking = function () {
  var _ref8 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee8(oldCityBooking) {
    var locatedInIds, oldCityBookingId, oldCityDays, oldAccommodationPlacements, newOutputVertices, newDayOrder, newCityBookingToSave, handle, bookInEdges, locatedInEdges;
    return _regenerator2.default.wrap(function _callee8$(_context8) {
      while (1) {
        switch (_context8.prev = _context8.next) {
          case 0:
            // clone all the output Vertices of this cityBooking
            locatedInIds = oldCityBooking.locatedInIds;
            oldCityBookingId = oldCityBooking._id;
            oldCityDays = oldCityBooking.cityDays;
            oldAccommodationPlacements = oldCityBooking.accommodationPlacements;
            newOutputVertices = { cityDays: [], accommodationPlacements: [] };
            _context8.next = 7;
            return _promise2.default.all([cloneCityDays(oldCityDays, newOutputVertices), cloneAccommodationPlacements(oldAccommodationPlacements, newOutputVertices)]);

          case 7:

            // Clear the injected edges fields
            cleanDoc(oldCityBooking, ['cityDays', 'accommodationPlacements', 'locatedInIds']);
            newDayOrder = newOutputVertices.cityDays.map(function (cityDay) {
              return cityDay._key;
            }); // new dayOrder

            newCityBookingToSave = (0, _assign2.default)({}, oldCityBooking, { dayOrder: newDayOrder });
            _context8.next = 12;
            return cityBookingsCollection.save(newCityBookingToSave);

          case 12:
            handle = _context8.sent;


            // bookin edges
            bookInEdges = [];
            // Edge 1: cityBooking --bookin--> cityDay

            newOutputVertices.cityDays.map(function (cityDay) {
              return bookInEdges.push({ _from: handle._id, _to: cityDay._id });
            });
            // Edge 2: cityBooking --bookin--> accommodationPlacement
            newOutputVertices.accommodationPlacements.map(function (cityDay) {
              return bookInEdges.push({ _from: handle._id, _to: cityDay._id });
            });

            if (!(bookInEdges && bookInEdges.length)) {
              _context8.next = 19;
              break;
            }

            _context8.next = 19;
            return bookInEdgeCollection.import(bookInEdges);

          case 19:

            // Edge 3: cityBooking --locatedIn--> locations
            locatedInEdges = locatedInIds.map(function (locationId) {
              return { _from: handle._id, _to: locationId };
            });
            _context8.next = 22;
            return locatedInEdgeCollection.import(locatedInEdges);

          case 22:
            return _context8.abrupt('return', (0, _extends3.default)({}, handle, { oldCityBookingId: oldCityBookingId }));

          case 23:
          case 'end':
            return _context8.stop();
        }
      }
    }, _callee8, this);
  }));

  return function cloneCityBooking(_x10) {
    return _ref8.apply(this, arguments);
  };
}();

// clone all city days following the old order concurrently, set the result to
// newOutputVertices.cityDays


var cloneCityDays = function () {
  var _ref9 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee10(oldCityDays, newOutputVertices) {
    var _this3 = this;

    var newCityDays;
    return _regenerator2.default.wrap(function _callee10$(_context10) {
      while (1) {
        switch (_context10.prev = _context10.next) {
          case 0:
            _context10.next = 2;
            return _promise2.default.all(oldCityDays.map(function () {
              var _ref10 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee9(oldCityDay, idx) {
                var newCityDay;
                return _regenerator2.default.wrap(function _callee9$(_context9) {
                  while (1) {
                    switch (_context9.prev = _context9.next) {
                      case 0:
                        _context9.next = 2;
                        return cloneCityDay(oldCityDay);

                      case 2:
                        newCityDay = _context9.sent;
                        return _context9.abrupt('return', { order: idx, newCityDay: newCityDay });

                      case 4:
                      case 'end':
                        return _context9.stop();
                    }
                  }
                }, _callee9, _this3);
              }));

              return function (_x13, _x14) {
                return _ref10.apply(this, arguments);
              };
            }()));

          case 2:
            newCityDays = _context10.sent;

            newOutputVertices.cityDays = newCityDays.sort(function (a, b) {
              return a.order - b.order;
            }).map(function (item) {
              return item.newCityDay;
            }); // eslint-disable-line no-param-reassign

          case 4:
          case 'end':
            return _context10.stop();
        }
      }
    }, _callee10, this);
  }));

  return function cloneCityDays(_x11, _x12) {
    return _ref9.apply(this, arguments);
  };
}();

// Clone CityDay document and output Edges,
// Edge 1: cityday --preselect--> tours.
// Edge 2: cityday --bookin--> serviceBookings


var cloneCityDay = function () {
  var _ref11 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee11(oldCityDay) {
    var oldServiceBookings, newServiceBookings, oldToursIds, newCityDay, handle, bookInEdges, preselectEdges;
    return _regenerator2.default.wrap(function _callee11$(_context11) {
      while (1) {
        switch (_context11.prev = _context11.next) {
          case 0:
            oldServiceBookings = oldCityDay.serviceBookings;
            _context11.next = 3;
            return cloneServiceBookings(oldServiceBookings);

          case 3:
            newServiceBookings = _context11.sent;

            // the tours data is live load from real data.
            oldToursIds = oldCityDay.tours;

            // Clone this transferPlacement document

            cleanDoc(oldCityDay, ['serviceBookings', 'tours']);
            newCityDay = (0, _assign2.default)({}, oldCityDay);
            _context11.next = 9;
            return cityDaysCollection.save(newCityDay);

          case 9:
            handle = _context11.sent;


            // save new cityday --bookin--> serviceBookings edge.
            bookInEdges = newServiceBookings.map(function (serviceBooking) {
              return { _from: handle._id, _to: serviceBooking._id };
            });

            if (!(bookInEdges && bookInEdges.length)) {
              _context11.next = 14;
              break;
            }

            _context11.next = 14;
            return bookInEdgeCollection.import(bookInEdges);

          case 14:

            // save new cityday --preselect--> tour edge.
            preselectEdges = oldToursIds.map(function (tourId) {
              return { _from: handle._id, _to: tourId };
            });

            if (!(preselectEdges && preselectEdges.length)) {
              _context11.next = 18;
              break;
            }

            _context11.next = 18;
            return preselectEdgeCollection.import(preselectEdges);

          case 18:
            return _context11.abrupt('return', handle);

          case 19:
          case 'end':
            return _context11.stop();
        }
      }
    }, _callee11, this);
  }));

  return function cloneCityDay(_x15) {
    return _ref11.apply(this, arguments);
  };
}();

// clone all AccommodationPlacements concurrently, set the result to
// newOutputVertices.accommodationPlacements


var cloneAccommodationPlacements = function () {
  var _ref12 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee12(oldAccommodationPlacements, newOutputVertices) {
    return _regenerator2.default.wrap(function _callee12$(_context12) {
      while (1) {
        switch (_context12.prev = _context12.next) {
          case 0:
            _context12.next = 2;
            return _promise2.default.all(oldAccommodationPlacements.map( // eslint-disable-line no-param-reassign
            function (oldAccommodationPlacement) {
              return cloneAccommodationPlacement(oldAccommodationPlacement);
            }));

          case 2:
            newOutputVertices.accommodationPlacements = _context12.sent;

          case 3:
          case 'end':
            return _context12.stop();
        }
      }
    }, _callee12, this);
  }));

  return function cloneAccommodationPlacements(_x16, _x17) {
    return _ref12.apply(this, arguments);
  };
}();

// Clone accommodationPlacement and output Edges.
// Edge 1: accommodationPlacement --BookIn--> serviceBooking
// Edge 2: accommodationPlacement --use--> supplier
// Edge 3: accommodationPlacement --preselect--> accommodation


var cloneAccommodationPlacement = function () {
  var _ref13 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee13(oldAccommodationPlacement) {
    var oldServiceBookings, newServiceBookings, oldAccommodationsIds, oldSupplierId, newAccommodationPlacement, handle, bookInEdges, useEdges, preselectEdges;
    return _regenerator2.default.wrap(function _callee13$(_context13) {
      while (1) {
        switch (_context13.prev = _context13.next) {
          case 0:
            oldServiceBookings = oldAccommodationPlacement.serviceBookings;
            _context13.next = 3;
            return cloneServiceBookings(oldServiceBookings);

          case 3:
            newServiceBookings = _context13.sent;

            // the accommodations and suppliers data is live load from real data.
            oldAccommodationsIds = oldAccommodationPlacement.accommodations;
            oldSupplierId = oldAccommodationPlacement.supplier; // 1:1 preselect;

            // Clone this transferPlacement document

            cleanDoc(oldAccommodationPlacement, ['serviceBookings', 'accommodations', 'supplier']);
            newAccommodationPlacement = (0, _assign2.default)({}, oldAccommodationPlacement);
            _context13.next = 10;
            return accommodationPlacementsCollection.save(newAccommodationPlacement);

          case 10:
            handle = _context13.sent;


            // save new accommodationPlacement --BookIn--> serviceBooking edge.
            bookInEdges = newServiceBookings.map(function (serviceBooking) {
              return { _from: handle._id, _to: serviceBooking._id };
            });

            if (!(bookInEdges && bookInEdges.length)) {
              _context13.next = 15;
              break;
            }

            _context13.next = 15;
            return bookInEdgeCollection.import(bookInEdges);

          case 15:
            if (!oldSupplierId) {
              _context13.next = 19;
              break;
            }

            useEdges = [{ _from: handle._id, _to: oldSupplierId }];
            _context13.next = 19;
            return useEdgeCollection.import(useEdges);

          case 19:

            // save accommodationPlacement --preselect--> accommodation edges
            preselectEdges = oldAccommodationsIds.map(function (accommodationsId) {
              return { _from: handle._id, _to: accommodationsId };
            });

            if (!(preselectEdges && preselectEdges.length)) {
              _context13.next = 23;
              break;
            }

            _context13.next = 23;
            return preselectEdgeCollection.import(preselectEdges);

          case 23:
            return _context13.abrupt('return', handle);

          case 24:
          case 'end':
            return _context13.stop();
        }
      }
    }, _callee13, this);
  }));

  return function cloneAccommodationPlacement(_x18) {
    return _ref13.apply(this, arguments);
  };
}();

// clone the all ServiceBooking concurrently, return a new ordered
// ServiceBookings


var cloneServiceBookings = function () {
  var _ref14 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee15(oldServiceBookings) {
    var _this4 = this;

    var newServiceBookings;
    return _regenerator2.default.wrap(function _callee15$(_context15) {
      while (1) {
        switch (_context15.prev = _context15.next) {
          case 0:
            _context15.next = 2;
            return _promise2.default.all(oldServiceBookings.map(function () {
              var _ref15 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee14(oldServiceBooking, idx) {
                var newServiceBooking;
                return _regenerator2.default.wrap(function _callee14$(_context14) {
                  while (1) {
                    switch (_context14.prev = _context14.next) {
                      case 0:
                        _context14.next = 2;
                        return cloneServiceBooking(oldServiceBooking);

                      case 2:
                        newServiceBooking = _context14.sent;
                        return _context14.abrupt('return', { order: idx, newServiceBooking: newServiceBooking });

                      case 4:
                      case 'end':
                        return _context14.stop();
                    }
                  }
                }, _callee14, _this4);
              }));

              return function (_x20, _x21) {
                return _ref15.apply(this, arguments);
              };
            }()));

          case 2:
            newServiceBookings = _context15.sent;
            return _context15.abrupt('return', newServiceBookings.sort(function (a, b) {
              return a.order - b.order;
            }).map(function (item) {
              return item.newServiceBooking;
            }));

          case 4:
          case 'end':
            return _context15.stop();
        }
      }
    }, _callee15, this);
  }));

  return function cloneServiceBookings(_x19) {
    return _ref14.apply(this, arguments);
  };
}();

// Clone serviceBookings document and output Edges.
// Edge 1: ServiceBooking --BookIn--> roomConfigs
// Edge 2: ServiceBooking --use--> accommodations, tours, transfers


var cloneServiceBooking = function () {
  var _ref16 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee16(oldServiceBooking) {
    var bookInEdgesIds, useEdgesIds, newServiceBooking, handle, bookInEdges, useEdges;
    return _regenerator2.default.wrap(function _callee16$(_context16) {
      while (1) {
        switch (_context16.prev = _context16.next) {
          case 0:
            bookInEdgesIds = oldServiceBooking.bookInEdgesIds;
            useEdgesIds = oldServiceBooking.useEdgesIds;

            // clean the status field of oldServiceBooking and some injected edges fields.

            cleanDoc(oldServiceBooking, ['status', 'bookInEdgesIds', 'useEdgesIds']);
            newServiceBooking = (0, _assign2.default)({}, oldServiceBooking, {
              updatedOn: newDate()
            });
            _context16.next = 6;
            return serviceBookingsCollection.save(newServiceBooking);

          case 6:
            handle = _context16.sent;


            // save new ServiceBooking --BookIn--> serviceBooking edge.
            bookInEdges = bookInEdgesIds.map(function (edgeToId) {
              return { _from: handle._id, _to: edgeToId };
            });

            if (!(bookInEdges && bookInEdges.length)) {
              _context16.next = 11;
              break;
            }

            _context16.next = 11;
            return bookInEdgeCollection.import(bookInEdges);

          case 11:

            // save serviceBooking --use--> accommodations, tours, transfers edges
            useEdges = useEdgesIds.map(function (edgeToId) {
              return { _from: handle._id, _to: edgeToId };
            });
            _context16.next = 14;
            return useEdgeCollection.import(useEdges);

          case 14:
            return _context16.abrupt('return', handle);

          case 15:
          case 'end':
            return _context16.stop();
        }
      }
    }, _callee16, this);
  }));

  return function cloneServiceBooking(_x22) {
    return _ref16.apply(this, arguments);
  };
}();

// clone the all TransferPlacements concurrently, set the result to
// newOutputVertices.transferPlacements


var cloneTransferPlacements = function () {
  var _ref17 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee17(allCityBookingsInOrder) {
    var oldCityBookingIds, cityBookingIdMaps, getUniqueTransferPlacementsIdsQuery, result, uniqueTPIds;
    return _regenerator2.default.wrap(function _callee17$(_context17) {
      while (1) {
        switch (_context17.prev = _context17.next) {
          case 0:
            oldCityBookingIds = allCityBookingsInOrder.map(function (cityBookings) {
              return cityBookings.oldCityBookingId;
            });
            cityBookingIdMaps = {}; //  cityBookingIdMaps[oldCityBookingId] = newCityBookingId

            allCityBookingsInOrder.map(function (cityBookings) {
              cityBookingIdMaps[cityBookings.oldCityBookingId] = cityBookings._id;return cityBookingIdMaps;
            });

            getUniqueTransferPlacementsIdsQuery = '\n    let t1 = (for edge in transfer filter edge._from in @cityBookingIds return edge._to)\n    let t2 = (for edge in transfer filter edge._to in @cityBookingIds return edge._from)\n    RETURN append (t1, t2, true)\n  ';
            _context17.next = 6;
            return _database.db.query(getUniqueTransferPlacementsIdsQuery, {
              cityBookingIds: oldCityBookingIds
            });

          case 6:
            result = _context17.sent;
            _context17.next = 9;
            return result.next();

          case 9:
            uniqueTPIds = _context17.sent;
            _context17.next = 12;
            return _promise2.default.all(uniqueTPIds.map(function (oldTransferPlacementId) {
              return cloneTransferPlacement(oldTransferPlacementId, cityBookingIdMaps);
            }));

          case 12:
          case 'end':
            return _context17.stop();
        }
      }
    }, _callee17, this);
  }));

  return function cloneTransferPlacements(_x23) {
    return _ref17.apply(this, arguments);
  };
}();

// Clone transferPlacements document and outputEdges,
// Edge 1: transferPlacements <--transfer--> cityBookings ( 1 or 2 edges)
// Edge 2: transferPlacements --preselect--> transfers
// Edge 3: transferPlacements --BookIn--> serviceBookings


var cloneTransferPlacement = function () {
  var _ref18 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee18(oldTransferPlacementId, cityBookingIdMaps) {
    var oldTransferPlacement, oldServiceBookings, newServiceBookings, oldTransferIds, oldFromCityBookingIds, oldToCityBookingIds, newServiceBookingOrder, newTransferPlacement, handle, bookInEdges, preselectEdges, transferEdges;
    return _regenerator2.default.wrap(function _callee18$(_context18) {
      while (1) {
        switch (_context18.prev = _context18.next) {
          case 0:
            _context18.next = 2;
            return queryPlacementsAll(oldTransferPlacementId);

          case 2:
            oldTransferPlacement = _context18.sent;

            // clone all the serviceBookings of this TransferPlacements,
            oldServiceBookings = oldTransferPlacement.serviceBookings;
            _context18.next = 6;
            return cloneServiceBookings(oldServiceBookings);

          case 6:
            newServiceBookings = _context18.sent;


            // the transfers data is live load from real data.
            oldTransferIds = oldTransferPlacement.transfers;
            // fromCityBookingIds, toCityBookingIds are old CityBookingIds transferred
            // from/to this TransferPlacement

            oldFromCityBookingIds = oldTransferPlacement.fromCityBookingIds;
            oldToCityBookingIds = oldTransferPlacement.toCityBookingIds;

            // Clone this transferPlacement document

            cleanDoc(oldTransferPlacement, ['fromCityBookingIds', 'toCityBookingIds', 'serviceBookings', 'transfers']);
            newServiceBookingOrder = newServiceBookings.map(function (newServiceBooking) {
              return newServiceBooking._key;
            });
            newTransferPlacement = (0, _assign2.default)({}, oldTransferPlacement, { serviceBookingOrder: newServiceBookingOrder });
            _context18.next = 15;
            return transferPlacementsCollection.save(newTransferPlacement);

          case 15:
            handle = _context18.sent;


            // save BookIn edges.
            bookInEdges = newServiceBookings.map(function (serviceBooking) {
              return { _from: handle._id, _to: serviceBooking._id };
            });

            if (!(bookInEdges && bookInEdges.length)) {
              _context18.next = 20;
              break;
            }

            _context18.next = 20;
            return bookInEdgeCollection.import(bookInEdges);

          case 20:

            // save preselect edges
            preselectEdges = oldTransferIds.map(function (transferId) {
              return { _from: handle._id, _to: transferId };
            });

            if (!(preselectEdges && preselectEdges.length)) {
              _context18.next = 24;
              break;
            }

            _context18.next = 24;
            return preselectEdgeCollection.import(preselectEdges);

          case 24:

            // Edge: transferPlacements <--transfer--> cityBookings ( 1 or 2 edges)
            transferEdges = [];

            oldFromCityBookingIds.map(function (oldFromCityId) {
              return transferEdges.push({ _from: cityBookingIdMaps[oldFromCityId], _to: handle._id });
            });
            oldToCityBookingIds.map(function (oldToCityId) {
              return transferEdges.push({ _from: handle._id, _to: cityBookingIdMaps[oldToCityId] });
            });

            if (!(transferEdges.length > 0)) {
              _context18.next = 30;
              break;
            }

            _context18.next = 30;
            return transferEdgeCollection.import(transferEdges);

          case 30:
            return _context18.abrupt('return', handle);

          case 31:
          case 'end':
            return _context18.stop();
        }
      }
    }, _callee18, this);
  }));

  return function cloneTransferPlacement(_x24, _x25) {
    return _ref18.apply(this, arguments);
  };
}();

// Query full placement information,  fromCity, toCity, serviceBookings.


var queryPlacementsAll = function () {
  var _ref19 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee19(transferPlacementId) {
    var aqlQuery, result;
    return _regenerator2.default.wrap(function _callee19$(_context19) {
      while (1) {
        switch (_context19.prev = _context19.next) {
          case 0:
            // Query Transfer placements.
            aqlQuery = '\n  LET transferPlacement = DOCUMENT(@transferPlacementId)\n  LET serviceBookingOrderKeys = NOT_NULL(transferPlacement.serviceBookingOrder) ? transferPlacement.serviceBookingOrder : []\n  RETURN MERGE ( transferPlacement, \n    { fromCityBookingIds: ( FOR vertx, edge in INBOUND transferPlacement._id transfer RETURN edge._from ) },\n    { toCityBookingIds: ( FOR vertx, edge in OUTBOUND transferPlacement._id transfer RETURN edge._to ) },\n    { serviceBookings: (\n        FOR serviceBookingKey IN serviceBookingOrderKeys\n          LET serviceBookingId = CONCAT(\'serviceBookings/\', serviceBookingKey)\n          LET serviceBooking = DOCUMENT(serviceBookingId)\n          RETURN MERGE(serviceBooking, \n          { useEdgesIds: (\n            LET useEdges = (FOR vertex, edge IN OUTBOUND serviceBooking._id use RETURN edge)\n            FOR edge IN useEdges\n              RETURN edge._to)},\n         { bookInEdgesIds: (\n            LET bookInEdges = (FOR vertex, edge IN OUTBOUND serviceBooking._id bookIn RETURN edge)\n            FOR edge IN bookInEdges\n              RETURN edge._to\n              )}))\n    }, \n    { transfers: (\n        LET transferEdges = ( FOR vertx, edge in OUTBOUND transferPlacement._id preselect RETURN edge )\n        FOR transferEdge in transferEdges\n            return transferEdge._to)\n    })';
            _context19.next = 3;
            return _database.db.query(aqlQuery, {
              transferPlacementId: transferPlacementId
            });

          case 3:
            result = _context19.sent;
            return _context19.abrupt('return', result.next());

          case 5:
          case 'end':
            return _context19.stop();
        }
      }
    }, _callee19, this);
  }));

  return function queryPlacementsAll(_x26) {
    return _ref19.apply(this, arguments);
  };
}();

// new Date in 'YYYY-MM-DD'


var _database = require('../../database');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var tripsCollection = _database.db.collection('trips'); /* eslint-disable no-console */

// The cloned trip will have all of the same product placements, preselections...
// trip with all of tis relationships. set trip status to draft.
// include all country bookings. clear: qpBookingId, tpBookingId, tpBookingRef.
// all city bookings
// all cityDay, accommodationPlacement, transferPlacement
// all serviceBooking.  Clear: status

var countryBookingsCollection = _database.db.collection('countryBookings');
var cityBookingsCollection = _database.db.collection('cityBookings');
var transferPlacementsCollection = _database.db.collection('transferPlacements');
var cityDaysCollection = _database.db.collection('cityDays');
var accommodationPlacementsCollection = _database.db.collection('accommodationPlacements');
var serviceBookingsCollection = _database.db.collection('serviceBookings');

var bookInEdgeCollection = _database.db.edgeCollection('bookIn');
var participateEdgeCollection = _database.db.edgeCollection('participate');
var locatedInEdgeCollection = _database.db.edgeCollection('locatedIn');
var transferEdgeCollection = _database.db.edgeCollection('transfer');
var preselectEdgeCollection = _database.db.edgeCollection('preselect');
var useEdgeCollection = _database.db.edgeCollection('use');function newDate() {
  var d = new Date();
  var month = '' + (d.getMonth() + 1);
  var day = '' + d.getDate();
  var year = d.getFullYear();
  if (month.length < 2) month = '0' + month;
  if (day.length < 2) day = '0' + day;
  return year + '-' + month + '-' + day;
}

// clean document metadata properties and specified properties.
function cleanDoc(doc, propertiesToDel) {
  propertiesToDel = propertiesToDel || []; // eslint-disable-line no-param-reassign
  propertiesToDel.push('_id', '_key', '_rev');
  propertiesToDel.map(function (prop) {
    return delete doc[prop];
  }); // eslint-disable-line no-param-reassign
}

exports.default = cloneTrip;