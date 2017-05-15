import request, { POST } from '../../../utils/request';
import { db } from '../../database';
import {
  remove as removeActivity,
  getActivities
} from '../../Activity/controllers/Activity';
import config from '../../../config/environment';


const graph = db.graph(config.arango.databaseName);
const paxs = graph.vertexCollection('paxs');


// import config from '../../../config/environment';
// const graph = db.graph(config.arango.databaseName);
const paxsCollection = db.collection('paxs');
const participateEdgeCollection = db.edgeCollection('participate');
const bookInEdgeCollection = db.edgeCollection('bookIn');

function getPaxsByProposalKeyTripKey(args) {
  return request('http://localhost:8529/_db/exo-dev/bbt/paxs/get-paxs-by-proposalkey-tripkey', POST, args);
}

function getPaxsByServiceBookingKey(args) {
  return request('http://localhost:8529/_db/exo-dev/bbt/paxs/get-paxs-by-servicebookingkey', POST, args);
}

function getPaxsByRoomConfigKey(args) {
  return request('http://localhost:8529/_db/exo-dev/bbt/paxs/get-paxs-by-roomconfigkey', POST, args);
}

async function addPax(args) {
  try {
    const { proposalKey, firstName, lastName, gender, dateOfBirth, ageOnArrival, ageGroup, language, passportNr, nationality, passportExpiresOn, diet, allergies } = args;
    let isMainPax = args.isMainPax || false;
    const handle = await paxsCollection.save({
      firstName,
      lastName,
      gender,
      dateOfBirth,
      ageOnArrival,
      ageGroup,
      language,
      passportNr,
      nationality,
      passportExpiresOn,
      diet,
      allergies
    });
    const saveDoc = await paxsCollection.document(handle);

    // Save Create proposal and pax relation
    if (proposalKey) {
      const proposalPaxs = await getProposalPaxs(proposalKey);
      if (!proposalPaxs || !proposalPaxs.length) {
        isMainPax = true;
      }
      await participateEdgeCollection.save({ isMainPax }, `proposals/${proposalKey}`, saveDoc._id);

      // create edges from paxs to all trips in the proposal.
      const proposalBookInTripsEdges = await bookInEdgeCollection.outEdges(`proposals/${proposalKey}`);
      const tripsParticipatePaxsEdges = proposalBookInTripsEdges.map(edge => ({ _from: edge._to, _to: saveDoc._id }));
      await participateEdgeCollection.import(tripsParticipatePaxsEdges);
    }
    return saveDoc;
  } catch (e) {
    console.log('[Pax Controller], addPax error', e);
    return null;
  }
}

async function updatePax(args) {
  try {
    const { paxKey } = args;
    await paxsCollection.updateByExample({ _key: paxKey }, args);
    const newPax = await paxsCollection.firstExample({ _key: paxKey });
    return newPax;
  } catch (e) {
    console.log('[Pax Controllers] update Pax error', e);
    return null;
  }
}

async function deletePax(args) {
  const { paxKey, proposalKey } = args;
  try {
    await paxsCollection.remove({ _key: paxKey });
    const edges = await participateEdgeCollection.inEdges(`paxs/${paxKey}`);
    await participateEdgeCollection.removeByKeys(edges.map(edge => edge._key));
    return { paxKey };
  } catch (e) {
    console.log('[Pax Controllers] delete pax error,', e);
    return {};
  }
}


const remove = async (paxKey) => {
  // Get and remove pax activities
  const activities = await getActivities(paxKey);
  await Promise.all(activities.map(({ _key }) => removeActivity(_key)));

  // remove pax
  return paxs.remove(paxKey);
};


async function updateProposalMainPax(args) {
  try {
    const { mainPaxKey, proposalKey } = args;
    const edges = await participateEdgeCollection.outEdges(`proposals/${proposalKey}`);
    const newMainPaxId = `paxs/${mainPaxKey}`;
    let oldMainPaxRelaKey;
    let newMainPaxRelaKey;
    for (let i = 0; i < edges.length; i++) {
      if (edges[i].isMainPax) {
        oldMainPaxRelaKey = edges[i]._key;
      } else if (edges[i]._to === newMainPaxId) {
        newMainPaxRelaKey = edges[i]._key;
      }
    }
    if (oldMainPaxRelaKey) {
      await participateEdgeCollection.updateByExample({ _key: oldMainPaxRelaKey }, { isMainPax: false });
    }
    if (newMainPaxRelaKey) {
      await participateEdgeCollection.updateByExample({ _key: newMainPaxRelaKey }, { isMainPax: true });
    }
    return { mainPaxKey };
  } catch (e) {
    console.log('[Pax Controllers] Change Proposal Main Pax error,', e);
    return null;
  }
}


async function getProposalPaxs(proposalKey) {
  const aqlQuery = `
    FOR vertex, edge
      IN 1..1 OUTBOUND @proposalId GRAPH 'exo-dev'
      FILTER
        IS_SAME_COLLECTION('paxs', vertex)
      SORT vertex.firstName, vertex.lastName
      RETURN MERGE({
        isMainPax: edge.isMainPax
      }, vertex)
  `;

  const result = await db.query(aqlQuery, {
    proposalId: `proposals/${proposalKey}`,
  });

  return result.all();
}


async function getPaxs(vertexId) {
  const aqlQuery = `
    FOR pax, edge
    IN 1..1 OUTBOUND @vertexId
    GRAPH 'exo-dev'
    FILTER
      IS_SAME_COLLECTION('paxs', pax) AND
      IS_SAME_COLLECTION('participate', edge)
    RETURN pax
  `;

  const result = await db.query(aqlQuery, { vertexId });
  return result.all();
}


export {
  getPaxsByProposalKeyTripKey,
  getPaxsByServiceBookingKey, getPaxsByRoomConfigKey,
  addPax, updatePax, deletePax,
  updateProposalMainPax, getProposalPaxs,
  remove,
  getPaxs
};
