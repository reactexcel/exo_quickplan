import request, { POST } from '../../../utils/request';
import { db } from '../../database';
import tripClone from './TripClone';
import {
  remove as removeActivity,
  getActivities
} from '../../Activity/controllers/Activity';
import { remove as removePax } from '../../Pax/controllers/Pax';
import config from '../../../config/environment';
import {
  remove as removeTransferPlacement,
  getTransferPlacements
} from '../../TransferPlacement/controllers/TransferPlacement';
import {
  addCountryBooking,
  remove as removeCountryBooking,
  getCountryBookings
} from '../../CountryBooking/controllers/CountryBooking';
import { getLocation } from '../../Proposal/controllers/Proposal';
import { addCityBooking } from '../../CityBooking/controllers/CityBooking';

const graph = db.graph(config.arango.databaseName);
const trips = graph.vertexCollection('trips');

const tripsCollection = db.collection('trips');
const paxsCollection = db.collection('paxs');
const countryBookingsCollection = db.collection('countryBookings');
const cityBookingsCollection = db.collection('cityBookings');

const bookInEdgeCollection = db.edgeCollection('bookIn');
const participateEdgeCollection = db.edgeCollection('participate');
const locatedInEdgeCollection = db.edgeCollection('locatedIn');


async function addTrip(args) {
  const { proposalKey } = args;
  const saveDoc = await request('http://localhost:8529/_db/exo-dev/bbt/trips', POST, args);

  try {
    const locations = (await getLocation(proposalKey) || [])[0];
    if (locations && locations.length) {
      // auto add the first country for the trip
      const proposalCountry = locations.find(location => location.type === 'country');
      let addCountryRsp = null;
      if (proposalCountry) {
        addCountryRsp = await addCountryBooking({
          tripKey: saveDoc._key,
          order: 'before',
          addedIndex: 0,
          countryCode: proposalCountry.name
        });
      }

      // auto add the first city for the first countryBooking
      const proposalCity = locations.find(location => location.type === 'city');
      if (proposalCity && addCountryRsp && addCountryRsp._key) {
        const addCityRsp = await addCityBooking({
          cityCode: proposalCity.name,
          cityIndex: 0,
          countryBookingKey: addCountryRsp._key
        });
      }
    }
  } catch (ex) {
    console.log('add default country and city for trip failed', ex);
  }
  return saveDoc;
}

function getProposalTrips(args) {
  return request('http://localhost:8529/_db/exo-dev/bbt/trips/trips-from-proposal', POST, args);
}

function getTrip(args) {
  return request('http://localhost:8529/_db/exo-dev/bbt/trips/trip-by-tripKey', POST, args);
}

function addTourplanTripBookings(args) {
  return request('http://localhost:8529/_db/exo-dev/bbt/trips/create-tourplan-bookings-from-tripKey', POST, args);
}

function removeTourplanTripBookings(args) {
  return request('http://localhost:8529/_db/exo-dev/bbt/trips/remove-tourplan-bookings-from-tripKey', POST, args);
}


async function updateTripStartDate({ _key, startDate, endDate }) {
  const aqlQuery = `
    FOR t IN trips
      FILTER t._id == @tripId
      UPDATE t WITH { startDate: @startDate, endDate: @endDate} IN trips
      RETURN NEW
  `;

  const result = await db.query(aqlQuery, {
    tripId: `trips/${_key}`,
    startDate,
    endDate
  });

  return result.next();
}

async function updateTrip(args) {
  const tripKey = args._key;
  await tripsCollection.updateByExample({ _key: tripKey }, args);
  const doc = await tripsCollection.firstExample({ _key: tripKey });
  return doc;
}

async function getTripTravellerSummary(tripKey) {
  const edges = await participateEdgeCollection.outEdges(`trips/${tripKey}`);
  const paxs = await paxsCollection.lookupByKeys(edges.map(edge => edge._to));
  const ret = { adults: 0, children: 0, infants: 0 };
  paxs.map(pax => ret[pax.ageGroup]++);
  return ret;
}

async function getItinerarySummary(trip) {
  const countryOrder = trip.countryOrder || [];
  const countries = await countryBookingsCollection.lookupByKeys(countryOrder.map(key => `countryBookings/${key}`));
  return await Promise.all(countries.map(async (country) => {
    const cityOrder = country.cityOrder || [];
    const cities = await cityBookingsCollection.lookupByKeys(cityOrder.map(key => `cityBookings/${key}`));
    return { country: country.countryCode, cities: cities.map(city => city.cityCode) };
  }));
}

/* async function getTripsByProposalKey({ proposalKey }) {
  try {
    const edges = await bookInEdgeCollection.outEdges(`proposals/${proposalKey}`);
    const trips = await tripsCollection.lookupByKeys(edges.map(edge => edge._to));
    await Promise.all(trips.map(async (trip) => {
      trip.traveller = await getTripTravellerSummary(trip._key); // eslint-disable-line no-param-reassign
      trip.itinerary = await getItinerarySummary(trip); // eslint-disable-line no-param-reassign
    }));
    return trips;
  } catch (e) {
    console.log('[Trip Controllers] get Trips By Proposal Key error,', e);
    return {};
  }
}*/

async function deleteTrip({ tripKey }) {
  try {
    await tripsCollection.remove({ _key: tripKey });

    const proposalBookInTripsEdges = await bookInEdgeCollection.inEdges(`trips/${tripKey}`);
    await bookInEdgeCollection.removeByKeys(proposalBookInTripsEdges.map(edge => edge._id));
    // delete trips bookIn countryBookings
    const tripsBookInCountryBookingsEdges = await bookInEdgeCollection.outEdges(`trips/${tripKey}`);
    await bookInEdgeCollection.removeByKeys(tripsBookInCountryBookingsEdges.map(edge => edge._id));
    // delete trips participate paxs
    const tripsParticipatePaxsEdges = await participateEdgeCollection.outEdges(`trips/${tripKey}`);
    await participateEdgeCollection.removeByKeys(tripsParticipatePaxsEdges.map(edge => edge._id));
    // delete trips locatedIn locations
    const tripsLocatedInEdges = await locatedInEdgeCollection.outEdges(`trips/${tripKey}`);
    await locatedInEdgeCollection.removeByKeys(tripsLocatedInEdges.map(edge => edge._id));
    return { tripKey };
  } catch (e) {
    console.log('[Trip Controllers] delete trip error,', e);
    return {};
  }
}

// Clone trip clone and existing trip in the proposal into a new one.
async function cloneTrip({ tripKey }) {
  try {
    const newTrip = await tripClone(`trips/${tripKey}`);

    // clone all the proposal --bookIn--> trip relationships
    const proposalBookInTripsEdges = await bookInEdgeCollection.inEdges(`trips/${tripKey}`);
    const newEdges = proposalBookInTripsEdges.map(edge => ({ _from: edge._from, _to: newTrip._id }));
    await bookInEdgeCollection.import(newEdges);

    return newTrip;
  } catch (e) {
    // Add Transaction
    console.log('[Trip Controllers] clone trip error,', e);
    return {};
  }
}

const removeTripPaxEdges = (tripKey) => {
  const aqlQuery = `
   FOR p IN participate
    FILTER
        p._from == @tripId
    REMOVE { _key: p._key } IN participate
  `;


  return db.query(aqlQuery, {
    tripId: `trips/${tripKey}`,
  });
};


const insertTripPaxEdge = ({ tripKey, paxKey }) => {
  const aqlQuery = `
      INSERT {
        _from: @tripId,
        _to: @paxId
      } IN participate
    `;

  return db.query(aqlQuery, {
    tripId: `trips/${tripKey}`,
    paxId: `paxs/${paxKey}`
  });
};

async function getPaxs(tripKey) {
  const aqlQuery = `
    FOR vertex
      IN 1..1 OUTBOUND @tripId GRAPH 'exo-dev'
      FILTER
        IS_SAME_COLLECTION('paxs', vertex)
      RETURN vertex
  `;

  const result = await db.query(aqlQuery, {
    tripId: `trips/${tripKey}`,
  });

  return result.all();
}


async function updateTripPaxEdges({ tripKey, tripPaxKeys }) {
  await removeTripPaxEdges(tripKey);
  await Promise.all(
    tripPaxKeys.map(paxKey => insertTripPaxEdge({ tripKey, paxKey }))
  );

  return getPaxs(tripKey);
}


async function getCombinerCountryBooking(tripKey) {
  const aqlQuery = `
    FOR countryBooking, edge
    IN 1..1 OUTBOUND @tripId GRAPH 'exo-dev'
    FILTER
        IS_SAME_COLLECTION('countryBookings', countryBooking) AND
        edge.combiner == true
    RETURN countryBooking
  `;

  const result = await db.query(aqlQuery, {
    tripId: `trips/${tripKey}`
  });

  return result.next();
}


async function getLocations(tripKey) {
  const aqlQuery = `
    RETURN UNIQUE(
      FOR vertex, edge, path
        IN 1..2 OUTBOUND @tripId
        GRAPH 'exo-dev'
        FILTER
            NOT IS_NULL(vertex) AND
            IS_SAME_COLLECTION('locations', vertex) AND
            ((
              LENGTH (path.vertices) == 3 AND
              path.vertices[2].type == 'country'
            ) OR (
               LENGTH (path.vertices) == 2 AND
              path.vertices[1].type == 'country'
            ))
        LET firstWithEdge = [MERGE(path.vertices[1], path.edges[0])]
        RETURN UNION(firstWithEdge, SLICE(path.vertices, 2))
    )
  `;

  const result = await db.query(aqlQuery, {
    tripId: `trips/${tripKey}`
  });

  return result.next();
}


const remove = async (tripKey) => {
  // get and remove trip activities
  const activities = await getActivities(`trips/${tripKey}`);

  await Promise.all(activities.map(({ _key }) => removeActivity(_key)));

  // NOTES, should not remove the paxs documents,  only remove the trip->pax edge.
  // // get and remove trip paxs
  // const paxs = await getPaxs(tripKey);
  // await Promise.all(paxs.map(({ _key }) => removePax(_key)));

  // get and remove trip transferPlacements
  const transferPlacements = await getTransferPlacements(`trips/${tripKey}`);
  await Promise.all(transferPlacements.map(({ _key }) => removeTransferPlacement(_key)));

  // get and remove trip countryBookings
  const countryBookings = await getCountryBookings(`trips/${tripKey}`);
  await Promise.all(countryBookings.map(({ _key }) => removeCountryBooking(_key)));

  // remove trip inbound edges (bookIn) and trip itself
  trips.remove(tripKey);
};

async function getTripBudgetByType(tripId, placementType) {
  const aqlQuery = `
    let prices = (FOR vertex, edge in 4..4 OUTBOUND @tripId GRAPH 'exo-dev'
    filter IS_SAME_COLLECTION('serviceBookings', vertex)
    and IS_SAME_COLLECTION('bookIn', edge)
    and IS_SAME_COLLECTION(@placementType, edge._from)
    and vertex.price != null
    and vertex.price.amount != null
    return vertex.price.amount)
    return SUM(prices)
  `;

  const result = await db.query(aqlQuery, {
    tripId,
    placementType
  });

  return result.next();
}

async function getTripBudget(tripKey) {
  const tripId = `trips/${tripKey}`;
  const budgets = {
    hotels: { planned: 0, actual: 0 },
    tours: { planned: 0, actual: 0 },
    transfers: { planned: 0, actual: 0 },
    total: { planned: 0, actual: 0 }
  };

  budgets.hotels.actual = await getTripBudgetByType(tripId, 'accommodationPlacements');
  budgets.tours.actual = await getTripBudgetByType(tripId, 'cityDays');
  budgets.transfers.actual = await getTripBudgetByType(tripId, 'transferPlacements');
  budgets.total.actual = budgets.hotels.actual + budgets.tours.actual + budgets.transfers.actual;
  return budgets;
}

export {
  addTrip, getProposalTrips, getTrip,
  addTourplanTripBookings,
  removeTourplanTripBookings,
  deleteTrip,
  cloneTrip,
  updateTrip,
  updateTripStartDate,
  updateTripPaxEdges,
  getCombinerCountryBooking,
  getPaxs,
  getLocations,
  getTripTravellerSummary,
  getItinerarySummary,
  remove,
  getTripBudget
};
