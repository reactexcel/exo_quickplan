'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getAllDBTransfers = exports.getTransferPlacements = exports.remove = exports.removeLocalTransfer = exports.getTransfersByKey = exports.updateLocalTransferPlacement = exports.updateTransferPlacement = exports.removeServiceBooking = exports.addServiceBooking = exports.clearTransferPlacement = exports.getTransferPlacementByCityBookingKey = exports.getCityLocationByTransferPlacementKey = exports.getCityBookingByTransferPlacementKey = exports.getTransferPlacementByCountryBookingKey = exports.getTransferByServiceBookingKey = exports.getTransferStatus = exports.getTransferPlacement = exports.addTransferPlacement = exports.addDepartureTransferPlacement = undefined;

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _getIterator2 = require('babel-runtime/core-js/get-iterator');

var _getIterator3 = _interopRequireDefault(_getIterator2);

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var addDepartureTransferPlacement = function () {
  var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(args) {
    var tripKey, aqlDepartureExist, departureTransfers, departureTransferExist, departureTransferPlacement, newDepartureTransferPlacement;
    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            tripKey = args.tripKey;
            aqlDepartureExist = '\n    let tripId = concat(\'trips/\', @tripKey)\n    let departureTransfer = (\n      for transferPlacement, transferEdge in 1..1 any tripId graph \'exo-dev\'\n        filter not_null(transferPlacement) && is_same_collection(\'transferPlacements\', transferPlacement)\n      return transferPlacement)\n    return (length(departureTransfer) > 0)';
            _context.next = 4;
            return _database.db.query(aqlDepartureExist, { tripKey: tripKey });

          case 4:
            departureTransfers = _context.sent;
            _context.next = 7;
            return departureTransfers.next();

          case 7:
            departureTransferExist = _context.sent;

            if (departureTransferExist) {
              _context.next = 19;
              break;
            }

            _context.next = 11;
            return transferPlacementsCollection.save({ type: 'departureTransfer' });

          case 11:
            departureTransferPlacement = _context.sent;
            _context.next = 14;
            return transferPlacementsCollection.document(departureTransferPlacement);

          case 14:
            newDepartureTransferPlacement = _context.sent;
            _context.next = 17;
            return transferEdgeCollection.save({ label: 'origin' }, 'trips/' + tripKey, newDepartureTransferPlacement._id);

          case 17:
            _context.next = 19;
            return transferEdgeCollection.save({ label: 'destination' }, newDepartureTransferPlacement._id, 'trips/' + tripKey);

          case 19:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this);
  }));

  return function addDepartureTransferPlacement(_x) {
    return _ref.apply(this, arguments);
  };
}();

var addTransferPlacement = function () {
  var _ref2 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee2(args) {
    var originCityBookingKey, destinationCityBookingKey, durationNights, handle, saveDoc;
    return _regenerator2.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            originCityBookingKey = args.originCityBookingKey, destinationCityBookingKey = args.destinationCityBookingKey, durationNights = args.durationNights;
            _context2.next = 3;
            return transferPlacementsCollection.save({
              durationNights: durationNights || 0,
              serviceBookingOrder: []
            });

          case 3:
            handle = _context2.sent;
            _context2.next = 6;
            return transferPlacementsCollection.document(handle);

          case 6:
            saveDoc = _context2.sent;
            _context2.next = 9;
            return transferEdgeCollection.save({}, 'cityBookings/' + originCityBookingKey, saveDoc._id);

          case 9:
            if (!destinationCityBookingKey) {
              _context2.next = 12;
              break;
            }

            _context2.next = 12;
            return transferEdgeCollection.save({}, saveDoc._id, 'cityBookings/' + destinationCityBookingKey);

          case 12:
            return _context2.abrupt('return', saveDoc);

          case 13:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, this);
  }));

  return function addTransferPlacement(_x2) {
    return _ref2.apply(this, arguments);
  };
}();

var getTransferPlacement = function () {
  var _ref3 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee3(_key) {
    return _regenerator2.default.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.prev = 0;
            _context3.next = 3;
            return transferPlacementsCollection.firstExample({ _key: _key });

          case 3:
            return _context3.abrupt('return', _context3.sent);

          case 6:
            _context3.prev = 6;
            _context3.t0 = _context3['catch'](0);

            console.log(_context3.t0);
            return _context3.abrupt('return', null);

          case 10:
          case 'end':
            return _context3.stop();
        }
      }
    }, _callee3, this, [[0, 6]]);
  }));

  return function getTransferPlacement(_x3) {
    return _ref3.apply(this, arguments);
  };
}();

// added on 19th october for using in for local transfer


var getTransfersByKey = function () {
  var _ref4 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee4(_key) {
    return _regenerator2.default.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            _context4.prev = 0;
            _context4.next = 3;
            return transfers.firstExample({ _key: _key });

          case 3:
            return _context4.abrupt('return', _context4.sent);

          case 6:
            _context4.prev = 6;
            _context4.t0 = _context4['catch'](0);
            return _context4.abrupt('return', null);

          case 9:
          case 'end':
            return _context4.stop();
        }
      }
    }, _callee4, this, [[0, 6]]);
  }));

  return function getTransfersByKey(_x4) {
    return _ref4.apply(this, arguments);
  };
}();

var getAllDBTransfers = function () {
  var _ref5 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee5() {
    var aqlQuery, result, ret;
    return _regenerator2.default.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            aqlQuery = '\n    FOR transfer IN transfers\n      RETURN transfer\n  ';
            _context5.next = 3;
            return _database.db.query(aqlQuery);

          case 3:
            result = _context5.sent;
            ret = result.all();
            return _context5.abrupt('return', ret);

          case 6:
          case 'end':
            return _context5.stop();
        }
      }
    }, _callee5, this);
  }));

  return function getAllDBTransfers() {
    return _ref5.apply(this, arguments);
  };
}();

// Used by function getTransferStatus


var getCityBookingsOriginCityCode = function () {
  var _ref6 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee6(transferPlacementKey) {
    var aqlQuery, result;
    return _regenerator2.default.wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            aqlQuery = '\n    LET transferPlacementId = CONCAT(\'transferPlacements/\', @transferPlacementKey)\n    FOR vertex, edges IN 1..1 INBOUND transferPlacementId GRAPH \'exo-dev\'\n      FILTER IS_SAME_COLLECTION(\'cityBookings\', vertex)\n      RETURN vertex.cityCode';
            _context6.next = 3;
            return _database.db.query(aqlQuery, { transferPlacementKey: transferPlacementKey });

          case 3:
            result = _context6.sent;
            return _context6.abrupt('return', result.next());

          case 5:
          case 'end':
            return _context6.stop();
        }
      }
    }, _callee6, this);
  }));

  return function getCityBookingsOriginCityCode(_x5) {
    return _ref6.apply(this, arguments);
  };
}();

// Used by function getTransferStatus


var getCityBookingsDestinationCityCode = function () {
  var _ref7 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee7(transferPlacementKey) {
    var aqlQuery, result;
    return _regenerator2.default.wrap(function _callee7$(_context7) {
      while (1) {
        switch (_context7.prev = _context7.next) {
          case 0:
            aqlQuery = '\n    LET transferPlacementId = CONCAT(\'transferPlacements/\', @transferPlacementKey)\n    FOR vertex, edges IN 1..1 OUTBOUND transferPlacementId GRAPH \'exo-dev\'\n      FILTER IS_SAME_COLLECTION(\'cityBookings\', vertex)\n      RETURN vertex.cityCode';
            _context7.next = 3;
            return _database.db.query(aqlQuery, { transferPlacementKey: transferPlacementKey });

          case 3:
            result = _context7.sent;
            return _context7.abrupt('return', result.next());

          case 5:
          case 'end':
            return _context7.stop();
        }
      }
    }, _callee7, this);
  }));

  return function getCityBookingsDestinationCityCode(_x6) {
    return _ref7.apply(this, arguments);
  };
}();

// Used by function getTransferStatus


var getFirstServiceBookingKey = function () {
  var _ref8 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee8(transferPlacementKey) {
    var aqlQuery, result;
    return _regenerator2.default.wrap(function _callee8$(_context8) {
      while (1) {
        switch (_context8.prev = _context8.next) {
          case 0:
            aqlQuery = '\n    LET transferPlacementId = CONCAT(\'transferPlacements/\', @transferPlacementKey)\n    FOR transfer IN transferPlacements\n      FILTER transfer._id == transferPlacementId\n      RETURN FIRST(transfer.serviceBookingOrder)';
            _context8.next = 3;
            return _database.db.query(aqlQuery, { transferPlacementKey: transferPlacementKey });

          case 3:
            result = _context8.sent;
            return _context8.abrupt('return', result.next());

          case 5:
          case 'end':
            return _context8.stop();
        }
      }
    }, _callee8, this);
  }));

  return function getFirstServiceBookingKey(_x7) {
    return _ref8.apply(this, arguments);
  };
}();

// Used by function getTransferStatus


var getLastServiceBookingKey = function () {
  var _ref9 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee9(transferPlacementKey) {
    var aqlQuery, result;
    return _regenerator2.default.wrap(function _callee9$(_context9) {
      while (1) {
        switch (_context9.prev = _context9.next) {
          case 0:
            aqlQuery = '\n    LET transferPlacementId = CONCAT(\'transferPlacements/\', @transferPlacementKey)\n    FOR transfer IN transferPlacements\n      FILTER transfer._id == transferPlacementId\n      RETURN LAST(transfer.serviceBookingOrder)';
            _context9.next = 3;
            return _database.db.query(aqlQuery, { transferPlacementKey: transferPlacementKey });

          case 3:
            result = _context9.sent;
            return _context9.abrupt('return', result.next());

          case 5:
          case 'end':
            return _context9.stop();
        }
      }
    }, _callee9, this);
  }));

  return function getLastServiceBookingKey(_x8) {
    return _ref9.apply(this, arguments);
  };
}();

// Used by function getTransferStatus


var getTransferFromCityCode = function () {
  var _ref10 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee10(serviceBookingKey) {
    var aqlQuery, result;
    return _regenerator2.default.wrap(function _callee10$(_context10) {
      while (1) {
        switch (_context10.prev = _context10.next) {
          case 0:
            aqlQuery = '\n    LET serviceBookingId = CONCAT(\'serviceBookings/\', @serviceBookingKey)\n    FOR vertex, edges IN 1..1 OUTBOUND serviceBookingId GRAPH \'exo-dev\'\n      RETURN vertex.route.from.cityCode';
            _context10.next = 3;
            return _database.db.query(aqlQuery, { serviceBookingKey: serviceBookingKey });

          case 3:
            result = _context10.sent;
            return _context10.abrupt('return', result.next());

          case 5:
          case 'end':
            return _context10.stop();
        }
      }
    }, _callee10, this);
  }));

  return function getTransferFromCityCode(_x9) {
    return _ref10.apply(this, arguments);
  };
}();

// Used by function getTransferStatus


var getTransferToCityCode = function () {
  var _ref11 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee11(serviceBookingKey) {
    var aqlQuery, result;
    return _regenerator2.default.wrap(function _callee11$(_context11) {
      while (1) {
        switch (_context11.prev = _context11.next) {
          case 0:
            aqlQuery = '\n    LET serviceBookingId = CONCAT(\'serviceBookings/\', @serviceBookingKey)\n    FOR vertex, edges IN 1..1 OUTBOUND serviceBookingId GRAPH \'exo-dev\'\n      RETURN vertex.route.to.cityCode';
            _context11.next = 3;
            return _database.db.query(aqlQuery, { serviceBookingKey: serviceBookingKey });

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

  return function getTransferToCityCode(_x10) {
    return _ref11.apply(this, arguments);
  };
}();

// Used by function getTransferStatus


var getCityCodeByCityName = function () {
  var _ref12 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee12(cityName) {
    var aqlQuery, result;
    return _regenerator2.default.wrap(function _callee12$(_context12) {
      while (1) {
        switch (_context12.prev = _context12.next) {
          case 0:
            aqlQuery = '\n  LET cityName = UPPER(@cityName)\n  FOR l IN locations\n    FILTER UPPER(l.name) == cityName\n      RETURN l.tpCode';
            _context12.next = 3;
            return _database.db.query(aqlQuery, { cityName: cityName });

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

  return function getCityCodeByCityName(_x11) {
    return _ref12.apply(this, arguments);
  };
}();

var getTransferStatus = function () {
  var _ref13 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee13(transferPlacementKey) {
    var cityBookingOriginCityCode, cityBookingDestinationCityCode, originCityCode, destinationCityCode, firstServiceBookingKey, lastServiceBookingKey, transferFromCityCode, transferToCityCode, sameOriginDestinationError, originError, destinationError;
    return _regenerator2.default.wrap(function _callee13$(_context13) {
      while (1) {
        switch (_context13.prev = _context13.next) {
          case 0:
            _context13.next = 2;
            return getCityBookingsOriginCityCode(transferPlacementKey);

          case 2:
            cityBookingOriginCityCode = _context13.sent;
            _context13.next = 5;
            return getCityBookingsDestinationCityCode(transferPlacementKey);

          case 5:
            cityBookingDestinationCityCode = _context13.sent;
            _context13.next = 8;
            return getCityCodeByCityName(cityBookingOriginCityCode);

          case 8:
            originCityCode = _context13.sent;
            _context13.next = 11;
            return getCityCodeByCityName(cityBookingDestinationCityCode);

          case 11:
            destinationCityCode = _context13.sent;
            _context13.next = 14;
            return getFirstServiceBookingKey(transferPlacementKey);

          case 14:
            firstServiceBookingKey = _context13.sent;
            _context13.next = 17;
            return getLastServiceBookingKey(transferPlacementKey);

          case 17:
            lastServiceBookingKey = _context13.sent;
            _context13.next = 20;
            return getTransferFromCityCode(firstServiceBookingKey);

          case 20:
            transferFromCityCode = _context13.sent;
            _context13.next = 23;
            return getTransferToCityCode(lastServiceBookingKey);

          case 23:
            transferToCityCode = _context13.sent;
            sameOriginDestinationError = originCityCode && destinationCityCode && originCityCode.trim() === destinationCityCode.trim();
            originError = originCityCode && transferFromCityCode && originCityCode.trim() !== transferFromCityCode.trim();
            destinationError = destinationCityCode && transferToCityCode && destinationCityCode.trim() !== transferToCityCode.trim();

            if (!sameOriginDestinationError) {
              _context13.next = 31;
              break;
            }

            return _context13.abrupt('return', {
              severity: 20,
              message: 'Transfer origin and destination should not be in the same city.'
            });

          case 31:
            if (!(originError && destinationError)) {
              _context13.next = 35;
              break;
            }

            return _context13.abrupt('return', {
              severity: 20,
              message: 'Transfer origin and destination was changed. Transfer details need to be updated.'
            });

          case 35:
            if (!originError) {
              _context13.next = 39;
              break;
            }

            return _context13.abrupt('return', {
              severity: 20,
              message: 'Transfer origin was changed. Transfer details need to be updated.'
            });

          case 39:
            if (!destinationError) {
              _context13.next = 41;
              break;
            }

            return _context13.abrupt('return', {
              severity: 20,
              message: 'Transfer destination was changed. Transfer details need to be updated.'
            });

          case 41:
            return _context13.abrupt('return', {
              severity: 0,
              message: ''
            });

          case 42:
          case 'end':
            return _context13.stop();
        }
      }
    }, _callee13, this);
  }));

  return function getTransferStatus(_x12) {
    return _ref13.apply(this, arguments);
  };
}();

var clearTransferPlacement = function () {
  var _ref14 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee14(_key) {
    var serviceBookingsGraphCollection, serviceBookings, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, sb;

    return _regenerator2.default.wrap(function _callee14$(_context14) {
      while (1) {
        switch (_context14.prev = _context14.next) {
          case 0:
            serviceBookingsGraphCollection = graph.vertexCollection('serviceBookings');
            _context14.prev = 1;
            _context14.next = 4;
            return (0, _dbUtils.traversWithFilter)(1, 1, 'OUTBOUND', 'transferPlacements/' + _key, true, 'serviceBookings');

          case 4:
            serviceBookings = _context14.sent;

            // Remove serviceBookings
            _iteratorNormalCompletion = true;
            _didIteratorError = false;
            _iteratorError = undefined;
            _context14.prev = 8;
            _iterator = (0, _getIterator3.default)(serviceBookings);

          case 10:
            if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
              _context14.next = 17;
              break;
            }

            sb = _step.value;
            _context14.next = 14;
            return serviceBookingsGraphCollection.remove(sb);

          case 14:
            _iteratorNormalCompletion = true;
            _context14.next = 10;
            break;

          case 17:
            _context14.next = 23;
            break;

          case 19:
            _context14.prev = 19;
            _context14.t0 = _context14['catch'](8);
            _didIteratorError = true;
            _iteratorError = _context14.t0;

          case 23:
            _context14.prev = 23;
            _context14.prev = 24;

            if (!_iteratorNormalCompletion && _iterator.return) {
              _iterator.return();
            }

          case 26:
            _context14.prev = 26;

            if (!_didIteratorError) {
              _context14.next = 29;
              break;
            }

            throw _iteratorError;

          case 29:
            return _context14.finish(26);

          case 30:
            return _context14.finish(23);

          case 31:
            _context14.next = 33;
            return transferPlacementsCollection.update(_key, { serviceBookingOrder: [] });

          case 33:
            return _context14.abrupt('return', _context14.sent);

          case 36:
            _context14.prev = 36;
            _context14.t1 = _context14['catch'](1);

            console.log(_context14.t1);
            return _context14.abrupt('return', null);

          case 40:
          case 'end':
            return _context14.stop();
        }
      }
    }, _callee14, this, [[1, 36], [8, 19, 23, 31], [24,, 26, 30]]);
  }));

  return function clearTransferPlacement(_x13) {
    return _ref14.apply(this, arguments);
  };
}();

var getTransferByServiceBookingKey = function () {
  var _ref15 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee15(args) {
    var edge;
    return _regenerator2.default.wrap(function _callee15$(_context15) {
      while (1) {
        switch (_context15.prev = _context15.next) {
          case 0:
            _context15.prev = 0;
            _context15.next = 3;
            return useEdgeCollection.firstExample({ _from: 'serviceBookings/' + args.serviceBookingKey });

          case 3:
            edge = _context15.sent;
            _context15.next = 6;
            return transfers.firstExample({ _id: edge._to });

          case 6:
            return _context15.abrupt('return', _context15.sent);

          case 9:
            _context15.prev = 9;
            _context15.t0 = _context15['catch'](0);
            return _context15.abrupt('return', null);

          case 12:
          case 'end':
            return _context15.stop();
        }
      }
    }, _callee15, this, [[0, 9]]);
  }));

  return function getTransferByServiceBookingKey(_x14) {
    return _ref15.apply(this, arguments);
  };
}();

var getTransferPlacementByCityBookingKey = function () {
  var _ref16 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee16(args) {
    var edge;
    return _regenerator2.default.wrap(function _callee16$(_context16) {
      while (1) {
        switch (_context16.prev = _context16.next) {
          case 0:
            _context16.prev = 0;
            _context16.next = 3;
            return transferEdgeCollection.firstExample({ _to: 'cityBookings/' + args.cityBookingKey });

          case 3:
            edge = _context16.sent;
            _context16.next = 6;
            return transferPlacementsCollection.firstExample({ _id: edge._from });

          case 6:
            return _context16.abrupt('return', _context16.sent);

          case 9:
            _context16.prev = 9;
            _context16.t0 = _context16['catch'](0);
            return _context16.abrupt('return', null);

          case 12:
          case 'end':
            return _context16.stop();
        }
      }
    }, _callee16, this, [[0, 9]]);
  }));

  return function getTransferPlacementByCityBookingKey(_x15) {
    return _ref16.apply(this, arguments);
  };
}();

var getTransferPlacementByCountryBookingKey = function () {
  var _ref17 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee17(args) {
    var countryBooking, cityBookingKey, edge;
    return _regenerator2.default.wrap(function _callee17$(_context17) {
      while (1) {
        switch (_context17.prev = _context17.next) {
          case 0:
            _context17.prev = 0;
            _context17.next = 3;
            return countryBookings.firstExample({ _id: 'countryBookings/' + args.countryBookingKey });

          case 3:
            countryBooking = _context17.sent;
            cityBookingKey = countryBooking.cityOrder[0];
            _context17.next = 7;
            return transferEdgeCollection.firstExample({ _to: 'cityBookings/' + cityBookingKey });

          case 7:
            edge = _context17.sent;
            _context17.next = 10;
            return transferPlacementsCollection.firstExample({ _id: edge._from });

          case 10:
            return _context17.abrupt('return', _context17.sent);

          case 13:
            _context17.prev = 13;
            _context17.t0 = _context17['catch'](0);
            return _context17.abrupt('return', null);

          case 16:
          case 'end':
            return _context17.stop();
        }
      }
    }, _callee17, this, [[0, 13]]);
  }));

  return function getTransferPlacementByCountryBookingKey(_x16) {
    return _ref17.apply(this, arguments);
  };
}();

var getCityBookingByTransferPlacementKey = function () {
  var _ref18 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee18(args) {
    var cityBooking, edge, _edge;

    return _regenerator2.default.wrap(function _callee18$(_context18) {
      while (1) {
        switch (_context18.prev = _context18.next) {
          case 0:
            _context18.prev = 0;
            cityBooking = void 0;

            if (!(args.type === 'from')) {
              _context18.next = 11;
              break;
            }

            _context18.next = 5;
            return transferEdgeCollection.firstExample({ _to: 'transferPlacements/' + args.transferPlacementKey });

          case 5:
            edge = _context18.sent;
            _context18.next = 8;
            return cityBookings.firstExample({ _id: edge._from });

          case 8:
            cityBooking = _context18.sent;
            _context18.next = 17;
            break;

          case 11:
            _context18.next = 13;
            return transferEdgeCollection.firstExample({ _from: 'transferPlacements/' + args.transferPlacementKey });

          case 13:
            _edge = _context18.sent;
            _context18.next = 16;
            return cityBookings.firstExample({ _id: _edge._to });

          case 16:
            cityBooking = _context18.sent;

          case 17:
            return _context18.abrupt('return', cityBooking);

          case 20:
            _context18.prev = 20;
            _context18.t0 = _context18['catch'](0);

            console.log(_context18.t0);
            return _context18.abrupt('return', null);

          case 24:
          case 'end':
            return _context18.stop();
        }
      }
    }, _callee18, this, [[0, 20]]);
  }));

  return function getCityBookingByTransferPlacementKey(_x17) {
    return _ref18.apply(this, arguments);
  };
}();

var getCityLocationByTransferPlacementKey = function () {
  var _ref19 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee19(args) {
    var cityBooking, edge;
    return _regenerator2.default.wrap(function _callee19$(_context19) {
      while (1) {
        switch (_context19.prev = _context19.next) {
          case 0:
            _context19.next = 2;
            return getCityBookingByTransferPlacementKey(args);

          case 2:
            cityBooking = _context19.sent;
            _context19.next = 5;
            return locatedInEdgeCollection.firstExample({ _from: cityBooking._id });

          case 5:
            edge = _context19.sent;
            _context19.next = 8;
            return locationCollection.document(edge._to);

          case 8:
            return _context19.abrupt('return', _context19.sent);

          case 9:
          case 'end':
            return _context19.stop();
        }
      }
    }, _callee19, this);
  }));

  return function getCityLocationByTransferPlacementKey(_x18) {
    return _ref19.apply(this, arguments);
  };
}();

var addServiceBooking = function () {
  var _ref20 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee20(args) {
    var transferPlacementKey, serviceBookingKey, serviceBookingIndex, tf;
    return _regenerator2.default.wrap(function _callee20$(_context20) {
      while (1) {
        switch (_context20.prev = _context20.next) {
          case 0:
            transferPlacementKey = args.transferPlacementKey, serviceBookingKey = args.serviceBookingKey, serviceBookingIndex = args.serviceBookingIndex;
            _context20.next = 3;
            return getTransferPlacement('transferPlacements/' + transferPlacementKey);

          case 3:
            tf = _context20.sent;


            // Add serviceBooking to transferPlacement at specified index
            if (typeof serviceBookingIndex === 'number') tf.serviceBookingOrder.splice(serviceBookingIndex, 0, serviceBookingKey);else tf.serviceBookingOrder.push(serviceBookingKey);

            // Create edge
            _context20.next = 7;
            return bookInEdgeCollection.save({}, 'transferPlacements/' + transferPlacementKey, 'serviceBookings/' + serviceBookingKey);

          case 7:
            _context20.next = 9;
            return transferPlacementsCollection.update(tf, tf);

          case 9:
            _context20.next = 11;
            return transferPlacementsCollection.document(tf);

          case 11:
            return _context20.abrupt('return', _context20.sent);

          case 12:
          case 'end':
            return _context20.stop();
        }
      }
    }, _callee20, this);
  }));

  return function addServiceBooking(_x19) {
    return _ref20.apply(this, arguments);
  };
}();

var removeServiceBooking = function () {
  var _ref21 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee21(args) {
    var transferPlacementKey, serviceBookingKey, tf;
    return _regenerator2.default.wrap(function _callee21$(_context21) {
      while (1) {
        switch (_context21.prev = _context21.next) {
          case 0:
            transferPlacementKey = args.transferPlacementKey, serviceBookingKey = args.serviceBookingKey;
            _context21.next = 3;
            return getTransferPlacement('transferPlacements/' + transferPlacementKey);

          case 3:
            tf = _context21.sent;


            // Remove serviceBooking from transferPlacement
            tf.serviceBookingOrder = tf.serviceBookingOrder.filter(function (item) {
              return item !== serviceBookingKey;
            });

            // Save transferPlacement
            _context21.next = 7;
            return transferPlacementsCollection.update(tf, tf);

          case 7:
            _context21.next = 9;
            return transferPlacementsCollection.document(tf);

          case 9:
            return _context21.abrupt('return', _context21.sent);

          case 10:
          case 'end':
            return _context21.stop();
        }
      }
    }, _callee21, this);
  }));

  return function removeServiceBooking(_x20) {
    return _ref21.apply(this, arguments);
  };
}();

/**
 * Update a TransferPlacement and its relationship, use and transfer edges.
 * it matches all its related serviceBookings and decides which ones need to be
 * added or removed
 * @param selectedTransferKeys
 * @param transferPlacementKey
 * @param durationDays
 * @param serviceBookingData
 * @returns TransferPlacement object
 */


var updateTransferPlacement = function () {
  var _ref22 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee22(_ref23) {
    var _this = this;

    var selectedTransferKeys = _ref23.selectedTransferKeys,
        transferPlacementKey = _ref23.transferPlacementKey,
        durationDays = _ref23.durationDays,
        serviceBookingData = _ref23.serviceBookingData,
        startDate = _ref23.startDate,
        proposalKey = _ref23.proposalKey;

    var transferPlacementsCollection, serviceBookingsCollection, transferCollection, serviceBookingsGraphCollection, oldServiceBookings, _iteratorNormalCompletion2, _didIteratorError2, _iteratorError2, _iterator2, _step2, sb, transfer, oldTransferKeys, toBeRemoved, toBeAdded, _iteratorNormalCompletion3, _didIteratorError3, _iteratorError3, _loop, _iterator3, _step3, _ret, _iteratorNormalCompletion4, _didIteratorError4, _iteratorError4, _iterator4, _step4, _transferKey, serviceBookingIndex, newServiceBooking, _transfer, _serviceBooking, newServiceBookings, _iteratorNormalCompletion5, _didIteratorError5, _iteratorError5, _iterator5, _step5, _sb, _transfer2, serviceBookingOrder, _iteratorNormalCompletion6, _didIteratorError6, _iteratorError6, _loop2, _iterator6, _step6, oldTransferPlacement, newTransferPlacement, allPaxes, tripKey;

    return _regenerator2.default.wrap(function _callee22$(_context23) {
      while (1) {
        switch (_context23.prev = _context23.next) {
          case 0:
            transferPlacementsCollection = _database.db.collection('transferPlacements');
            serviceBookingsCollection = _database.db.collection('serviceBookings');
            transferCollection = _database.db.collection('transfers');
            serviceBookingsGraphCollection = graph.vertexCollection('serviceBookings');
            _context23.prev = 4;
            _context23.next = 7;
            return (0, _dbUtils.traversWithFilter)(1, 1, 'OUTBOUND', 'transferPlacements/' + transferPlacementKey, true, 'serviceBookings');

          case 7:
            oldServiceBookings = _context23.sent;
            _iteratorNormalCompletion2 = true;
            _didIteratorError2 = false;
            _iteratorError2 = undefined;
            _context23.prev = 11;
            _iterator2 = (0, _getIterator3.default)(oldServiceBookings);

          case 13:
            if (_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done) {
              _context23.next = 23;
              break;
            }

            sb = _step2.value;

            if (sb.isPlaceholder) {
              _context23.next = 20;
              break;
            }

            _context23.next = 18;
            return (0, _dbUtils.traversWithFilter)(1, 1, 'OUTBOUND', sb._id, true, 'transfers');

          case 18:
            transfer = _context23.sent;

            sb.transfer = transfer[0];

          case 20:
            _iteratorNormalCompletion2 = true;
            _context23.next = 13;
            break;

          case 23:
            _context23.next = 29;
            break;

          case 25:
            _context23.prev = 25;
            _context23.t0 = _context23['catch'](11);
            _didIteratorError2 = true;
            _iteratorError2 = _context23.t0;

          case 29:
            _context23.prev = 29;
            _context23.prev = 30;

            if (!_iteratorNormalCompletion2 && _iterator2.return) {
              _iterator2.return();
            }

          case 32:
            _context23.prev = 32;

            if (!_didIteratorError2) {
              _context23.next = 35;
              break;
            }

            throw _iteratorError2;

          case 35:
            return _context23.finish(32);

          case 36:
            return _context23.finish(29);

          case 37:
            _context23.next = 39;
            return oldServiceBookings.map(function (sb) {
              if (sb.isPlaceholder) {
                return 'sBK_' + sb._key;
              }
              return sb.transfer._key;
            });

          case 39:
            oldTransferKeys = _context23.sent;


            // Compare old transfers with the new selectedTransferKeys
            toBeRemoved = _lodash2.default.difference(oldTransferKeys, selectedTransferKeys);
            toBeAdded = _lodash2.default.difference(selectedTransferKeys, oldTransferKeys);

            // Remove all unmatched serviceBookings

            _iteratorNormalCompletion3 = true;
            _didIteratorError3 = false;
            _iteratorError3 = undefined;
            _context23.prev = 45;
            _loop = _regenerator2.default.mark(function _loop() {
              var transferKey, serviceBooking;
              return _regenerator2.default.wrap(function _loop$(_context22) {
                while (1) {
                  switch (_context22.prev = _context22.next) {
                    case 0:
                      transferKey = _step3.value;

                      if (!(transferKey.substring(0, 11) === 'placeholder')) {
                        _context22.next = 3;
                        break;
                      }

                      return _context22.abrupt('return', 'continue');

                    case 3:
                      // eslint-disable-line no-continue

                      serviceBooking = void 0;

                      if (transferKey.substring(0, 4) === 'sBK_') {
                        serviceBooking = oldServiceBookings.find(function (sb) {
                          return sb._key === transferKey.substring(4);
                        });
                      } else {
                        serviceBooking = oldServiceBookings.find(function (sb) {
                          return sb.transferKey === transferKey;
                        });
                      }
                      _context22.next = 7;
                      return serviceBookingsGraphCollection.remove(serviceBooking);

                    case 7:
                    case 'end':
                      return _context22.stop();
                  }
                }
              }, _loop, _this);
            });
            _iterator3 = (0, _getIterator3.default)(toBeRemoved);

          case 48:
            if (_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done) {
              _context23.next = 56;
              break;
            }

            return _context23.delegateYield(_loop(), 't1', 50);

          case 50:
            _ret = _context23.t1;

            if (!(_ret === 'continue')) {
              _context23.next = 53;
              break;
            }

            return _context23.abrupt('continue', 53);

          case 53:
            _iteratorNormalCompletion3 = true;
            _context23.next = 48;
            break;

          case 56:
            _context23.next = 62;
            break;

          case 58:
            _context23.prev = 58;
            _context23.t2 = _context23['catch'](45);
            _didIteratorError3 = true;
            _iteratorError3 = _context23.t2;

          case 62:
            _context23.prev = 62;
            _context23.prev = 63;

            if (!_iteratorNormalCompletion3 && _iterator3.return) {
              _iterator3.return();
            }

          case 65:
            _context23.prev = 65;

            if (!_didIteratorError3) {
              _context23.next = 68;
              break;
            }

            throw _iteratorError3;

          case 68:
            return _context23.finish(65);

          case 69:
            return _context23.finish(62);

          case 70:

            // Add new transfers that are not currently existing
            _iteratorNormalCompletion4 = true;
            _didIteratorError4 = false;
            _iteratorError4 = undefined;
            _context23.prev = 73;
            _iterator4 = (0, _getIterator3.default)(toBeAdded);

          case 75:
            if (_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done) {
              _context23.next = 98;
              break;
            }

            _transferKey = _step4.value;
            serviceBookingIndex = _lodash2.default.findIndex(serviceBookingData, { transferKey: _transferKey });
            newServiceBooking = serviceBookingData[serviceBookingIndex];

            // Read and inject route from transfer to a new serviceBooking

            if (newServiceBooking.isPlaceholder) {
              _context23.next = 86;
              break;
            }

            _context23.next = 82;
            return transferCollection.firstExample({ _key: _transferKey });

          case 82:
            _transfer = _context23.sent;


            if (!newServiceBooking.route) {
              newServiceBooking.route = {};
            }
            // this is so that refNo deosnt get removed from route
            newServiceBooking.route.from = _transfer.route.from.cityName;
            newServiceBooking.route.to = _transfer.route.to.cityName;
            // before this line from is object, but we replace it with cityName

          case 86:
            _context23.next = 88;
            return serviceBookingsCollection.save(newServiceBooking);

          case 88:
            _serviceBooking = _context23.sent;
            _context23.next = 91;
            return bookInEdgeCollection.save({}, 'transferPlacements/' + transferPlacementKey, _serviceBooking._id);

          case 91:

            // add pax to transfer
            addPAXtoServiceBooking(_serviceBooking._key);

            if (newServiceBooking.isPlaceholder) {
              _context23.next = 95;
              break;
            }

            _context23.next = 95;
            return useEdgeCollection.save({}, _serviceBooking._id, 'transfers/' + _transferKey);

          case 95:
            _iteratorNormalCompletion4 = true;
            _context23.next = 75;
            break;

          case 98:
            _context23.next = 104;
            break;

          case 100:
            _context23.prev = 100;
            _context23.t3 = _context23['catch'](73);
            _didIteratorError4 = true;
            _iteratorError4 = _context23.t3;

          case 104:
            _context23.prev = 104;
            _context23.prev = 105;

            if (!_iteratorNormalCompletion4 && _iterator4.return) {
              _iterator4.return();
            }

          case 107:
            _context23.prev = 107;

            if (!_didIteratorError4) {
              _context23.next = 110;
              break;
            }

            throw _iteratorError4;

          case 110:
            return _context23.finish(107);

          case 111:
            return _context23.finish(104);

          case 112:
            _context23.next = 114;
            return (0, _dbUtils.traversWithFilter)(1, 1, 'OUTBOUND', 'transferPlacements/' + transferPlacementKey, true, 'serviceBookings');

          case 114:
            newServiceBookings = _context23.sent;
            _iteratorNormalCompletion5 = true;
            _didIteratorError5 = false;
            _iteratorError5 = undefined;
            _context23.prev = 118;
            _iterator5 = (0, _getIterator3.default)(newServiceBookings);

          case 120:
            if (_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done) {
              _context23.next = 129;
              break;
            }

            _sb = _step5.value;
            _context23.next = 124;
            return (0, _dbUtils.traversWithFilter)(1, 1, 'OUTBOUND', _sb._id, true, 'transfers');

          case 124:
            _transfer2 = _context23.sent;

            _sb.transfer = _transfer2[0];
            // }

          case 126:
            _iteratorNormalCompletion5 = true;
            _context23.next = 120;
            break;

          case 129:
            _context23.next = 135;
            break;

          case 131:
            _context23.prev = 131;
            _context23.t4 = _context23['catch'](118);
            _didIteratorError5 = true;
            _iteratorError5 = _context23.t4;

          case 135:
            _context23.prev = 135;
            _context23.prev = 136;

            if (!_iteratorNormalCompletion5 && _iterator5.return) {
              _iterator5.return();
            }

          case 138:
            _context23.prev = 138;

            if (!_didIteratorError5) {
              _context23.next = 141;
              break;
            }

            throw _iteratorError5;

          case 141:
            return _context23.finish(138);

          case 142:
            return _context23.finish(135);

          case 143:
            serviceBookingOrder = [];
            _iteratorNormalCompletion6 = true;
            _didIteratorError6 = false;
            _iteratorError6 = undefined;
            _context23.prev = 147;

            _loop2 = function _loop2() {
              var transferKey = _step6.value;

              if (transferKey.substring(0, 4) === 'sBK_') {
                serviceBookingOrder.push(newServiceBookings.find(function (sb) {
                  return sb._key === transferKey.substring(4);
                }));
              } else {
                serviceBookingOrder.push(newServiceBookings.find(function (sb) {
                  return sb.transferKey === transferKey;
                }));
              }
            };

            for (_iterator6 = (0, _getIterator3.default)(selectedTransferKeys); !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
              _loop2();
            }
            _context23.next = 156;
            break;

          case 152:
            _context23.prev = 152;
            _context23.t5 = _context23['catch'](147);
            _didIteratorError6 = true;
            _iteratorError6 = _context23.t5;

          case 156:
            _context23.prev = 156;
            _context23.prev = 157;

            if (!_iteratorNormalCompletion6 && _iterator6.return) {
              _iterator6.return();
            }

          case 159:
            _context23.prev = 159;

            if (!_didIteratorError6) {
              _context23.next = 162;
              break;
            }

            throw _iteratorError6;

          case 162:
            return _context23.finish(159);

          case 163:
            return _context23.finish(156);

          case 164:
            _context23.next = 166;
            return transferPlacementsCollection.firstExample({ _key: transferPlacementKey });

          case 166:
            oldTransferPlacement = _context23.sent;
            _context23.next = 169;
            return transferPlacementsCollection.updateByExample({ _key: transferPlacementKey }, {
              serviceBookingOrder: serviceBookingOrder.map(function (sb) {
                return sb._key;
              }),
              durationDays: durationDays,
              startDate: startDate
            });

          case 169:
            _context23.next = 171;
            return transferPlacementsCollection.firstExample({ _key: transferPlacementKey });

          case 171:
            newTransferPlacement = _context23.sent;


            // start add pax to each service
            if (serviceBookingOrder.length > 0) {
              allPaxes = (0, _Pax.getProposalPaxs)(proposalKey);

              allPaxes.then(function (paxLists) {
                var paxToAdd = [];
                if (paxLists.length > 0) {
                  paxLists.map(function (px) {
                    // eslint-disable-line array-callback-return
                    paxToAdd.push(px._key);
                  });
                  if (paxToAdd.length > 0) {
                    serviceBookingOrder.map(function (sb) {
                      // eslint-disable-line array-callback-return
                      var sbKey = sb._key;
                      (0, _Tours.updateTourPaxs)({
                        serviceBookingKey: sbKey,
                        paxKeys: paxToAdd
                      });
                    });
                  }
                }
              });
            }
            // end add pax to each service

            // call the bbt re-calculation api to update cityday when durationDays changed.

            if (!(oldTransferPlacement && newTransferPlacement && oldTransferPlacement.durationDays !== newTransferPlacement.durationDays)) {
              _context23.next = 179;
              break;
            }

            _context23.next = 176;
            return getTripKeyByTransferPlacementKey(newTransferPlacement._key);

          case 176:
            tripKey = _context23.sent;
            _context23.next = 179;
            return (0, _request2.default)(_environment2.default.foxx.url + '/trips/recalculate-trip', _request.POST, { tripKey: tripKey });

          case 179:
            return _context23.abrupt('return', (0, _extends3.default)({}, newTransferPlacement, { serviceBookings: newServiceBookings }));

          case 182:
            _context23.prev = 182;
            _context23.t6 = _context23['catch'](4);

            console.log(_context23.t6.stack);
            return _context23.abrupt('return', null);

          case 186:
          case 'end':
            return _context23.stop();
        }
      }
    }, _callee22, this, [[4, 182], [11, 25, 29, 37], [30,, 32, 36], [45, 58, 62, 70], [63,, 65, 69], [73, 100, 104, 112], [105,, 107, 111], [118, 131, 135, 143], [136,, 138, 142], [147, 152, 156, 164], [157,, 159, 163]]);
  }));

  return function updateTransferPlacement(_x21) {
    return _ref22.apply(this, arguments);
  };
}();

var getTripKeyByTransferPlacementKey = function () {
  var _ref24 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee23(transferPlacementKey) {
    var aqlQuery, result;
    return _regenerator2.default.wrap(function _callee23$(_context24) {
      while (1) {
        switch (_context24.prev = _context24.next) {
          case 0:
            aqlQuery = '\n    FOR vertex, edge\n    IN 3..3 INBOUND @vertexId\n    GRAPH \'exo-dev\'\n    FILTER\n      IS_SAME_COLLECTION(\'trips\', vertex)\n    RETURN vertex._key\n  ';
            _context24.next = 3;
            return _database.db.query(aqlQuery, { vertexId: 'transferPlacements/' + transferPlacementKey });

          case 3:
            result = _context24.sent;
            return _context24.abrupt('return', result.next());

          case 5:
          case 'end':
            return _context24.stop();
        }
      }
    }, _callee23, this);
  }));

  return function getTripKeyByTransferPlacementKey(_x22) {
    return _ref24.apply(this, arguments);
  };
}();

// update local transfers


var updateLocalTransferPlacement = function () {
  var _ref25 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee24(_ref26) {
    var _this2 = this;

    var selectedTransferKeys = _ref26.selectedTransferKeys,
        transferPlacementKey = _ref26.transferPlacementKey,
        durationDays = _ref26.durationDays,
        serviceBookingData = _ref26.serviceBookingData,
        n_city_key = _ref26.n_city_key,
        n_day_id = _ref26.n_day_id,
        n_remove_local_transferPlacementKey = _ref26.n_remove_local_transferPlacementKey,
        proposalKey = _ref26.proposalKey;

    var transferPlacementsCollection, serviceBookingsCollection, oldTransferKeys, toBeAdded, returnLocalTransferAdded, _iteratorNormalCompletion7, _didIteratorError7, _iteratorError7, _loop3, _iterator7, _step7, newServiceBookings, _iteratorNormalCompletion8, _didIteratorError8, _iteratorError8, _iterator8, _step8, sb, transfer, serviceBookingOrder, _iteratorNormalCompletion9, _didIteratorError9, _iteratorError9, _loop4, _iterator9, _step9, newTransferPlacement;

    return _regenerator2.default.wrap(function _callee24$(_context26) {
      while (1) {
        switch (_context26.prev = _context26.next) {
          case 0:
            // eslint-disable-line no-unused-vars
            transferPlacementsCollection = _database.db.collection('transferPlacements');
            serviceBookingsCollection = _database.db.collection('serviceBookings');
            // if it is from change local transfer then remove that first remove

            if (!(n_remove_local_transferPlacementKey && n_remove_local_transferPlacementKey !== '')) {
              _context26.next = 11;
              break;
            }

            _context26.prev = 3;
            _context26.next = 6;
            return serviceBookingsCollection.remove({ _key: n_remove_local_transferPlacementKey });

          case 6:
            _context26.next = 11;
            break;

          case 8:
            _context26.prev = 8;
            _context26.t0 = _context26['catch'](3);

            console.log(_context26.t0.stack);

          case 11:
            _context26.prev = 11;
            oldTransferKeys = [];
            toBeAdded = _lodash2.default.difference(selectedTransferKeys, oldTransferKeys);
            returnLocalTransferAdded = [];

            // Add new transfers that are not currently existing

            _iteratorNormalCompletion7 = true;
            _didIteratorError7 = false;
            _iteratorError7 = undefined;
            _context26.prev = 18;
            _loop3 = _regenerator2.default.mark(function _loop3() {
              var transferKey, serviceBookingIndex, newServiceBooking, serviceBooking, t_transfer, ret, allPaxes;
              return _regenerator2.default.wrap(function _loop3$(_context25) {
                while (1) {
                  switch (_context25.prev = _context25.next) {
                    case 0:
                      transferKey = _step7.value;
                      serviceBookingIndex = _lodash2.default.findIndex(serviceBookingData, { transferKey: transferKey });
                      newServiceBooking = serviceBookingData[serviceBookingIndex];

                      // add serviceBookingType as localtransfer // added on 18th august for local transfer

                      newServiceBooking.serviceBookingType = 'localtransfer';

                      _context25.next = 6;
                      return serviceBookingsCollection.save(newServiceBooking);

                    case 6:
                      serviceBooking = _context25.sent;
                      _context25.next = 9;
                      return getTransfersByKey(newServiceBooking.transferKey);

                    case 9:
                      t_transfer = _context25.sent;
                      // eslint-disable-line no-unused-vars
                      // ----start-----prepare return data
                      ret = newServiceBooking;
                      _context25.next = 13;
                      return getTransfersByKey(newServiceBooking.transferKey);

                    case 13:
                      ret.localtransfer = _context25.sent;

                      returnLocalTransferAdded.push(ret);
                      // ----end-------prepare return data
                      _context25.next = 17;
                      return bookInEdgeCollection.save({}, 'cityDays/' + n_day_id, serviceBooking._id);

                    case 17:

                      // add pax to transfer
                      addPAXtoServiceBooking(serviceBooking._key);

                      // start add pax to each service
                      if (serviceBooking._key) {
                        allPaxes = (0, _Pax.getProposalPaxs)(proposalKey);

                        allPaxes.then(function (paxLists) {
                          var paxToAdd = [];
                          if (paxLists.length > 0) {
                            paxLists.map(function (px) {
                              // eslint-disable-line array-callback-return
                              paxToAdd.push(px._key);
                            });
                            if (paxToAdd.length > 0) {
                              (0, _Tours.updateTourPaxs)({
                                serviceBookingKey: serviceBooking._key,
                                paxKeys: paxToAdd
                              });
                            }
                          }
                        });
                      }
                      // end add pax to each service

                      if (newServiceBooking.isPlaceholder) {
                        _context25.next = 22;
                        break;
                      }

                      _context25.next = 22;
                      return useEdgeCollection.save({}, serviceBooking._id, 'transfers/' + transferKey);

                    case 22:
                    case 'end':
                      return _context25.stop();
                  }
                }
              }, _loop3, _this2);
            });
            _iterator7 = (0, _getIterator3.default)(toBeAdded);

          case 21:
            if (_iteratorNormalCompletion7 = (_step7 = _iterator7.next()).done) {
              _context26.next = 26;
              break;
            }

            return _context26.delegateYield(_loop3(), 't1', 23);

          case 23:
            _iteratorNormalCompletion7 = true;
            _context26.next = 21;
            break;

          case 26:
            _context26.next = 32;
            break;

          case 28:
            _context26.prev = 28;
            _context26.t2 = _context26['catch'](18);
            _didIteratorError7 = true;
            _iteratorError7 = _context26.t2;

          case 32:
            _context26.prev = 32;
            _context26.prev = 33;

            if (!_iteratorNormalCompletion7 && _iterator7.return) {
              _iterator7.return();
            }

          case 35:
            _context26.prev = 35;

            if (!_didIteratorError7) {
              _context26.next = 38;
              break;
            }

            throw _iteratorError7;

          case 38:
            return _context26.finish(35);

          case 39:
            return _context26.finish(32);

          case 40:
            _context26.next = 42;
            return (0, _dbUtils.traversWithFilter)(1, 1, 'OUTBOUND', 'transferPlacements/' + transferPlacementKey, true, 'serviceBookings');

          case 42:
            newServiceBookings = _context26.sent;
            _iteratorNormalCompletion8 = true;
            _didIteratorError8 = false;
            _iteratorError8 = undefined;
            _context26.prev = 46;
            _iterator8 = (0, _getIterator3.default)(newServiceBookings);

          case 48:
            if (_iteratorNormalCompletion8 = (_step8 = _iterator8.next()).done) {
              _context26.next = 57;
              break;
            }

            sb = _step8.value;
            _context26.next = 52;
            return (0, _dbUtils.traversWithFilter)(1, 1, 'OUTBOUND', sb._id, true, 'transfers');

          case 52:
            transfer = _context26.sent;

            sb.transfer = transfer[0];
            // }

          case 54:
            _iteratorNormalCompletion8 = true;
            _context26.next = 48;
            break;

          case 57:
            _context26.next = 63;
            break;

          case 59:
            _context26.prev = 59;
            _context26.t3 = _context26['catch'](46);
            _didIteratorError8 = true;
            _iteratorError8 = _context26.t3;

          case 63:
            _context26.prev = 63;
            _context26.prev = 64;

            if (!_iteratorNormalCompletion8 && _iterator8.return) {
              _iterator8.return();
            }

          case 66:
            _context26.prev = 66;

            if (!_didIteratorError8) {
              _context26.next = 69;
              break;
            }

            throw _iteratorError8;

          case 69:
            return _context26.finish(66);

          case 70:
            return _context26.finish(63);

          case 71:
            serviceBookingOrder = [];
            _iteratorNormalCompletion9 = true;
            _didIteratorError9 = false;
            _iteratorError9 = undefined;
            _context26.prev = 75;

            _loop4 = function _loop4() {
              var transferKey = _step9.value;

              if (transferKey.substring(0, 4) === 'sBK_') {
                serviceBookingOrder.push(newServiceBookings.find(function (sb) {
                  return sb._key === transferKey.substring(4);
                }));
              } else {
                serviceBookingOrder.push(newServiceBookings.find(function (sb) {
                  return sb.transferKey === transferKey;
                }));
              }
            };

            for (_iterator9 = (0, _getIterator3.default)(selectedTransferKeys); !(_iteratorNormalCompletion9 = (_step9 = _iterator9.next()).done); _iteratorNormalCompletion9 = true) {
              _loop4();
            }

            // Return the updated transferPlacements all the way down to serviceBooking
            _context26.next = 84;
            break;

          case 80:
            _context26.prev = 80;
            _context26.t4 = _context26['catch'](75);
            _didIteratorError9 = true;
            _iteratorError9 = _context26.t4;

          case 84:
            _context26.prev = 84;
            _context26.prev = 85;

            if (!_iteratorNormalCompletion9 && _iterator9.return) {
              _iterator9.return();
            }

          case 87:
            _context26.prev = 87;

            if (!_didIteratorError9) {
              _context26.next = 90;
              break;
            }

            throw _iteratorError9;

          case 90:
            return _context26.finish(87);

          case 91:
            return _context26.finish(84);

          case 92:
            _context26.next = 94;
            return transferPlacementsCollection.firstExample({ _key: transferPlacementKey });

          case 94:
            newTransferPlacement = _context26.sent;
            return _context26.abrupt('return', (0, _extends3.default)({}, newTransferPlacement, { serviceBookings: newServiceBookings }));

          case 98:
            _context26.prev = 98;
            _context26.t5 = _context26['catch'](11);

            console.log(_context26.t5.stack);
            return _context26.abrupt('return', {});

          case 102:
          case 'end':
            return _context26.stop();
        }
      }
    }, _callee24, this, [[3, 8], [11, 98], [18, 28, 32, 40], [33,, 35, 39], [46, 59, 63, 71], [64,, 66, 70], [75, 80, 84, 92], [85,, 87, 91]]);
  }));

  return function updateLocalTransferPlacement(_x23) {
    return _ref25.apply(this, arguments);
  };
}();

// add pax to transfer


var addPAXtoServiceBooking = function () {
  var _ref27 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee25(serviceBookingKey) {
    var aqlQuery;
    return _regenerator2.default.wrap(function _callee25$(_context27) {
      while (1) {
        switch (_context27.prev = _context27.next) {
          case 0:
            aqlQuery = '\n  LET serviceBookingId = CONCAT(\'serviceBookings/\', @serviceBookingKey)\n  FOR trip IN 4..4 INBOUND serviceBookingId GRAPH \'exo-dev\'\n  FOR paxs IN 1..1 OUTBOUND trip._id GRAPH \'exo-dev\'\n    FILTER IS_SAME_COLLECTION(\'paxs\', paxs)\n    INSERT { _from: serviceBookingId, _to: paxs._id } IN participate';
            _context27.next = 3;
            return _database.db.query(aqlQuery, { serviceBookingKey: serviceBookingKey });

          case 3:
          case 'end':
            return _context27.stop();
        }
      }
    }, _callee25, this);
  }));

  return function addPAXtoServiceBooking(_x24) {
    return _ref27.apply(this, arguments);
  };
}();

// remove local transfer


var removeLocalTransfer = function () {
  var _ref28 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee26(_ref29) {
    var serviceBookingKey = _ref29.serviceBookingKey;
    var serviceBookingsCollection;
    return _regenerator2.default.wrap(function _callee26$(_context28) {
      while (1) {
        switch (_context28.prev = _context28.next) {
          case 0:
            serviceBookingsCollection = _database.db.collection('serviceBookings');
            _context28.prev = 1;
            _context28.next = 4;
            return (0, _ServiceBooking.remove)(serviceBookingKey);

          case 4:
            return _context28.abrupt('return', { serviceBookingKey: serviceBookingKey });

          case 7:
            _context28.prev = 7;
            _context28.t0 = _context28['catch'](1);

            console.log(_context28.t0.stack);
            return _context28.abrupt('return', {});

          case 11:
          case 'end':
            return _context28.stop();
        }
      }
    }, _callee26, this, [[1, 7]]);
  }));

  return function removeLocalTransfer(_x25) {
    return _ref28.apply(this, arguments);
  };
}();

var getTransferPlacements = function () {
  var _ref32 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee28(vertexId) {
    var aqlQuery, result;
    return _regenerator2.default.wrap(function _callee28$(_context30) {
      while (1) {
        switch (_context30.prev = _context30.next) {
          case 0:
            aqlQuery = '\n    FOR vertex, edge\n    IN 1..1 OUTBOUND @vertexId\n    GRAPH \'exo-dev\'\n    FILTER\n      IS_SAME_COLLECTION(\'transferPlacements\', vertex) AND\n      IS_SAME_COLLECTION(\'transfer\', edge)\n    RETURN vertex\n  ';
            _context30.next = 3;
            return _database.db.query(aqlQuery, { vertexId: vertexId });

          case 3:
            result = _context30.sent;
            return _context30.abrupt('return', result.all());

          case 5:
          case 'end':
            return _context30.stop();
        }
      }
    }, _callee28, this);
  }));

  return function getTransferPlacements(_x27) {
    return _ref32.apply(this, arguments);
  };
}();

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _request = require('../../../utils/request');

var _request2 = _interopRequireDefault(_request);

var _database = require('../../database');

var _dbUtils = require('../../../utils/dbUtils');

var _environment = require('../../../config/environment');

var _environment2 = _interopRequireDefault(_environment);

var _ServiceBooking = require('../../ServiceBooking/controllers/ServiceBooking');

var _Pax = require('../../Pax/controllers/Pax');

var _Tours = require('../../Tour/controllers/Tours');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* eslint-disable no-console */
var graph = _database.db.graph(_environment2.default.arango.databaseName);
var transferPlacementsCollection = _database.db.collection('transferPlacements');
var cityBookings = _database.db.collection('cityBookings');
var transfers = _database.db.collection('transfers');
var countryBookings = _database.db.collection('countryBookings');
var locationCollection = _database.db.collection('locationCollection');
var transferEdgeCollection = _database.db.edgeCollection('transfer');
var bookInEdgeCollection = _database.db.edgeCollection('bookIn');
var useEdgeCollection = _database.db.edgeCollection('use');
var locatedInEdgeCollection = _database.db.edgeCollection('locatedIn');
var transferPlacements = graph.vertexCollection('transferPlacements');

var remove = function () {
  var _ref30 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee27(transferPlacementKey) {
    var serviceBookings;
    return _regenerator2.default.wrap(function _callee27$(_context29) {
      while (1) {
        switch (_context29.prev = _context29.next) {
          case 0:
            _context29.next = 2;
            return (0, _ServiceBooking.getServiceBookings)('transferPlacements/' + transferPlacementKey);

          case 2:
            serviceBookings = _context29.sent;
            _context29.next = 5;
            return _promise2.default.all(serviceBookings.map(function (_ref31) {
              var _key = _ref31._key;
              return (0, _ServiceBooking.remove)(_key);
            }));

          case 5:
            return _context29.abrupt('return', transferPlacements.remove(transferPlacementKey));

          case 6:
          case 'end':
            return _context29.stop();
        }
      }
    }, _callee27, undefined);
  }));

  return function remove(_x26) {
    return _ref30.apply(this, arguments);
  };
}();

exports.addDepartureTransferPlacement = addDepartureTransferPlacement;
exports.addTransferPlacement = addTransferPlacement;
exports.getTransferPlacement = getTransferPlacement;
exports.getTransferStatus = getTransferStatus;
exports.getTransferByServiceBookingKey = getTransferByServiceBookingKey;
exports.getTransferPlacementByCountryBookingKey = getTransferPlacementByCountryBookingKey;
exports.getCityBookingByTransferPlacementKey = getCityBookingByTransferPlacementKey;
exports.getCityLocationByTransferPlacementKey = getCityLocationByTransferPlacementKey;
exports.getTransferPlacementByCityBookingKey = getTransferPlacementByCityBookingKey;
exports.clearTransferPlacement = clearTransferPlacement;
exports.addServiceBooking = addServiceBooking;
exports.removeServiceBooking = removeServiceBooking;
exports.updateTransferPlacement = updateTransferPlacement;
exports.updateLocalTransferPlacement = updateLocalTransferPlacement;
exports.getTransfersByKey = getTransfersByKey;
exports.removeLocalTransfer = removeLocalTransfer;
exports.remove = remove;
exports.getTransferPlacements = getTransferPlacements;
exports.getAllDBTransfers = getAllDBTransfers;