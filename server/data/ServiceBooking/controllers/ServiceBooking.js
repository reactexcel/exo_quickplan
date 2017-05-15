import _ from 'lodash';
import moment from 'moment';
import request, { POST, DELETE, PATCH } from '../../../utils/request';
import config from '../../../config/environment';
import { db } from '../../database';
import {
  remove as removeRoomConfig,
  getRoomConfigs
} from '../../RoomConfig/controllers/RoomConfig';
import {
  remove as removeActivity,
  getActivities
} from '../../Activity/controllers/Activity';
import {
  remove as removePax,
  getPaxs
} from '../../Pax/controllers/Pax';


const graph = db.graph(config.arango.databaseName);
const serviceBookings = graph.vertexCollection('serviceBookings');


function addServiceBooking(args) {
  return request('http://localhost:8529/_db/exo-dev/bbt/servicebooking', POST, args);
}

function getServiceBooking(args) {
  let objArgs = args;

  if (typeof (args) !== 'object') {
    objArgs = {
      serviceBookingKey: args
    };
  }
  return request(`${config.foxx.url}/servicebooking/get-service-booking-by-key`, POST, objArgs);
}

function removeServiceBooking(args) {
  return request(`http://localhost:8529/_db/exo-dev/bbt/servicebooking/${args.serviceBookingKey}`, DELETE, args);
}

function updateServiceBooking(patchData) {
  const serviceBookingKey = patchData.serviceBookingKey;
  delete patchData.serviceBookingKey; // eslint-disable-line no-param-reassign

  return request(`http://localhost:8529/_db/exo-dev/bbt/servicebooking/${serviceBookingKey}`, PATCH, patchData);
}

// TODO: Remove and only use batch request (below)
function addTourplanBooking(args) {
  return request('http://localhost:8529/_db/exo-dev/bbt/servicebooking/create-update-tourplan-booking', POST, args);
}

// TODO: Remove and only use batch request (below)
function cancelTourplanBooking(args) {
  return request('http://localhost:8529/_db/exo-dev/bbt/servicebooking/remove-servicebooking-tourplan', POST, args);
}

function addTourplanBookings(args) {
  return request('http://localhost:8529/_db/exo-dev/bbt/servicebooking/create-update-tourplan-bookings', POST, args);
}

function cancelTourplanBookings(args) {
  return request('http://localhost:8529/_db/exo-dev/bbt/servicebooking/remove-servicebookings-tourplan', POST, args);
}

function changeServiceDaySlot(args) {
  return request('http://localhost:8529/_db/exo-dev/bbt/servicebooking/change-service-day-slot', POST, args);
}

function checkPaxStatus(args) {
  return request(`${config.foxx.url}/servicebooking/check-pax-status`, POST, args);
}

// Used by function getTransferPaxStatuses
async function getTransferPaxErrors(serviceBookingKey) {
  const tripAqlQuery = `
    LET serviceBookingId = CONCAT('serviceBookings/', @serviceBookingKey)
    LET transfers = (FOR transferVertex IN 1..1 OUTBOUND serviceBookingId GRAPH 'exo-dev'
      FILTER IS_SAME_COLLECTION('transfers', transferVertex)
      RETURN transferVertex)
    LET trips = (for tripVertex in 4..4 INBOUND serviceBookingId GRAPH 'exo-dev'
      FILTER IS_SAME_COLLECTION('trips', tripVertex)
      COLLECT trip = tripVertex
      return trip)
    return { trips, transfers }
  `;
  const tripResult = await db.query(tripAqlQuery, { serviceBookingKey });
  const { trips, transfers } = await tripResult.next();
  if (!trips || !trips.length) return [];
  const paxs = await getTripPaxList(trips[0]._key);

  const aqlQuery = `
    FOR pax IN @paxs
      FOR transfer IN @transfers
        FILTER !transfer.pax[pax.ageGroup].allowed
        LET paxInfo = transfer.pax[pax.ageGroup]
        LET ageGroup = SUBSTITUTE(pax.ageGroup, {
          'infants': 'Infants',
          'adults': 'Adults',
          'children': 'Children'})
        LET message = CONCAT(ageGroup , ' (', paxInfo.ageFrom, '-', paxInfo.ageTo, ') not allowed')
        RETURN { severity: 20, message: message  }`;
  const result = await db.query(aqlQuery, { paxs, transfers });
  return result.all();
}

// the trips paxs list and auto calculate the ageGroup of every pax.
async function getTripPaxList(tripKey) {
  const aqlQuery = `
    LET tripId = CONCAT('trips/', @tripKey)
    LET trip = document(tripId)
    LET paxList = (FOR pax IN 1..1 OUTBOUND tripId GRAPH 'exo-dev'
      FILTER IS_SAME_COLLECTION('paxs', pax)
      RETURN pax)
    RETURN { paxList, tripStrtDate: trip.startDate }`;
  const paxsResult = await db.query(aqlQuery, { tripKey });
  const { paxList, tripStrtDate } = await paxsResult.next();
  paxList.map(pax => calculatePaxAgeGroup(pax, tripStrtDate));
  return paxList;
}

function calculatePaxAgeGroup(pax, tripStartDate) {
  if (pax.ageGroup && pax.ageGroup !== '') {
    return;
  }

  let ageOnArrival;
  if (pax.dateOfBirth && pax.dateOfBirth !== '') {
    ageOnArrival = moment(new Date(tripStartDate)).diff(moment(pax.dateOfBirth, 'D MMMM, YYYY'), 'years');
  } else {
    ageOnArrival = pax.ageOnArrival;
  }
  const age = _.parseInt(ageOnArrival);

  if (age < 2) {
    pax.ageGroup = 'infants'; // eslint-disable-line no-param-reassign
  } else if (age < 12) {
    pax.ageGroup = 'children'; // eslint-disable-line no-param-reassign
  } else {  // eslint-disable-line no-else-return
    pax.ageGroup = 'adults'; // eslint-disable-line no-param-reassign
  }
}

async function getTransferPaxStatuses(serviceBookingKey) {
  if (serviceBookingKey && serviceBookingKey !== null && serviceBookingKey !== '') {
    try {
      const transferPaxErrors = await getTransferPaxErrors(serviceBookingKey);
      return transferPaxErrors;
    } catch (ex) {
      console.log('getTransferPaxStatuses error', ex);
    }
    return [];
  }
  return [];
}

function checkServicesAvailability(args) {
  const result = request('http://localhost:8529/_db/exo-dev/bbt/servicebooking/check-services-availability', POST, args);
  return result;
}

async function updateServiceAvailability(args) {
  const result = await request('http://localhost:8529/_db/exo-dev/bbt/servicebooking/check-service-availability', POST, args);
  return result;
}

async function updateServicesAvailability(args) {
  const result = await request('http://localhost:8529/_db/exo-dev/bbt/servicebooking/check-services-availability', POST, args);
  return result;
}

// used for confirm serviceBooking is available after checked when it's on Request.
async function confirmServiceAvailability({ serviceBookingKey }) {
  try {
    const serviceBooking = await serviceBookings.firstExample({ _key: serviceBookingKey });
    if (serviceBooking.status && serviceBooking.status.state === 'On Request') {
      serviceBooking.isConfirmed = true;
      serviceBooking.status.state = 'Available';
      await serviceBookings.updateByExample({ _key: serviceBookingKey }, {
        ...serviceBooking
      });
    }
    return serviceBooking;
  } catch (ex) {
    console.log('error in Confirm service availability', ex);
  }
  return { serviceBookingKey };
}

async function remove(serviceBookingKey) {
  // get and remove serviceBooking rooomConfigs
  const roomConfigs = await getRoomConfigs(`serviceBookings/${serviceBookingKey}`);
  await Promise.all(roomConfigs.map(({ _key }) => removeRoomConfig(_key)));

  // remove service booking activities
  const activities = await getActivities(`serviceBookings/${serviceBookingKey}`);
  await Promise.all(activities.map(({ _key }) => removeActivity(_key)));

  // remove service booking paxs
  const paxs = await getPaxs(`serviceBookings/${serviceBookingKey}`);
  await Promise.all(paxs.map(({ _key }) => removePax(_key)));

  // remove serviceBooking inbound edges (bookIn) and serviceBooking itself
  return serviceBookings.remove(serviceBookingKey);
}


const getServiceBookings = async (vertexId) => {
  const aqlQuery = `
      FOR serviceBooking, edge
          IN 1..1 OUTBOUND @vertexId GRAPH 'exo-dev'
          FILTER
              IS_SAME_COLLECTION('serviceBookings', serviceBooking) AND
              IS_SAME_COLLECTION('bookIn', edge)
          RETURN serviceBooking
  `;

  const result = await db.query(aqlQuery, { vertexId });
  return result.all();
};

export {
  addServiceBooking,
  removeServiceBooking,
  updateServiceBooking,
  addTourplanBooking,
  cancelTourplanBooking,
  addTourplanBookings,
  cancelTourplanBookings,
  changeServiceDaySlot,
  getServiceBooking,
  checkPaxStatus,
  getTransferPaxStatuses,
  checkServicesAvailability,
  updateServiceAvailability,
  updateServicesAvailability,
  remove,
  getServiceBookings,
  confirmServiceAvailability
};
