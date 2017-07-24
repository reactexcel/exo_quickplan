'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.db = exports.connect = undefined;

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var connect = function () {
  var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee() {
    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;

            if (!_environment2.default.seed) {
              _context.next = 7;
              break;
            }

            _context.next = 4;
            return _createDatabase(_environment2.default.arango.databaseName);

          case 4:
            db.useDatabase(_environment2.default.arango.databaseName);
            _context.next = 8;
            break;

          case 7:
            db.useDatabase(_environment2.default.arango.databaseName);

          case 8:
            if (!_environment2.default.createGraph) {
              _context.next = 11;
              break;
            }

            _context.next = 11;
            return _createGraph(exoGraph);

          case 11:
            console.log('Database has been connected');

            (0, _crontab2.default)();
            _context.next = 18;
            break;

          case 15:
            _context.prev = 15;
            _context.t0 = _context['catch'](0);

            console.error(_context.t0.stack);

          case 18:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this, [[0, 15]]);
  }));

  return function connect() {
    return _ref.apply(this, arguments);
  };
}();

// Create a database


var _createDatabase = function () {
  var _ref2 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee2(databaseName) {
    var listDatabases;
    return _regenerator2.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.next = 2;
            return db.listDatabases();

          case 2:
            listDatabases = _context2.sent;

            if (!(listDatabases.indexOf(databaseName) !== -1)) {
              _context2.next = 6;
              break;
            }

            _context2.next = 6;
            return db.dropDatabase(databaseName);

          case 6:
            _context2.next = 8;
            return db.createDatabase(databaseName);

          case 8:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, this);
  }));

  return function _createDatabase(_x) {
    return _ref2.apply(this, arguments);
  };
}();

// Create Exo-Create Graph


var _createGraph = function () {
  var _ref3 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee3(graphName) {
    var graph, _exoGraph;

    return _regenerator2.default.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.prev = 0;
            _context3.next = 3;
            return db.graph(graphName);

          case 3:
            graph = _context3.sent;

            graph.drop();
            // Create new graph.
            _exoGraph = db.graph(graphName);
            _context3.next = 8;
            return _exoGraph.create(graphDef);

          case 8:
            _context3.next = 13;
            break;

          case 10:
            _context3.prev = 10;
            _context3.t0 = _context3['catch'](0);

            console.log(_context3.t0.stack);

          case 13:
          case 'end':
            return _context3.stop();
        }
      }
    }, _callee3, this, [[0, 10]]);
  }));

  return function _createGraph(_x2) {
    return _ref3.apply(this, arguments);
  };
}();

var _arangojs = require('arangojs');

var _environment = require('../config/environment');

var _environment2 = _interopRequireDefault(_environment);

var _crontab = require('../crontab');

var _crontab2 = _interopRequireDefault(_crontab);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var db = new _arangojs.Database({ url: _environment2.default.arango.url }); /* eslint-disable no-use-before-define, no-shadow, no-console */

var exoGraph = _environment2.default.arango.databaseName;

var graphDef = {
  edgeDefinitions: [{
    collection: 'bookIn',
    from: ['proposals', 'trips', 'countryBookings', 'cityBookings', 'accommodationPlacements', 'cityDays', 'serviceBookings', 'transferPlacements'],
    to: ['trips', 'countryBookings', 'cityBookings', 'accommodationPlacements', 'cityDays', 'serviceBookings', 'roomConfigs', 'transferPlacements']
  }, {
    collection: 'use',
    from: ['serviceBookings', 'accommodationPlacements'],
    to: ['suppliers', 'tours', 'accommodations']
  }, {
    collection: 'preselect',
    from: ['accommodationPlacements', 'cityDays', 'transferPlacements'],
    to: ['accommodations', 'tours', 'transfers']
  }, {
    collection: 'supply',
    from: ['suppliers'],
    to: ['accommodations', 'tours', 'transfers']
  }, {
    collection: 'participate',
    from: ['proposals', 'trips', 'countryBookings', 'serviceBookings', 'roomConfigs'],
    to: ['paxs']
  }, {
    collection: 'transfer',
    from: ['cityBookings', 'transferPlacements', 'trips'],
    to: ['transferPlacements', 'cityBookings', 'trips']
  }, {
    collection: 'locatedIn',
    from: ['offices', 'locations', 'proposals', 'trips', 'countryBookings', 'tours', 'accommodations'],
    to: ['locations']
  }, {
    collection: 'workedBy',
    from: ['proposals'],
    to: ['users']
  }, {
    collection: 'worksFor',
    from: ['users'],
    to: ['offices']
  }, {
    collection: 'records',
    from: ['serviceBookings', 'countryBookings', 'paxs', 'trips'],
    to: ['activities']
  }, {
    collection: 'selectedFor',
    from: ['offices'],
    to: ['tours']
  }, {
    collection: 'error',
    from: ['roomConfigs'],
    to: ['paxs']
  }],
  orphanCollections: ['currencyRates']
};

exports.connect = connect;
exports.db = db;