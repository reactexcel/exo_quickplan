/* eslint-disable no-console */
import _ from 'lodash';
import request, { POST } from '../../../utils/request';
import { db } from '../../database';
import { traversWithFilter } from '../../../utils/dbUtils';
import config from '../../../config/environment';
import {
  getServiceBookings,
  remove as rmServiceBooking
} from '../../ServiceBooking/controllers/ServiceBooking';

import {
  getProposalPaxs
} from '../../Pax/controllers/Pax';

import {
  updateTourPaxs
} from '../../Tour/controllers/Tours';

const graph = db.graph(config.arango.databaseName);
const transferPlacementsCollection = db.collection('transferPlacements');
const cityBookings = db.collection('cityBookings');
const transfers = db.collection('transfers');
const countryBookings = db.collection('countryBookings');
const locationCollection = db.collection('locationCollection');
const transferEdgeCollection = db.edgeCollection('transfer');
const bookInEdgeCollection = db.edgeCollection('bookIn');
const useEdgeCollection = db.edgeCollection('use');
const locatedInEdgeCollection = db.edgeCollection('locatedIn');
const transferPlacements = graph.vertexCollection('transferPlacements');

async function addDepartureTransferPlacement(args) {
  const { tripKey } = args;
  const aqlDepartureExist = `
    let tripId = concat('trips/', @tripKey)
    let departureTransfer = (
      for transferPlacement, transferEdge in 1..1 any tripId graph 'exo-dev'
        filter not_null(transferPlacement) && is_same_collection('transferPlacements', transferPlacement)
      return transferPlacement)
    return (length(departureTransfer) > 0)`;
  const departureTransfers = await db.query(aqlDepartureExist, { tripKey });
  const departureTransferExist = await departureTransfers.next();
  if (!departureTransferExist) {
    const departureTransferPlacement = await transferPlacementsCollection.save({ type: 'departureTransfer' });
    const newDepartureTransferPlacement = await transferPlacementsCollection.document(departureTransferPlacement);
    await transferEdgeCollection.save({ label: 'origin' }, `trips/${tripKey}`, newDepartureTransferPlacement._id);
    await transferEdgeCollection.save({ label: 'destination' }, newDepartureTransferPlacement._id, `trips/${tripKey}`);
  }
}

async function addTransferPlacement(args) {
  const { originCityBookingKey, destinationCityBookingKey, durationNights } = args;

  const handle = await transferPlacementsCollection.save({
    durationNights: durationNights || 0,
    serviceBookingOrder: []
  });

  const saveDoc = await transferPlacementsCollection.document(handle);

  // Create transfer edges
  await transferEdgeCollection.save({}, `cityBookings/${originCityBookingKey}`, saveDoc._id);
  if (destinationCityBookingKey) await transferEdgeCollection.save({}, saveDoc._id, `cityBookings/${destinationCityBookingKey}`);

  return saveDoc;
}

async function getTransferPlacement(_key) {
  try {
    return await transferPlacementsCollection.firstExample({ _key });
  } catch (e) {
    console.log(e);
    return null;
  }
}

// added on 19th october for using in for local transfer
async function getTransfersByKey(_key) {
  try {
    return await transfers.firstExample({ _key });
  } catch (e) {
    return null;
  }
}

async function getAllDBTransfers() {
  const aqlQuery = `
    FOR transfer IN transfers
      RETURN transfer
  `;
  const result = await db.query(aqlQuery);
  const ret = result.all();
  return ret;
}


// Used by function getTransferStatus
async function getCityBookingsOriginCityCode(transferPlacementKey) {
  const aqlQuery = `
    LET transferPlacementId = CONCAT('transferPlacements/', @transferPlacementKey)
    FOR vertex, edges IN 1..1 INBOUND transferPlacementId GRAPH 'exo-dev'
      FILTER IS_SAME_COLLECTION('cityBookings', vertex)
      RETURN vertex.cityCode`;
  const result = await db.query(aqlQuery, { transferPlacementKey });
  return result.next();
}

// Used by function getTransferStatus
async function getCityBookingsDestinationCityCode(transferPlacementKey) {
  const aqlQuery = `
    LET transferPlacementId = CONCAT('transferPlacements/', @transferPlacementKey)
    FOR vertex, edges IN 1..1 OUTBOUND transferPlacementId GRAPH 'exo-dev'
      FILTER IS_SAME_COLLECTION('cityBookings', vertex)
      RETURN vertex.cityCode`;
  const result = await db.query(aqlQuery, { transferPlacementKey });
  return result.next();
}

// Used by function getTransferStatus
async function getFirstServiceBookingKey(transferPlacementKey) {
  const aqlQuery = `
    LET transferPlacementId = CONCAT('transferPlacements/', @transferPlacementKey)
    FOR transfer IN transferPlacements
      FILTER transfer._id == transferPlacementId
      RETURN FIRST(transfer.serviceBookingOrder)`;
  const result = await db.query(aqlQuery, { transferPlacementKey });
  return result.next();
}

// Used by function getTransferStatus
async function getLastServiceBookingKey(transferPlacementKey) {
  const aqlQuery = `
    LET transferPlacementId = CONCAT('transferPlacements/', @transferPlacementKey)
    FOR transfer IN transferPlacements
      FILTER transfer._id == transferPlacementId
      RETURN LAST(transfer.serviceBookingOrder)`;
  const result = await db.query(aqlQuery, { transferPlacementKey });
  return result.next();
}

// Used by function getTransferStatus
async function getTransferFromCityCode(serviceBookingKey) {
  const aqlQuery = `
    LET serviceBookingId = CONCAT('serviceBookings/', @serviceBookingKey)
    FOR vertex, edges IN 1..1 OUTBOUND serviceBookingId GRAPH 'exo-dev'
      RETURN vertex.route.from.cityCode`;
  const result = await db.query(aqlQuery, { serviceBookingKey });
  return result.next();
}

// Used by function getTransferStatus
async function getTransferToCityCode(serviceBookingKey) {
  const aqlQuery = `
    LET serviceBookingId = CONCAT('serviceBookings/', @serviceBookingKey)
    FOR vertex, edges IN 1..1 OUTBOUND serviceBookingId GRAPH 'exo-dev'
      RETURN vertex.route.to.cityCode`;
  const result = await db.query(aqlQuery, { serviceBookingKey });
  return result.next();
}

// Used by function getTransferStatus
async function getCityCodeByCityName(cityName) {
  const aqlQuery = `
  LET cityName = UPPER(@cityName)
  FOR l IN locations
    FILTER UPPER(l.name) == cityName
      RETURN l.tpCode`;
  const result = await db.query(aqlQuery, { cityName });
  return result.next();
}

async function getTransferStatus(transferPlacementKey) {
  const cityBookingOriginCityCode = await getCityBookingsOriginCityCode(transferPlacementKey);
  const cityBookingDestinationCityCode = await getCityBookingsDestinationCityCode(transferPlacementKey);
  const originCityCode = await getCityCodeByCityName(cityBookingOriginCityCode);
  const destinationCityCode = await getCityCodeByCityName(cityBookingDestinationCityCode);
  const firstServiceBookingKey = await getFirstServiceBookingKey(transferPlacementKey);
  const lastServiceBookingKey = await getLastServiceBookingKey(transferPlacementKey);
  const transferFromCityCode = await getTransferFromCityCode(firstServiceBookingKey);
  const transferToCityCode = await getTransferToCityCode(lastServiceBookingKey);
  const sameOriginDestinationError = originCityCode && destinationCityCode && (originCityCode.trim() === destinationCityCode.trim());
  const originError = originCityCode && transferFromCityCode && (originCityCode.trim() !== transferFromCityCode.trim());
  const destinationError = destinationCityCode && transferToCityCode && (destinationCityCode.trim() !== transferToCityCode.trim());

  if (sameOriginDestinationError) {
    return {
      severity: 20,
      message: 'Transfer origin and destination should not be in the same city.'
    };
  } else if (originError && destinationError) {
    return {
      severity: 20,
      message: 'Transfer origin and destination was changed. Transfer details need to be updated.'
    };
  } else if (originError) {
    return {
      severity: 20,
      message: 'Transfer origin was changed. Transfer details need to be updated.'
    };
  } else if (destinationError) {
    return {
      severity: 20,
      message: 'Transfer destination was changed. Transfer details need to be updated.'
    };
  }
  return {
    severity: 0,
    message: ''
  };
}

async function clearTransferPlacement(_key) {
  const serviceBookingsGraphCollection = graph.vertexCollection('serviceBookings');

  try {
    const serviceBookings = await traversWithFilter(1, 1, 'OUTBOUND', `transferPlacements/${_key}`, true, 'serviceBookings');
    // Remove serviceBookings
    for (const sb of serviceBookings) {
      await serviceBookingsGraphCollection.remove(sb);
    }
    return await transferPlacementsCollection.update(_key, { serviceBookingOrder: [] });
  } catch (e) {
    console.log(e);
    return null;
  }
}

async function getTransferByServiceBookingKey(args) {
  try {
    const edge = await useEdgeCollection.firstExample({ _from: `serviceBookings/${args.serviceBookingKey}` });
    return await transfers.firstExample({ _id: edge._to });
  } catch (e) {
    return null;
  }
}

async function getTransferPlacementByCityBookingKey(args) {
  try {
    const edge = await transferEdgeCollection.firstExample({ _to: `cityBookings/${args.cityBookingKey}` });
    return await transferPlacementsCollection.firstExample({ _id: edge._from });
  } catch (e) {
    return null;
  }
}

async function getTransferPlacementByCountryBookingKey(args) {
  try {
    const countryBooking = await countryBookings.firstExample({ _id: `countryBookings/${args.countryBookingKey}` });
    const cityBookingKey = countryBooking.cityOrder[0];
    const edge = await transferEdgeCollection.firstExample({ _to: `cityBookings/${cityBookingKey}` });
    return await transferPlacementsCollection.firstExample({ _id: edge._from });
  } catch (e) {
    return null;
  }
}

async function getCityBookingByTransferPlacementKey(args) {
  try {
    let cityBooking;
    if (args.type === 'from') {
      const edge = await transferEdgeCollection.firstExample({ _to: `transferPlacements/${args.transferPlacementKey}` });
      cityBooking = await cityBookings.firstExample({ _id: edge._from });
    } else {
      const edge = await transferEdgeCollection.firstExample({ _from: `transferPlacements/${args.transferPlacementKey}` });
      cityBooking = await cityBookings.firstExample({ _id: edge._to });
    }

    // const countryEdge = await bookInEdgeCollection.firstExample({ _to: cityBooking._id });
    // const countryBooking = await countryBookings.firstExample({ _id: countryEdge._from });
    // return ({ cityCode: cityBooking.cityCode, countryCode: countryBooking.countryCode });

    return cityBooking;
  } catch (e) {
    console.log(e);
    return null;
  }
}

async function getCityLocationByTransferPlacementKey(args) {
  const cityBooking = await getCityBookingByTransferPlacementKey(args);
  const edge = await locatedInEdgeCollection.firstExample({ _from: cityBooking._id });
  return await locationCollection.document(edge._to);
}

async function addServiceBooking(args) {
  const { transferPlacementKey, serviceBookingKey, serviceBookingIndex } = args;
  const tf = await getTransferPlacement(`transferPlacements/${transferPlacementKey}`);

  // Add serviceBooking to transferPlacement at specified index
  if (typeof serviceBookingIndex === 'number') tf.serviceBookingOrder.splice(serviceBookingIndex, 0, serviceBookingKey);
  else tf.serviceBookingOrder.push(serviceBookingKey);

  // Create edge
  await bookInEdgeCollection.save({}, `transferPlacements/${transferPlacementKey}`, `serviceBookings/${serviceBookingKey}`);

  // Save transferPlacement
  await transferPlacementsCollection.update(tf, tf);
  return await transferPlacementsCollection.document(tf);
}

async function removeServiceBooking(args) {
  const { transferPlacementKey, serviceBookingKey } = args;
  const tf = await getTransferPlacement(`transferPlacements/${transferPlacementKey}`);

  // Remove serviceBooking from transferPlacement
  tf.serviceBookingOrder = tf.serviceBookingOrder.filter(item => item !== serviceBookingKey);

  // Save transferPlacement
  await transferPlacementsCollection.update(tf, tf);
  return await transferPlacementsCollection.document(tf);
}


/**
 * Update a TransferPlacement and its relationship, use and transfer edges.
 * it matches all its related serviceBookings and decides which ones need to be
 * added or removed
 * @param selectedTransferKeys
 * @param transferPlacementKey
 * @param durationDays
 * @param serviceBookingData
 * @returns TransferPlacement object
 */
async function updateTransferPlacement({ selectedTransferKeys, transferPlacementKey, durationDays, serviceBookingData, startDate, proposalKey }) {
  const transferPlacementsCollection = db.collection('transferPlacements');
  const serviceBookingsCollection = db.collection('serviceBookings');
  const transferCollection = db.collection('transfers');
  const serviceBookingsGraphCollection = graph.vertexCollection('serviceBookings');

  try {
    // Fetch all old serviceBookings and their related transfers
    const oldServiceBookings = await traversWithFilter(1, 1, 'OUTBOUND', `transferPlacements/${transferPlacementKey}`, true, 'serviceBookings');
    for (const sb of oldServiceBookings) {
      if (!sb.isPlaceholder) {
        const transfer = await traversWithFilter(1, 1, 'OUTBOUND', sb._id, true, 'transfers');
        sb.transfer = transfer[0];
      }
    }
    const oldTransferKeys = await oldServiceBookings.map((sb) => {
      if (sb.isPlaceholder) {
        return `sBK_${sb._key}`;
      }
      return sb.transfer._key;
    });

    // Compare old transfers with the new selectedTransferKeys
    const toBeRemoved = _.difference(oldTransferKeys, selectedTransferKeys);
    const toBeAdded = _.difference(selectedTransferKeys, oldTransferKeys);

    // Remove all unmatched serviceBookings
    for (const transferKey of toBeRemoved) {
      if (transferKey.substring(0, 11) === 'placeholder') continue; // eslint-disable-line no-continue

      let serviceBooking;
      if (transferKey.substring(0, 4) === 'sBK_') {
        serviceBooking = oldServiceBookings.find(sb => sb._key === transferKey.substring(4));
      } else {
        serviceBooking = oldServiceBookings.find(sb => sb.transferKey === transferKey);
      }
      await serviceBookingsGraphCollection.remove(serviceBooking);
    }

    // Add new transfers that are not currently existing
    for (const transferKey of toBeAdded) {
      const serviceBookingIndex = _.findIndex(serviceBookingData, { transferKey });
      const newServiceBooking = serviceBookingData[serviceBookingIndex];

      // Read and inject route from transfer to a new serviceBooking
      if (!newServiceBooking.isPlaceholder) {
        const transfer = await transferCollection.firstExample({ _key: transferKey });

        if (!newServiceBooking.route) {
          newServiceBooking.route = {};
        }
          // this is so that refNo deosnt get removed from route
        newServiceBooking.route.from = transfer.route.from.cityName;
        newServiceBooking.route.to = transfer.route.to.cityName;
          // before this line from is object, but we replace it with cityName
      }

      const serviceBooking = await serviceBookingsCollection.save(newServiceBooking);
      await bookInEdgeCollection.save({}, `transferPlacements/${transferPlacementKey}`, serviceBooking._id);

       // add pax to transfer
      addPAXtoServiceBooking(serviceBooking._key);


      if (!newServiceBooking.isPlaceholder) await useEdgeCollection.save({}, serviceBooking._id, `transfers/${transferKey}`);
    }

    // Update transferOrder array in the transferPlacement object
    const newServiceBookings = await traversWithFilter(1, 1, 'OUTBOUND', `transferPlacements/${transferPlacementKey}`, true, 'serviceBookings');
    for (const sb of newServiceBookings) {
      // if (!sb.isPlaceholder) {
      const transfer = await traversWithFilter(1, 1, 'OUTBOUND', sb._id, true, 'transfers');
      sb.transfer = transfer[0];
      // }
    }

    const serviceBookingOrder = [];
    for (const transferKey of selectedTransferKeys) {
      if (transferKey.substring(0, 4) === 'sBK_') {
        serviceBookingOrder.push(newServiceBookings.find(sb => sb._key === transferKey.substring(4)));
      } else {
        serviceBookingOrder.push(newServiceBookings.find(sb => sb.transferKey === transferKey));
      }
    }
    const oldTransferPlacement = await transferPlacementsCollection.firstExample({ _key: transferPlacementKey });
    await transferPlacementsCollection.updateByExample({ _key: transferPlacementKey }, {
      serviceBookingOrder: serviceBookingOrder.map(sb => sb._key),
      durationDays,
      startDate
    });

    // Return the updated transferPlacements all the way down to serviceBooking
    const newTransferPlacement = await transferPlacementsCollection.firstExample({ _key: transferPlacementKey });

    // start add pax to each service
    if (serviceBookingOrder.length > 0) {
      const allPaxes = getProposalPaxs(proposalKey);
      allPaxes.then((paxLists) => {
        const paxToAdd = [];
        if (paxLists.length > 0) {
          paxLists.map((px) => { // eslint-disable-line array-callback-return
            paxToAdd.push(px._key);
          });
          if (paxToAdd.length > 0) {
            serviceBookingOrder.map((sb) => { // eslint-disable-line array-callback-return
              const sbKey = sb._key;
              updateTourPaxs({
                serviceBookingKey: sbKey,
                paxKeys: paxToAdd
              });
            });
          }
        }
      });
    }
    // end add pax to each service

    // call the bbt re-calculation api to update cityday when durationDays changed.
    if (oldTransferPlacement && newTransferPlacement && oldTransferPlacement.durationDays !== newTransferPlacement.durationDays) {
      const tripKey = await getTripKeyByTransferPlacementKey(newTransferPlacement._key);
      await request(`${config.foxx.url}/trips/recalculate-trip`, POST, { tripKey });
    }

    return { ...newTransferPlacement, serviceBookings: newServiceBookings };
  } catch (e) {
    console.log(e.stack);
    return null;
  }
}

async function getTripKeyByTransferPlacementKey(transferPlacementKey) {
  const aqlQuery = `
    FOR vertex, edge
    IN 3..3 INBOUND @vertexId
    GRAPH 'exo-dev'
    FILTER
      IS_SAME_COLLECTION('trips', vertex)
    RETURN vertex._key
  `;

  const result = await db.query(aqlQuery, { vertexId: `transferPlacements/${transferPlacementKey}` });
  return result.next();
}

// update local transfers
async function updateLocalTransferPlacement({ selectedTransferKeys, transferPlacementKey, durationDays, serviceBookingData, n_city_key, n_day_id, n_remove_local_transferPlacementKey, proposalKey }) { // eslint-disable-line no-unused-vars
  const transferPlacementsCollection = db.collection('transferPlacements');
  const serviceBookingsCollection = db.collection('serviceBookings');
  // if it is from change local transfer then remove that first remove
  if (n_remove_local_transferPlacementKey && n_remove_local_transferPlacementKey !== '') {
    try {
      await serviceBookingsCollection.remove({ _key: n_remove_local_transferPlacementKey });
    } catch (e) {
      console.log(e.stack);
    }
  }

  try {
    const oldTransferKeys = [];
    const toBeAdded = _.difference(selectedTransferKeys, oldTransferKeys);
    const returnLocalTransferAdded = [];

    // Add new transfers that are not currently existing
    for (const transferKey of toBeAdded) {
      const serviceBookingIndex = _.findIndex(serviceBookingData, { transferKey });
      const newServiceBooking = serviceBookingData[serviceBookingIndex];

      // add serviceBookingType as localtransfer // added on 18th august for local transfer
      newServiceBooking.serviceBookingType = 'localtransfer';

      const serviceBooking = await serviceBookingsCollection.save(newServiceBooking);
      const t_transfer = await getTransfersByKey(newServiceBooking.transferKey); // eslint-disable-line no-unused-vars
      // ----start-----prepare return data
      const ret = newServiceBooking;
      ret.localtransfer = await getTransfersByKey(newServiceBooking.transferKey);
      returnLocalTransferAdded.push(ret);
      // ----end-------prepare return data
      await bookInEdgeCollection.save({}, `cityDays/${n_day_id}`, serviceBooking._id);

      // add pax to transfer
      addPAXtoServiceBooking(serviceBooking._key);


      // start add pax to each service
      if (serviceBooking._key) {
        const allPaxes = getProposalPaxs(proposalKey);
        allPaxes.then((paxLists) => {
          const paxToAdd = [];
          if (paxLists.length > 0) {
            paxLists.map((px) => { // eslint-disable-line array-callback-return
              paxToAdd.push(px._key);
            });
            if (paxToAdd.length > 0) {
              updateTourPaxs({
                serviceBookingKey: serviceBooking._key,
                paxKeys: paxToAdd
              });
            }
          }
        });
      }
      // end add pax to each service
      if (!newServiceBooking.isPlaceholder) await useEdgeCollection.save({}, serviceBooking._id, `transfers/${transferKey}`);
    }

    // Update transferOrder array in the transferPlacement object
    const newServiceBookings = await traversWithFilter(1, 1, 'OUTBOUND', `transferPlacements/${transferPlacementKey}`, true, 'serviceBookings');
    for (const sb of newServiceBookings) {
      // if (!sb.isPlaceholder) {
      const transfer = await traversWithFilter(1, 1, 'OUTBOUND', sb._id, true, 'transfers');
      sb.transfer = transfer[0];
      // }
    }

    const serviceBookingOrder = [];
    for (const transferKey of selectedTransferKeys) {
      if (transferKey.substring(0, 4) === 'sBK_') {
        serviceBookingOrder.push(newServiceBookings.find(sb => sb._key === transferKey.substring(4)));
      } else {
        serviceBookingOrder.push(newServiceBookings.find(sb => sb.transferKey === transferKey));
      }
    }

    // Return the updated transferPlacements all the way down to serviceBooking
    const newTransferPlacement = await transferPlacementsCollection.firstExample({ _key: transferPlacementKey }); // eslint-disable-line no-unused-vars


    // return { returnLocalTransferAdded };
    return { ...newTransferPlacement, serviceBookings: newServiceBookings };
  } catch (e) {
    console.log(e.stack);
    return {};
  }
}

// add pax to transfer
async function addPAXtoServiceBooking(serviceBookingKey) {
  const aqlQuery = `
  LET serviceBookingId = CONCAT('serviceBookings/', @serviceBookingKey)
  FOR trip IN 4..4 INBOUND serviceBookingId GRAPH 'exo-dev'
  FOR paxs IN 1..1 OUTBOUND trip._id GRAPH 'exo-dev'
    FILTER IS_SAME_COLLECTION('paxs', paxs)
    INSERT { _from: serviceBookingId, _to: paxs._id } IN participate`;
  await db.query(aqlQuery, { serviceBookingKey });
}

// remove local transfer
async function removeLocalTransfer({ serviceBookingKey }) {
  const serviceBookingsCollection = db.collection('serviceBookings');
  try {
    // await serviceBookingsCollection.remove({ _key: serviceBookingKey });
    await rmServiceBooking(serviceBookingKey);
    return { serviceBookingKey };
  } catch (e) {
    console.log(e.stack);
    return {};
  }
}


const remove = async (transferPlacementKey) => {
  // get and remove transferPlacement serviceBookings
  const serviceBookings = await getServiceBookings(`transferPlacements/${transferPlacementKey}`);
  await Promise.all(serviceBookings.map(({ _key }) => rmServiceBooking(_key)));

  return transferPlacements.remove(transferPlacementKey);
};


async function getTransferPlacements(vertexId) {
  const aqlQuery = `
    FOR vertex, edge
    IN 1..1 OUTBOUND @vertexId
    GRAPH 'exo-dev'
    FILTER
      IS_SAME_COLLECTION('transferPlacements', vertex) AND
      IS_SAME_COLLECTION('transfer', edge)
    RETURN vertex
  `;

  const result = await db.query(aqlQuery, { vertexId });
  return result.all();
}

export {
  addDepartureTransferPlacement,
  addTransferPlacement,
  getTransferPlacement,
  getTransferStatus,
  getTransferByServiceBookingKey,
  getTransferPlacementByCountryBookingKey,
  getCityBookingByTransferPlacementKey,
  getCityLocationByTransferPlacementKey,
  getTransferPlacementByCityBookingKey,
  clearTransferPlacement,
  addServiceBooking,
  removeServiceBooking,
  updateTransferPlacement,
  updateLocalTransferPlacement,
  getTransfersByKey,
  removeLocalTransfer,
  remove,
  getTransferPlacements,
  getAllDBTransfers
};
