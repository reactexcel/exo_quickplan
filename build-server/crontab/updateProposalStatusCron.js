'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

// query the proposal already started.
var updateProposalStatus = function () {
  var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee() {
    var aqlQuery, result;
    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            // query all started proposals with the status didn't Archived
            aqlQuery = '\n  FOR proposal IN proposals\n  FILTER proposal.status != \'Archived\' AND IS_DATESTRING(proposal.startTravelOnDate)\n     AND DATE_DIFF( DATE_TIMESTAMP(proposal.startTravelOnDate), DATE_NOW(), \'d\', true) >= 0\n     LET proposalStartedDays = DATE_DIFF( DATE_TIMESTAMP(proposal.startTravelOnDate), DATE_NOW(), \'d\', true)\n     LET status = proposal.travelDuration != null && proposal.travelDuration > 0\n        && proposal.travelDuration < proposalStartedDays ? \'Archived\' : \'On Tour\'\n     UPDATE proposal WITH { status:  status } IN proposals\n  ';
            _context.prev = 1;
            _context.next = 4;
            return _database.db.query(aqlQuery);

          case 4:
            result = _context.sent;
            _context.next = 7;
            return result.next();

          case 7:
            return _context.abrupt('return', _context.sent);

          case 10:
            _context.prev = 10;
            _context.t0 = _context['catch'](1);

            console.log('updateProposalStatus failed', _context.t0);
            return _context.abrupt('return', null);

          case 14:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this, [[1, 10]]);
  }));

  return function updateProposalStatus() {
    return _ref.apply(this, arguments);
  };
}();

var _database = require('../data/database');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var proposals = _database.db.collection('proposals');exports.default = {
  expression: '*/30 * * * *',
  func: updateProposalStatus,
  immediateStart: true
};