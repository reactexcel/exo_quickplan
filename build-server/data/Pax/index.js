'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PaxMutation = exports.PaxsQuery = exports.PaxType = undefined;

var _Pax = require('./types/Pax');

var _Pax2 = _interopRequireDefault(_Pax);

var _GetPaxs = require('./queries/GetPaxs');

var _GetPaxs2 = _interopRequireDefault(_GetPaxs);

var _AddPax = require('./mutations/AddPax');

var _AddPax2 = _interopRequireDefault(_AddPax);

var _UpdatePax = require('./mutations/UpdatePax');

var _UpdatePax2 = _interopRequireDefault(_UpdatePax);

var _DeletePax = require('./mutations/DeletePax');

var _DeletePax2 = _interopRequireDefault(_DeletePax);

var _UpdateProposalMainPax = require('./mutations/UpdateProposalMainPax');

var _UpdateProposalMainPax2 = _interopRequireDefault(_UpdateProposalMainPax);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var exportedPaxMutation = {
  addPax: _AddPax2.default,
  updatePax: _UpdatePax2.default,
  deletePax: _DeletePax2.default,
  updateProposalMainPax: _UpdateProposalMainPax2.default
};

exports.PaxType = _Pax2.default;
exports.PaxsQuery = _GetPaxs2.default;
exports.PaxMutation = exportedPaxMutation;