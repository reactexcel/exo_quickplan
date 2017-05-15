import { aql } from 'arangojs';
import _ from 'lodash';
import request, { POST, DELETE } from '../../../utils/request';
import config from '../../../config/environment';
import {
  addDepartureTransferPlacement,
  addTransferPlacement,
  getTransferPlacements,
  getTransferPlacementByCityBookingKey,
  remove as removeTransferPlacement
} from '../../TransferPlacement/controllers/TransferPlacement';
import { db } from '../../database';
import {
  remove as removeAccommodationPlacement,
  getAccommodationPlacements
} from '../../AccomodationPlacement/controllers/AccommodationPlacement';
import {
  remove as rmCityDay,
  getCityDays
} from '../../CityDay/controllers/CityDay';

import {
  getCountryBooking
} from '../../CountryBooking/controllers/CountryBooking';

const graph = db.graph(config.arango.databaseName);
const graphCityBookings = graph.vertexCollection('cityBookings');
const cityBookings = db.collection('cityBookings');
const countryBookings = db.collection('countryBookings');
const transferEdgeCollection = db.edgeCollection('transfer');

async function addCityBooking(args) {
  const response = await request('http://localhost:8529/_db/exo-dev/bbt/citybooking', POST, args);
  try {
    let cursor;

    cursor = await db.query(aql`
      LET cityBookingEdge = (FOR vertex, edge IN INBOUND ${response._id} bookIn RETURN edge)[0]
      LET countryBookingEdge = (FOR vertex, edge IN INBOUND cityBookingEdge._from bookIn RETURN edge)[0]

      LET cityBooking = DOCUMENT(${response._id})
      LET countryBooking = DOCUMENT(countryBookingEdge._to)
      LET trip = DOCUMENT(countryBookingEdge._from)

      RETURN {countryBooking, trip}`);

    const queryResult = await cursor.next();
    const { countryBooking, trip } = queryResult;

    // Skip if first city and country
    if (countryBooking.cityOrder.length < 1 && trip.countryOrder.length <= 1) {
      return response;
    }

    // Set origin/destination city
    const countryIndex = trip.countryOrder.indexOf(countryBooking._key);
    const cityIndex = countryBooking.cityOrder.indexOf(response._key);
    const originIndex = cityIndex === 0 ? cityIndex : cityIndex - 1;

    let originCityBookingKey = countryBooking.cityOrder[originIndex];
    const destinationCityBookingKey = response._key;

    // If across country and is first city then link to last city of previous country
    if (countryIndex > 0 && cityIndex === 0) {
      const previousCountryKey = trip.countryOrder[countryIndex - 1];
      const previousCountry = await db.collection('countryBookings').firstExample({ _key: previousCountryKey });
      const previousCityOrder = previousCountry.cityOrder;

      originCityBookingKey = previousCityOrder[previousCityOrder.length - 1];
    }

    // Create transferPlacement for cityBooking
    await addTransferPlacement({
      originCityBookingKey,
      destinationCityBookingKey
    });

    // Create departure transferPlacement for trip
    await addDepartureTransferPlacement({ tripKey: trip._key });

    // Replace origin for city after inserted city if not at last city
    if (cityIndex !== countryBooking.cityOrder.length - 1) {
      const cityAfterKey = countryBooking.cityOrder[cityIndex + 1];
      const cityAfterId = `cityBookings/${cityAfterKey}`;

      cursor = await db.query(aql`
        LET afterEdge = (FOR vertex, edge IN INBOUND ${cityAfterId} transfer RETURN edge)[0]
        LET errorEdge = (FOR vertex, edge IN INBOUND afterEdge._from transfer RETURN edge)[0]
        RETURN errorEdge`
      );

      const errorEdge = await cursor.next();
      const transferEdgeCollection = db.edgeCollection('transfer');

      // Update error edge
      await transferEdgeCollection.remove(errorEdge);
      await transferEdgeCollection.save({}, response._id, errorEdge._to);
    }
  } catch (e) {
    console.log(e);
  }
  return response;
}

function addTourplanCityBookings(args) {
  return request('http://localhost:8529/_db/exo-dev/bbt/citybooking/create-tourplan-bookings-from-cityKey', POST, args);
}

function removeTourplanCityBookings(args) {
  return request('http://localhost:8529/_db/exo-dev/bbt/citybooking/remove-tourplan-bookings-from-cityKey', POST, args);
}

function addCityDay(args) {
  return request('http://localhost:8529/_db/exo-dev/bbt/cityday', POST, args);
}

function removeCityDay(args) {
  return request('http://localhost:8529/_db/exo-dev/bbt/cityday/remove-city-day', POST, args);
}

function updateServicesByCityKey(args) {
  return request('http://localhost:8529/_db/exo-dev/bbt/citybooking/patch-tours-by-city-key', POST, args);
}

function getCityBooking(args) {
  return request(`${config.foxx.url}/citybooking/get-service-bookings-by-city-key`, POST, args);
}

async function getCityLocation(cityBookingKey) {
  const locationCollection = db.collection('locations');
  const cityBookingId = `cityBookings/${cityBookingKey}`;
  const cursor = await db.query(aql`
    RETURN (FOR vertex, edge IN OUTBOUND DOCUMENT(${cityBookingId}) locatedIn RETURN edge)[0]`
  );
  const locationEdge = await cursor.next();
  return await locationCollection.firstExample({ _id: locationEdge._to });
}

function deleteCityBooking(cityBookingKey) {
  try {
    return request(`http://localhost:8529/_db/exo-dev/bbt/citybooking/${cityBookingKey}`, DELETE);
  } catch (e) {
    return false;
  }
}

// added to remove city
async function removeCityBooking(args) {
  // remove city from cityBookings
  // let cityBooking = await cityBookings.firstExample( { _key: args.cityBookingKey.toString() } );
  // if( cityBooking ){
  //   await cityBookings.remove({ _key: args.cityBookingKey.toString() });
  // }
  // first check if countryBookingKey exist and  remove cityBookingKey from cityOrder

  // start -- need to update transfer origin of next city
  const removeCityKey = args.cityBookingKey;
  const countryBookingComplete = await getCountryBooking(args.countryBookingKey);
  const cityOrder = countryBookingComplete.cityOrder;
  const checkRemoveCityIndex = cityOrder.indexOf(removeCityKey);
  let prevCityKey = -1;
  let nextCityKey = -1;
  if (typeof cityOrder[checkRemoveCityIndex - 1] !== 'undefined') {
    prevCityKey = cityOrder[checkRemoveCityIndex - 1];
  }
  if (typeof cityOrder[checkRemoveCityIndex + 1] !== 'undefined') {
    nextCityKey = cityOrder[checkRemoveCityIndex + 1];
  }
  if (prevCityKey !== -1 && nextCityKey !== -1) {
    const aa = await getTransferPlacementByCityBookingKey({ cityBookingKey: prevCityKey });
    const bb = await getTransferPlacementByCityBookingKey({ cityBookingKey: nextCityKey });
    const transferPlacementKeyToUpdate = bb._key;
    const edge = await transferEdgeCollection.removeByExample({ _to: `transferPlacements/${transferPlacementKeyToUpdate}` });
    await transferEdgeCollection.save({}, `cityBookings/${prevCityKey}`, `transferPlacements/${transferPlacementKeyToUpdate}`);
  }

  // this is added coz if city 1 is deleted then city 2 transferplacement fromCity is set 1 which is already deleted so we need to delete from
  if (prevCityKey === -1 && nextCityKey !== -1) {
    const bb = await getTransferPlacementByCityBookingKey({ cityBookingKey: nextCityKey });
    const transferPlacementKeyToUpdate = bb._key;
    const edge = await transferEdgeCollection.removeByExample({ _to: `transferPlacements/${transferPlacementKeyToUpdate}` });
    await transferEdgeCollection.save({}, `cityBookings/${nextCityKey}`, `transferPlacements/${transferPlacementKeyToUpdate}`);
  }

  // end -- need to update transfer origin of next city


  const countryBooking = await countryBookings.firstExample({ _key: args.countryBookingKey.toString() });
  if (countryBooking && countryBooking.cityOrder && countryBooking.cityOrder.length > 0) {
    _.pull(countryBooking.cityOrder, args.cityBookingKey.toString());
    const new_cityOrder = countryBooking.cityOrder;
    await countryBookings.updateByExample({ _key: args.countryBookingKey.toString() }, {
      cityOrder: new_cityOrder
    });
  }

  if (args.cityBookingKey) {
    deleteCityBooking(args.cityBookingKey);
  }

  return {};
}

function updateServicesAvailability(args) {
  return request('http://localhost:8529/_db/exo-dev/bbt/citybooking/check-services-availability', POST, args);
}


const remove = async (cityBookingKey) => {
  // get and remove cityBookings transferPlacements
  const transferPlacements = await getTransferPlacements(`cityBookings/${cityBookingKey}`);
  await Promise.all(transferPlacements.map(({ _key }) => removeTransferPlacement(_key)));

  // get and remove cityBookings accommodationPlacements
  const accomodationPlacements = await getAccommodationPlacements(`cityBookings/${cityBookingKey}`);
  await Promise.all(accomodationPlacements.map(({ _key }) => removeAccommodationPlacement(_key)));

  // get and remove cityBookings cityDays
  const cityDays = await getCityDays(`cityBookings/${cityBookingKey}`);
  await Promise.all(cityDays.map(({ _key }) => rmCityDay(_key)));

  return graphCityBookings.remove(cityBookingKey);
};


async function getCityBookings(vertexId) {
  const aqlQuery = `
    FOR vertex, edge
    IN 1..1 OUTBOUND @vertexId
    GRAPH 'exo-dev'
    FILTER
      IS_SAME_COLLECTION('cityBookings', vertex) AND
      IS_SAME_COLLECTION('bookIn', edge)
    RETURN vertex
  `;

  const result = await db.query(aqlQuery, { vertexId });
  return result.all();
}

// get the default(implicit) tours preselection for city
async function getDefaultToursForCity(cityBookingKey) {
  const cityBookingId = `cityBookings/${cityBookingKey}`;
  // 1. get the ta offices which handle the trip.
  // 2. get the default tour for that ta offices in that city
  const aqlQuery = `
    let cityBooking = document(@cityBookingId)
    let locationId = first(FOR vertex, edge IN OUTBOUND cityBooking._id locatedIn RETURN edge._to)
    let proposalId = FIRST(FOR vertex, edge
        IN 3..3 INBOUND cityBooking._id
        GRAPH 'exo-dev'
        FILTER IS_SAME_COLLECTION('proposals', vertex)
        RETURN vertex._id)
    let taUserId = first(for vertex, edge in OUTBOUND proposalId workedBy filter edge.created != true and vertex.role == 'TA' return edge._to)
    let officeId = first(for edge in worksFor filter edge._from == taUserId return edge._to)
    for selectedEdge in selected
        let tourId = selectedEdge._to
        filter selectedEdge._from == officeId and selectedEdge.default == true
        and Length(FOR vertex, edge IN 1..1 OUTBOUND tourId GRAPH 'exo-dev'
            FILTER edge._to == locationId
            RETURN vertex  ) > 0
        return tourId
    `;

  const result = await db.query(aqlQuery, { cityBookingId });
  return result.all();
}

export {
  addCityBooking,
  addTourplanCityBookings,
  removeTourplanCityBookings,
  addCityDay,
  removeCityDay,
  updateServicesByCityKey,
  getCityBooking,
  getCityLocation,
  removeCityBooking,
  updateServicesAvailability,
  getCityBookings,
  remove,
  getDefaultToursForCity
};
