import { aql } from 'arangojs';
import request, { GET, POST, PUT, DELETE } from '../../../utils/request';
import config from '../../../config/environment';
import { db } from '../../database';

function getAccessibleSuppliers(args) {
  return request(`${config.foxx.url}/accessablesuppliers`, POST, args);
}

function updateAccommodationPlacement(args) {
  return request(`${config.foxx.url}/accommodationplacement/patch-acommodations-by-accommodation-keys`, POST, args);
}

function getRoomConfigs(args) {
  return request(`${config.foxx.url}/room-configs/serviceBooking/${args}`, GET, null);
}

function addRoomConfig(args) {
  return request(`${config.foxx.url}/room-configs`, POST, args);
}

function updatePAXStatuses(args) {
  return request(`${config.foxx.url}/room-configs/update-pax-statuses`, POST, args);
}

function updateRoomConfig({ roomConfigKey, roomType, paxKeys }) {
  return request(`${config.foxx.url}/room-configs/${roomConfigKey}`, PUT, { roomType, paxKeys });
}

function removeRoomConfig(roomConfigKey) {
  return request(`${config.foxx.url}/room-configs/${roomConfigKey}`, DELETE);
}

function checkPaxStatus(args) {
  return request(`${config.foxx.url}/room-configs/check-pax-status`, POST, args);
}

function getAccommodationPlacement(args) {
  return new Promise((resolve) => {
    db.query(aql`
      LET theAccommodationPlacements = (
          FOR accommodationPlacement IN accommodationPlacements
      	    FILTER accommodationPlacement._id == CONCAT("accommodationPlacements/", ${args.accommodationPlacementKey})
      		LET supplyEdges = (FOR vertex, edge IN OUTBOUND accommodationPlacement._id use RETURN edge)
      		RETURN MERGE(accommodationPlacement, {supplier: FIRST(
      		    FOR supplyEdge IN supplyEdges
      			    FOR supplier IN suppliers
      				    FILTER supplyEdge._to == supplier._id
      				    RETURN supplier)}, {images: FIRST(
      					    FOR supplyEdge IN supplyEdges
      							FOR supplier IN suppliers
      								FILTER supplyEdge._to == supplier._id
      								RETURN supplier.images)}, { serviceBookings: (
      									LET serviceBookingIds = (FOR vertex, edge IN OUTBOUND CONCAT("accommodationPlacements/", ${args.accommodationPlacementKey}) bookIn RETURN edge)
      									FOR serviceBookingId IN serviceBookingIds
      									FOR serviceBooking IN serviceBookings
      										FILTER serviceBooking._id == serviceBookingId._to
      										RETURN MERGE(serviceBooking, {inactive: serviceBookingId.inactive}, { accommodation: FIRST(
      											LET accommodationIds = (FOR vertex, edge IN OUTBOUND serviceBooking._id use RETURN edge)
      											FOR accommodationId IN accommodationIds
      											FOR accommodation IN accommodations
      												FILTER accommodation._id == accommodationId._to
      												RETURN accommodation
      										)})
      				    )})
      		)
      RETURN FIRST(theAccommodationPlacements)
      `
    ).then((cursor) => {
      cursor.next()
      .then((value) => {
        resolve(value);
      });
    });
  });
}

export {
  getAccessibleSuppliers,
  updateAccommodationPlacement,
  getRoomConfigs,
  addRoomConfig,
  removeRoomConfig,
  updateRoomConfig,
  checkPaxStatus,
  getAccommodationPlacement,
  updatePAXStatuses
};
