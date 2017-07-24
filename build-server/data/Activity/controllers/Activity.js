'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getActivities = exports.remove = undefined;

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

/**
 * Get vertex-activity edges (records)
 * @param {string} vertexId
 * @return {Promise.<Error,object[]>}
 */
var getActivities = function () {
  var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(vertexId) {
    var aqlQuery, result;
    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            aqlQuery = '\n    FOR activity, edge\n    IN 1..1 OUTBOUND @vertexId \n    GRAPH \'exo-dev\'\n    FILTER \n      IS_SAME_COLLECTION(\'activities\', activity) AND\n      IS_SAME_COLLECTION(\'records\', edge)\n    RETURN activity\n  ';
            _context.next = 3;
            return _database.db.query(aqlQuery, { vertexId: vertexId });

          case 3:
            result = _context.sent;
            return _context.abrupt('return', result.all());

          case 5:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this);
  }));

  return function getActivities(_x) {
    return _ref.apply(this, arguments);
  };
}();

var _database = require('../../database');

var _environment = require('../../../config/environment');

var _environment2 = _interopRequireDefault(_environment);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var graph = _database.db.graph(_environment2.default.arango.databaseName);
var activities = graph.vertexCollection('serviceBookings');

var remove = function remove(activityKey) {
  return activities.remove(activityKey);
};exports.remove = remove;
exports.getActivities = getActivities;