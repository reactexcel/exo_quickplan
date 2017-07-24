'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getTransferAvailability = exports.getTourAvailability = undefined;

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _request = require('../../../utils/request');

var _request2 = _interopRequireDefault(_request);

var _environment = require('../../../config/environment');

var _environment2 = _interopRequireDefault(_environment);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function getTourAvailability(args) {
  return (0, _request2.default)(_environment2.default.foxx.url + '/touravailability', _request.POST, (0, _extends3.default)({}, args));
}

function getTransferAvailability(args) {
  var agentID = _environment2.default.agent.id;
  var password = _environment2.default.agent.password;
  var result = (0, _request2.default)(_environment2.default.foxx.url + '/servicebooking/check-services-availability', _request.POST, {
    id: args.transferPlacementId
  });
  return result;
  // return request(`${config.foxx.url}/transferavailability`, POST, {
  //   agentID,
  //   password,
  //   ...args
  // });
}

exports.getTourAvailability = getTourAvailability;
exports.getTransferAvailability = getTransferAvailability;