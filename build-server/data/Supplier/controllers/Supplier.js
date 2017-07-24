'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.updatePAXStatuses = exports.getAccommodationPlacement = exports.checkPaxStatus = exports.updateRoomConfig = exports.removeRoomConfig = exports.addRoomConfig = exports.getRoomConfigs = exports.updateAccommodationPlacement = exports.getAccessibleSuppliers = undefined;

var _taggedTemplateLiteral2 = require('babel-runtime/helpers/taggedTemplateLiteral');

var _taggedTemplateLiteral3 = _interopRequireDefault(_taggedTemplateLiteral2);

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _templateObject = (0, _taggedTemplateLiteral3.default)(['\n      LET theAccommodationPlacements = (\n          FOR accommodationPlacement IN accommodationPlacements\n      \t    FILTER accommodationPlacement._id == CONCAT("accommodationPlacements/", ', ')\n      \t\tLET supplyEdges = (FOR vertex, edge IN OUTBOUND accommodationPlacement._id use RETURN edge)\n      \t\tRETURN MERGE(accommodationPlacement, {supplier: FIRST(\n      \t\t    FOR supplyEdge IN supplyEdges\n      \t\t\t    FOR supplier IN suppliers\n      \t\t\t\t    FILTER supplyEdge._to == supplier._id\n      \t\t\t\t    RETURN supplier)}, {images: FIRST(\n      \t\t\t\t\t    FOR supplyEdge IN supplyEdges\n      \t\t\t\t\t\t\tFOR supplier IN suppliers\n      \t\t\t\t\t\t\t\tFILTER supplyEdge._to == supplier._id\n      \t\t\t\t\t\t\t\tRETURN supplier.images)}, { serviceBookings: (\n      \t\t\t\t\t\t\t\t\tLET serviceBookingIds = (FOR vertex, edge IN OUTBOUND CONCAT("accommodationPlacements/", ', ') bookIn RETURN edge)\n      \t\t\t\t\t\t\t\t\tFOR serviceBookingId IN serviceBookingIds\n      \t\t\t\t\t\t\t\t\tFOR serviceBooking IN serviceBookings\n      \t\t\t\t\t\t\t\t\t\tFILTER serviceBooking._id == serviceBookingId._to\n      \t\t\t\t\t\t\t\t\t\tRETURN MERGE(serviceBooking, {inactive: serviceBookingId.inactive}, { accommodation: FIRST(\n      \t\t\t\t\t\t\t\t\t\t\tLET accommodationIds = (FOR vertex, edge IN OUTBOUND serviceBooking._id use RETURN edge)\n      \t\t\t\t\t\t\t\t\t\t\tFOR accommodationId IN accommodationIds\n      \t\t\t\t\t\t\t\t\t\t\tFOR accommodation IN accommodations\n      \t\t\t\t\t\t\t\t\t\t\t\tFILTER accommodation._id == accommodationId._to\n      \t\t\t\t\t\t\t\t\t\t\t\tRETURN accommodation\n      \t\t\t\t\t\t\t\t\t\t)})\n      \t\t\t\t    )})\n      \t\t)\n      RETURN FIRST(theAccommodationPlacements)\n      '], ['\n      LET theAccommodationPlacements = (\n          FOR accommodationPlacement IN accommodationPlacements\n      \t    FILTER accommodationPlacement._id == CONCAT("accommodationPlacements/", ', ')\n      \t\tLET supplyEdges = (FOR vertex, edge IN OUTBOUND accommodationPlacement._id use RETURN edge)\n      \t\tRETURN MERGE(accommodationPlacement, {supplier: FIRST(\n      \t\t    FOR supplyEdge IN supplyEdges\n      \t\t\t    FOR supplier IN suppliers\n      \t\t\t\t    FILTER supplyEdge._to == supplier._id\n      \t\t\t\t    RETURN supplier)}, {images: FIRST(\n      \t\t\t\t\t    FOR supplyEdge IN supplyEdges\n      \t\t\t\t\t\t\tFOR supplier IN suppliers\n      \t\t\t\t\t\t\t\tFILTER supplyEdge._to == supplier._id\n      \t\t\t\t\t\t\t\tRETURN supplier.images)}, { serviceBookings: (\n      \t\t\t\t\t\t\t\t\tLET serviceBookingIds = (FOR vertex, edge IN OUTBOUND CONCAT("accommodationPlacements/", ', ') bookIn RETURN edge)\n      \t\t\t\t\t\t\t\t\tFOR serviceBookingId IN serviceBookingIds\n      \t\t\t\t\t\t\t\t\tFOR serviceBooking IN serviceBookings\n      \t\t\t\t\t\t\t\t\t\tFILTER serviceBooking._id == serviceBookingId._to\n      \t\t\t\t\t\t\t\t\t\tRETURN MERGE(serviceBooking, {inactive: serviceBookingId.inactive}, { accommodation: FIRST(\n      \t\t\t\t\t\t\t\t\t\t\tLET accommodationIds = (FOR vertex, edge IN OUTBOUND serviceBooking._id use RETURN edge)\n      \t\t\t\t\t\t\t\t\t\t\tFOR accommodationId IN accommodationIds\n      \t\t\t\t\t\t\t\t\t\t\tFOR accommodation IN accommodations\n      \t\t\t\t\t\t\t\t\t\t\t\tFILTER accommodation._id == accommodationId._to\n      \t\t\t\t\t\t\t\t\t\t\t\tRETURN accommodation\n      \t\t\t\t\t\t\t\t\t\t)})\n      \t\t\t\t    )})\n      \t\t)\n      RETURN FIRST(theAccommodationPlacements)\n      ']);

var _arangojs = require('arangojs');

var _request = require('../../../utils/request');

var _request2 = _interopRequireDefault(_request);

var _environment = require('../../../config/environment');

var _environment2 = _interopRequireDefault(_environment);

var _database = require('../../database');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function getAccessibleSuppliers(args) {
  return (0, _request2.default)(_environment2.default.foxx.url + '/accessablesuppliers', _request.POST, args);
}

function updateAccommodationPlacement(args) {
  return (0, _request2.default)(_environment2.default.foxx.url + '/accommodationplacement/patch-acommodations-by-accommodation-keys', _request.POST, args);
}

function getRoomConfigs(args) {
  return (0, _request2.default)(_environment2.default.foxx.url + '/room-configs/serviceBooking/' + args, _request.GET, null);
}

function addRoomConfig(args) {
  return (0, _request2.default)(_environment2.default.foxx.url + '/room-configs', _request.POST, args);
}

function updatePAXStatuses(args) {
  return (0, _request2.default)(_environment2.default.foxx.url + '/room-configs/update-pax-statuses', _request.POST, args);
}

function updateRoomConfig(_ref) {
  var roomConfigKey = _ref.roomConfigKey,
      roomType = _ref.roomType,
      paxKeys = _ref.paxKeys;

  return (0, _request2.default)(_environment2.default.foxx.url + '/room-configs/' + roomConfigKey, _request.PUT, { roomType: roomType, paxKeys: paxKeys });
}

function removeRoomConfig(roomConfigKey) {
  return (0, _request2.default)(_environment2.default.foxx.url + '/room-configs/' + roomConfigKey, _request.DELETE);
}

function checkPaxStatus(args) {
  return (0, _request2.default)(_environment2.default.foxx.url + '/room-configs/check-pax-status', _request.POST, args);
}

function getAccommodationPlacement(args) {
  return new _promise2.default(function (resolve) {
    _database.db.query((0, _arangojs.aql)(_templateObject, args.accommodationPlacementKey, args.accommodationPlacementKey)).then(function (cursor) {
      cursor.next().then(function (value) {
        resolve(value);
      });
    });
  });
}

exports.getAccessibleSuppliers = getAccessibleSuppliers;
exports.updateAccommodationPlacement = updateAccommodationPlacement;
exports.getRoomConfigs = getRoomConfigs;
exports.addRoomConfig = addRoomConfig;
exports.removeRoomConfig = removeRoomConfig;
exports.updateRoomConfig = updateRoomConfig;
exports.checkPaxStatus = checkPaxStatus;
exports.getAccommodationPlacement = getAccommodationPlacement;
exports.updatePAXStatuses = updatePAXStatuses;