'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ProposalMutation = exports.ProposalType = undefined;

var _Proposal = require('./types/Proposal');

var _Proposal2 = _interopRequireDefault(_Proposal);

var _Proposal3 = require('./mutations/Proposal');

var _Proposal4 = _interopRequireDefault(_Proposal3);

var _UpdateProposalDetails = require('./mutations/UpdateProposalDetails');

var _UpdateProposalDetails2 = _interopRequireDefault(_UpdateProposalDetails);

var _AssignTC = require('./mutations/AssignTC');

var _AssignTC2 = _interopRequireDefault(_AssignTC);

var _Clone = require('./mutations/Clone');

var _Clone2 = _interopRequireDefault(_Clone);

var _Remove = require('./mutations/Remove');

var _Remove2 = _interopRequireDefault(_Remove);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var proposalType = _Proposal2.default;
var exportedProposalMutation = {
  addProposal: _Proposal4.default,
  cloneProposal: _Clone2.default,
  updateProposalDetails: _UpdateProposalDetails2.default,
  assignTC: _AssignTC2.default,
  RemoveProposal: _Remove2.default
};

exports.ProposalType = proposalType;
exports.ProposalMutation = exportedProposalMutation;