// import request, { POST } from '../../../utils/request';

import moment from 'moment';

import { db } from '../../database';
import tripClone from '../../Trip/controllers/TripClone';
import { getSupervisor } from '../../Office/OfficeController';
import { getSupervisor as getLocationSupervisor } from '../../Location/controllers/Location';
import { getUserByEmail } from '../../User/UserController';
import {
  remove as removePax,
  getPaxs,
  addPax
} from '../../Pax/controllers/Pax';
import { remove as removeTrip } from '../../Trip/controllers/Trip';
import config from '../../../config/environment';
import auth0 from '../../../utils/auth';

const graph = db.graph(config.arango.databaseName);
const proposalsGraph = graph.vertexCollection('proposals');
const tripsGraph = graph.vertexCollection('trips');
const paxsGraph = graph.vertexCollection('paxs');
const countryBookingsGraph = graph.vertexCollection('countryBookings');
const cityBookingsGraph = graph.vertexCollection('cityBookings');
const transferPlacementsGraph = graph.vertexCollection('transferPlacements');
const accommodationPlacementsGraph = graph.vertexCollection('accommodationPlacements');
const cityDaysGraph = graph.vertexCollection('cityDays');
const serviceBookingsGraph = graph.vertexCollection('serviceBookings');
const activitiesGraph = graph.vertexCollection('activities');

const proposals = db.collection('proposals');
const bookInEdgeCollection = db.edgeCollection('bookIn');
const locatedInEdgeCollection = db.edgeCollection('locatedIn');
const worksForEdgeCollection = db.edgeCollection('worksFor');
const workedByEdgeCollection = db.edgeCollection('workedBy');

const DATE_OPTIONS = { year: 'numeric', month: 'long', day: 'numeric' };

async function addProposal(args) {
  // return request('http://localhost:8529/_db/exo-dev/bbt/proposals', POST, args);
  try {
    const {
      proposal,
      pax,
      selectedTC,
      selectedOffice,
      selectedTA,
      selectedTAOffice,
      selectedLocation,
      userToken
    } = args;
    const newDoc = await proposals.save(proposal);
    const proposalKey = newDoc._key;

    await assignLocation(proposalKey, selectedLocation);
    if (selectedTC && selectedTC !== 'Unassigned') {
      await assignTC({ proposalKey, userKey: selectedTC });
    } else if (selectedOffice) {
      await assignToOfficeSupervisor(proposalKey, selectedOffice);
    } else if (selectedLocation) {
      await assignCountrySupervisor(proposalKey, selectedLocation);
    }

    if (selectedTA && selectedTA !== 'Unassigned' && selectedTAOffice) {
      await removeTAs(proposalKey);
      await addTA({ proposalKey, userKey: selectedTA });
    }
    const newProposal = await proposals.firstExample(newDoc);
    await addCreatorEdge(proposalKey, userToken);

    if (pax) {
      addPax({ ...pax, isMainPax: true, proposalKey });
    }
    return newProposal;
  } catch (e) {
    console.warn('[Proposal Controllers]: New Proposal failed', e);
    return {};
  }
}

async function addCreatorEdge(proposalKey, userToken) {
  const userEmail = await new Promise((resolve, reject) => {
    if (!userToken) {
      reject('Invalid user token');
    } else {
      auth0.getProfile(userToken, (err, profile) => {
        if (err) {
          reject(err);
        } else {
          resolve(JSON.parse(profile).email);
        }
      });
    }
  });
  const user = await getUserByEmail(userEmail);

  // // create a separate record for creator if the creator is not ta or TC ?
  // // if the creator is assigned as TA or TC, update the created: true for workedBy edge.
  // const aqlQuery = `
  //    UPSERT { _from: @proposalId, _to: @userId }
  //    INSERT { _from: @proposalId, _to: @userId, created: true }
  //    UPDATE { created: true } IN workedBy
  //  `;

   // will always create a separate record for creator,
   // the proposal will need to be viewable for the creator who is not assgined to
  const aqlQuery = `
     INSERT {
       _from: @proposalId,
       _to: @userId,
       created: true
     }IN workedBy
   `;

  return await db.query(aqlQuery, {
    proposalId: `proposals/${proposalKey}`,
    userId: user._id
  });
}

function removeLocations(proposalKey) {
  const aqlQuery = `
    FOR location, edge
    IN 1..1 OUTBOUND @proposalId GRAPH 'exo-dev'
    FILTER
        IS_SAME_COLLECTION('locatedIn', edge)
    REMOVE edge IN locatedIn
  `;

  return db.query(aqlQuery, {
    proposalId: `proposals/${proposalKey}`
  });
}


function addLocation(proposalKey, locationKey) {
  const aqlQuery = `
    INSERT {
      _from: @proposalId,
      _to: @locationId
    } IN locatedIn
  `;

  return db.query(aqlQuery, {
    proposalId: `proposals/${proposalKey}`,
    locationId: `locations/${locationKey}`
  });
}


async function assignTC({ proposalKey, userKey }) {
  await removeTCs(proposalKey);
  return addTC({ proposalKey, userKey });
}


async function assignToOfficeSupervisor(proposalKey, officeKey) { // eslint-disable-line
  const supervisor = await getSupervisor(officeKey);

  if (supervisor) {
    return assignTC({ proposalKey, userKey: supervisor._key });
  }

  console.error(`office '${officeKey}' does not have a supervisor`);
}


async function assignCountrySupervisor(proposalKey, locationKey) { // eslint-disable-line
  const supervisor = await getLocationSupervisor(locationKey);

  if (supervisor) {
    return assignTC({ proposalKey, userKey: supervisor._key });
  }

  console.error(`location '${locationKey}' does not have a supervisor`);
}


async function assignLocation(proposalKey, selectedLocation) {
  if (!selectedLocation) {
    return;
  }

  await removeLocations(proposalKey);
  await addLocation(proposalKey, selectedLocation);
}

// const paxs = db.collection('paxs');
// function getProposal(args) {
// return request(`http://
// localhost:8529/_db/exo-dev/bbt/proposals/${args.proposalKey}`,GET);
// }

async function getProposal(args) {
  try {
    const { proposalKey } = args;
    return await proposals.firstExample({ _key: proposalKey });
  } catch (e) {
    console.warn('[Proposal Controllers]: getProposal failed', e);
    return {};
  }
}

async function updateProposalDetails(args) {
  try {
    const {
      proposal: {
        proposalKey
      },
      selectedTC,
      selectedOffice,
      selectedTA,
      selectedTAOffice,
      selectedLocation
    } = args;

    await assignLocation(proposalKey, selectedLocation);
    if (selectedTC && selectedTC !== 'Unassigned') {
      await assignTC({ proposalKey, userKey: selectedTC });
    } else if (selectedOffice) {
      await assignToOfficeSupervisor(proposalKey, selectedOffice);
    } else if (selectedLocation) {
      await assignCountrySupervisor(proposalKey, selectedLocation);
    }

    if (selectedTA && selectedTA !== 'Unassigned' && selectedTAOffice) {
      await removeTAs(proposalKey);
      await addTA({ proposalKey, userKey: selectedTA });
    }

    await proposals.updateByExample({ _key: proposalKey }, {
      ...args.proposal,
      updatedOn: moment().format('DD MMMM YYYY')
    });
    const newProposal = await proposals.firstExample({ _key: proposalKey });
    return newProposal;
  } catch (e) {
    console.warn('[Proposal Controllers]: updateProposalDetails failed', e);
    return {};
  }
}

async function cloneProposal(args) {
  const { proposalKey, userEmail } = args;
  const oldProposal = await proposals.firstExample({ _key: proposalKey });
  ['_id', '_key', '_rev'].map(meta => delete oldProposal[meta]); // eslint-disable-line no-param-reassign
  const newProposal = Object.assign({}, oldProposal, {
    status: 'New',
    createOnDate: new Date().toLocaleDateString('en-US', DATE_OPTIONS)
  });
  const handle = await proposals.save(newProposal);

  // clone all trips in proposal, and the proposal --bookIn--> trip relationships
  const proposalBookInTripsEdges = await bookInEdgeCollection.outEdges(`proposals/${proposalKey}`);
  const newTrips = await Promise.all(proposalBookInTripsEdges.map(edge => tripClone(edge._to)));
  const newproposalBookInTripsEdges = newTrips.map(newTrip => ({ _from: handle._id, _to: newTrip._id }));
  await bookInEdgeCollection.import(newproposalBookInTripsEdges);

  // clone locateIn edges.
  const locatedInEdges = await locatedInEdgeCollection.outEdges(`proposals/${proposalKey}`);
  await bookInEdgeCollection.import(locatedInEdges.map(edge => ({ _from: handle._id, _to: edge._to })));

  // Don't clone paxs, TC, TA
  // but add worksFor edge between new proposal and user with flag "created"

  const user = await getUserByEmail(userEmail);
  await worksForEdgeCollection.import([{
    _from: handle._id,
    _to: user._id,
    created: true
  }]);

  return await proposals.firstExample(handle);
}

async function getBookedTrip(proposalKey) {
  const aqlQuery = `
    FOR trip
    IN 1..1 OUTBOUND @proposalId GRAPH 'exo-dev'
    FILTER
        IS_SAME_COLLECTION('trips', trip) AND
        trip.status == 'booked'
    RETURN trip
  `;

  const result = await db.query(aqlQuery, {
    proposalId: `proposals/${proposalKey}`
  });

  return result.next();
}


async function getUser(proposalKey, role) {
  const aqlQuery = `
    FOR user, edge
        IN 1..1 OUTBOUND @proposalId GRAPH 'exo-dev'
        FILTER
            IS_SAME_COLLECTION('users', user) AND
            ( user.role == @role OR user.role == 'superadmin' ) AND
            edge.created != true
        RETURN merge(user, {created: edge.created})
  `;

  const result = await db.query(aqlQuery, {
    proposalId: `proposals/${proposalKey}`,
    role
  });

  return result.next();
}


async function getMainPax(proposalKey) {
  const aqlQuery = `
    FOR vertex, edge
      IN 1..1 OUTBOUND @proposalId GRAPH 'exo-dev'
      FILTER
        edge.isMainPax == true AND
        IS_SAME_COLLECTION('paxs', vertex)
      RETURN vertex
  `;

  const result = await db.query(aqlQuery, {
    proposalId: `proposals/${proposalKey}`
  });

  return result.next();
}


async function getTripsCount(proposalKey) {
  const aqlQuery = `
    RETURN COUNT (
      FOR vertex
          IN 1..1 OUTBOUND @proposalId GRAPH 'exo-dev'
          FILTER
              IS_SAME_COLLECTION('trips', vertex)
          RETURN vertex
    )
  `;

  const result = await db.query(aqlQuery, {
    proposalId: `proposals/${proposalKey}`
  });

  return result.next();
}

async function getTrips(proposalKey) {
  const aqlQuery = `
      FOR vertex
          IN 1..1 OUTBOUND @proposalId GRAPH 'exo-dev'
          FILTER
              IS_SAME_COLLECTION('trips', vertex)
          RETURN vertex
  `;

  const result = await db.query(aqlQuery, {
    proposalId: `proposals/${proposalKey}`
  });

  return result.all();
}


async function removeTCs(proposalKey) {
  const aqlQuery = `
    FOR user, edge
    IN 1..1 OUTBOUND @proposalId GRAPH 'exo-dev'
    FILTER
        user.role == 'TC' AND
        edge.created != true AND
        IS_SAME_COLLECTION('workedBy', edge)
    REMOVE edge IN workedBy
  `;

  const result = await db.query(aqlQuery, {
    proposalId: `proposals/${proposalKey}`
  });

  return result.next();
}

async function removeTAs(proposalKey) {
  const aqlQuery = `
    FOR user, edge
    IN 1..1 OUTBOUND @proposalId GRAPH 'exo-dev'
    FILTER
        user.role == 'TA' AND
        edge.created != true AND
        IS_SAME_COLLECTION('workedBy', edge)
    REMOVE edge IN workedBy
  `;

  const result = await db.query(aqlQuery, {
    proposalId: `proposals/${proposalKey}`
  });

  return result.next();
}

async function addUserforProposal({ proposalKey, userKey }) {
  const aqlQuery = `
    INSERT {
      _from: @proposalId,
      _to: @userId
    } IN workedBy

    RETURN NEW._id
  `;

  const result = await db.query(aqlQuery, {
    proposalId: `proposals/${proposalKey}`,
    userId: `users/${userKey}`
  });

  return result.next();
}

async function addTC(args) {
  await addUserforProposal(args);
}

async function addTA(args) {
  await addUserforProposal(args);
}

async function getLocation(proposalKey) {
  const aqlQuery = `
    RETURN UNIQUE(
      FOR vertex, edge, path
        IN 1..2 OUTBOUND @proposalId
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
        RETURN SLICE(path.vertices, 1)
    )
  `;

  const result = await db.query(aqlQuery, {
    proposalId: `proposals/${proposalKey}`
  });

  return result.next();
}


/**
 * Remove proposal and related data
 * @param {string} proposalKey
 * @return {Promise}
 */
async function remove(proposalKey) {
  try {
    // // Get and remove proposal paxs
    // const paxs = await getPaxs(`proposals/${proposalKey}`);
    // await Promise.all(paxs.map(({ _key }) => removePax(_key)));
    //
    // // get and remove proposal trips
    // const trips = await getTrips(proposalKey);
    // await Promise.all(trips.map(({ _key }) => removeTrip(_key)));
    //
    // // remove proposal
    // await proposalsGraph.remove(proposalKey);

    const aqlQuery = `
    FOR vertex, edge
      IN 1..6 OUTBOUND @proposalId GRAPH 'exo-dev'
      filter IS_SAME_COLLECTION('trips', vertex)  or
      IS_SAME_COLLECTION('paxs', vertex) or
      IS_SAME_COLLECTION('countryBookings', vertex) or
      IS_SAME_COLLECTION('cityBookings', vertex) or
      IS_SAME_COLLECTION('transferPlacements', vertex) or
      IS_SAME_COLLECTION('accommodationPlacements', vertex) or
      IS_SAME_COLLECTION('cityDays', vertex) or
      IS_SAME_COLLECTION('serviceBookings', vertex) or
      IS_SAME_COLLECTION('activities', vertex)
      sort vertex._id
      RETURN distinct vertex._id
    `;

    const result = await db.query(aqlQuery, {
      proposalId: `proposals/${proposalKey}`
    });

    const allCollectionIds = await result.all();
    await proposalsGraph.remove(proposalKey);
    await Promise.all(allCollectionIds.filter(id => id.startsWith('trips/')).map(id => tripsGraph.remove(id)));
    await Promise.all(allCollectionIds.filter(id => id.startsWith('paxs/')).map(id => paxsGraph.remove(id)));
    await Promise.all(allCollectionIds.filter(id => id.startsWith('countryBookings/')).map(id => countryBookingsGraph.remove(id)));
    await Promise.all(allCollectionIds.filter(id => id.startsWith('cityBookings/')).map(id => cityBookingsGraph.remove(id)));
    await Promise.all(allCollectionIds.filter(id => id.startsWith('transferPlacements/')).map(id => transferPlacementsGraph.remove(id)));
    await Promise.all(allCollectionIds.filter(id => id.startsWith('accommodationPlacements/')).map(id => accommodationPlacementsGraph.remove(id)));
    await Promise.all(allCollectionIds.filter(id => id.startsWith('cityDays/')).map(id => cityDaysGraph.remove(id)));
    await Promise.all(allCollectionIds.filter(id => id.startsWith('serviceBookings/')).map(id => serviceBookingsGraph.remove(id)));
    await Promise.all(allCollectionIds.filter(id => id.startsWith('activities/')).map(id => activitiesGraph.remove(id)));
  } catch (ex) {
    console.warn('remove proposal error', proposalKey);
    console.warn(ex);
  }
  return { _key: proposalKey };
}


export {
  getProposal,
  addProposal,
  cloneProposal,
  updateProposalDetails,
  getBookedTrip,
  getUser,
  getMainPax,
  getTripsCount,
  assignTC,
  getLocation,
  getTrips,
  remove
};
