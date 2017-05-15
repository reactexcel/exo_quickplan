import { aql } from 'arangojs';
import _ from 'lodash';
import { db } from '../../database';
import config from '../../../config/environment';
import request, { POST } from '../../../utils/request';

import * as tripCtrl from '../../TripPlanner/controllers/Trip';
import {
  remove as removeCityBooking,
  getCityBookings
} from '../../CityBooking/controllers/CityBooking';
import {
  remove as removePax,
  getPaxs
} from '../../Pax/controllers/Pax';

const graph = db.graph(config.arango.databaseName);
const countryBookings = graph.vertexCollection('countryBookings');

async function addCountryBooking(args) {
  const args_order = args.order;
  const args_addedIndex = args.addedIndex;

  const save_args = {
    tripKey: args.tripKey,
    countryCode: args.countryCode,
    clientMutationId: args.clientMutationId
  };

  const response = await request('http://localhost:8529/_db/exo-dev/bbt/countrybooking', POST, save_args);

  // try {
  //   // Create location edges
  //   const thaiCountry = await locationCollection.firstExample({name: "Thailand"});
  //   // await locatedInEdgeCollection.save({}, thaiCountry._id, response._id);
  //   const result = await db.query(aql`
  //     INSERT {_from: ${response._id}, _to: ${thaiCountry._id}} IN locatedIn
  //   `);
  // } catch (e) {
  //   console.log(e);
  // }

  // start
  // to change country order on the basis of args_addedIndex & args_order
  // first get trip country orders
  const added_country_key = response._key;
  const trip = await tripCtrl.getTrip({ _key: args.tripKey });
  const existingCountryOrder = trip.countryOrder;
  let newCountryOrder = [];
  newCountryOrder = existingCountryOrder;
  if (args_order.toString() === 'before' || args_order.toString() === 'after') {
    _.pull(newCountryOrder, added_country_key);
    const keyWhereToSaveNew = args_addedIndex; // this is key of on which option is selected
    if (args_order.toString() === 'before') {
      newCountryOrder.splice(args_addedIndex, 0, added_country_key);
    } else {
      const uIndex = args_addedIndex + 1;
      newCountryOrder.splice(uIndex, 0, added_country_key);
    }
  }
  trip.countryOrder = newCountryOrder;
  await tripCtrl.updateTrip(trip._key, trip);
  return response;
}

function getCountryBooking(countryBookingKey) {
  return request('http://localhost:8529/_db/exo-dev/bbt/countrybooking/get-service-bookings-by-country-key', POST, { countryBookingKey });
}

function addTourplanCountryBookings(args) {
  return request('http://localhost:8529/_db/exo-dev/bbt/countrybooking/create-tourplan-bookings-from-countryKey', POST, args);
}

function removeTourplanCountryBookings(args) {
  return request('http://localhost:8529/_db/exo-dev/bbt/countrybooking/remove-tourplan-bookings-from-countryKey', POST, args);
}

async function getCountryLocation(countryBookingKey) {
  const locationCollection = db.collection('locations');
  const countryBookingId = `countryBookings/${countryBookingKey}`;
  const cursor = await db.query(aql`
    RETURN (FOR vertex, edge IN OUTBOUND DOCUMENT(${countryBookingId}) locatedIn RETURN edge)[0]`
  );
  const locationEdge = await cursor.next();
  return await locationCollection.firstExample({ _id: locationEdge._to });
}

function updateServicesAvailability(args) {
  return request('http://localhost:8529/_db/exo-dev/bbt/countrybooking/check-services-availability', POST, args);
}


const remove = async (countryBookingKey) => {
  // NOTES, DON't remove the paxs document when remove countryBookings.
  // // get and remove countryBooking paxs
  // const paxs = await getPaxs(`countryBookings/${countryBookingKey}`);
  // await Promise.all(paxs.map(({ _key }) => removePax(_key)));

  // get and remove countryBooking paxs
  const cityBookings = await getCityBookings(`countryBookings/${countryBookingKey}`);
  await Promise.all(cityBookings.map(({ _key }) => removeCityBooking(_key)));

  return countryBookings.remove(countryBookingKey);
};


async function getCountryBookings(vertexId) {
  const aqlQuery = `
    FOR vertex, edge
    IN 1..1 OUTBOUND @vertexId
    GRAPH 'exo-dev'
    FILTER
      IS_SAME_COLLECTION('countryBookings', vertex) AND
      IS_SAME_COLLECTION('bookIn', edge)
    RETURN vertex
  `;

  const result = await db.query(aqlQuery, { vertexId });
  return result.all();
}


export {
  addCountryBooking,
  getCountryBooking,
  addTourplanCountryBookings,
  removeTourplanCountryBookings,
  getCountryLocation,
  updateServicesAvailability,
  remove,
  getCountryBookings
};
