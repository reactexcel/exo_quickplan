'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.GetAccessibleTransfersQuery = exports.TransferPlacementQuery = exports.TransferPlacementMutation = exports.TransferPlacementType = undefined;

var _TransferPlacement = require('./types/TransferPlacement');

var _TransferPlacement2 = _interopRequireDefault(_TransferPlacement);

var _TransferPlacement3 = require('./mutations/TransferPlacement');

var _TransferPlacement4 = _interopRequireDefault(_TransferPlacement3);

var _ClearTransferPlacement = require('./mutations/ClearTransferPlacement');

var _ClearTransferPlacement2 = _interopRequireDefault(_ClearTransferPlacement);

var _TransferPlacement5 = require('./queries/TransferPlacement');

var _TransferPlacement6 = _interopRequireDefault(_TransferPlacement5);

var _AccessibleTransfers = require('./queries/AccessibleTransfers');

var _AccessibleTransfers2 = _interopRequireDefault(_AccessibleTransfers);

var _AddServiceBooking = require('./mutations/AddServiceBooking');

var _AddServiceBooking2 = _interopRequireDefault(_AddServiceBooking);

var _RemoveServiceBooking = require('./mutations/RemoveServiceBooking');

var _RemoveServiceBooking2 = _interopRequireDefault(_RemoveServiceBooking);

var _UpdateTransferPlacement = require('./mutations/UpdateTransferPlacement');

var _UpdateTransferPlacement2 = _interopRequireDefault(_UpdateTransferPlacement);

var _RemoveLocalTransfer = require('./mutations/RemoveLocalTransfer');

var _RemoveLocalTransfer2 = _interopRequireDefault(_RemoveLocalTransfer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var proposalType = _TransferPlacement2.default;
var exportedTransferPlacementMutation = {
  addTransferPlacement: _TransferPlacement4.default,
  addServiceBooking: _AddServiceBooking2.default,
  removeServiceBooking: _RemoveServiceBooking2.default,
  updateTransferPlacement: _UpdateTransferPlacement2.default,
  clearTransferPlacement: _ClearTransferPlacement2.default,
  removeLocalTransfer: _RemoveLocalTransfer2.default
};

exports.TransferPlacementType = proposalType;
exports.TransferPlacementMutation = exportedTransferPlacementMutation;
exports.TransferPlacementQuery = _TransferPlacement6.default;
exports.GetAccessibleTransfersQuery = _AccessibleTransfers2.default;