'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SupplierMutation = exports.AccessibleSupplierType = exports.CheckSupplierPaxStatusQuery = exports.AccessibleSupplierQuery = exports.AccommodationPlacementQuery = undefined;

var _AccessibleSuppliers = require('./queries/AccessibleSuppliers');

var _AccessibleSuppliers2 = _interopRequireDefault(_AccessibleSuppliers);

var _CheckSupplierPaxStatus = require('./queries/CheckSupplierPaxStatus');

var _CheckSupplierPaxStatus2 = _interopRequireDefault(_CheckSupplierPaxStatus);

var _AccommodationPlacement = require('./queries/AccommodationPlacement');

var _AccommodationPlacement2 = _interopRequireDefault(_AccommodationPlacement);

var _AccessibleSupplier = require('./types/AccessibleSupplier');

var _AccessibleSupplier2 = _interopRequireDefault(_AccessibleSupplier);

var _UpdateAccommodationPlacement = require('./mutations/UpdateAccommodationPlacement');

var _UpdateAccommodationPlacement2 = _interopRequireDefault(_UpdateAccommodationPlacement);

var _AddRoomConfig = require('./mutations/AddRoomConfig');

var _AddRoomConfig2 = _interopRequireDefault(_AddRoomConfig);

var _RemoveRoomConfig = require('./mutations/RemoveRoomConfig');

var _RemoveRoomConfig2 = _interopRequireDefault(_RemoveRoomConfig);

var _UpdateRoomConfig = require('./mutations/UpdateRoomConfig');

var _UpdateRoomConfig2 = _interopRequireDefault(_UpdateRoomConfig);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var exportedSupplierMutation = {
  updateAccommodationPlacement: _UpdateAccommodationPlacement2.default,
  addRoomConfig: _AddRoomConfig2.default,
  removeRoomConfig: _RemoveRoomConfig2.default,
  updateRoomConfig: _UpdateRoomConfig2.default
};
exports.AccommodationPlacementQuery = _AccommodationPlacement2.default;
exports.AccessibleSupplierQuery = _AccessibleSuppliers2.default;
exports.CheckSupplierPaxStatusQuery = _CheckSupplierPaxStatus2.default;
exports.AccessibleSupplierType = _AccessibleSupplier2.default;
exports.SupplierMutation = exportedSupplierMutation;