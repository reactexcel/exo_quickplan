import request, { POST, PUT } from '../../../utils/request';
import config from '../../../config/environment';
import { db } from '../../database';

const serviceBookingsCollection = db.collection('serviceBookings');
const roomConfigsCollection = db.collection('roomConfigs');
const bookInEdgeCollection = db.edgeCollection('bookIn');
const participateEdgeCollection = db.edgeCollection('participate');

function getAccessibleTours(args) {
  const { country, city, date, cityDayKey, officeKey } = args;
  return request('http://localhost:8529/_db/exo-dev/bbt/accessibletours', POST, { country, city, date, cityDayKey, officeKey });
}

async function updateTourPaxs(args) {
  // return request(`${config.foxx.url}/servicebooking/paxs/${args.serviceBookingKey}`, PUT, args);
  const { serviceBookingKey, paxKeys } = args;

  // NOTES, Refactor to make tours use roomConfig collection
  const bookInEdge = await bookInEdgeCollection.outEdges(`serviceBookings/${serviceBookingKey}`);
  let roomConfigId;
  if (bookInEdge && bookInEdge.length) {
    roomConfigId = bookInEdge[0]._to;
    const deleteRet = await participateEdgeCollection.removeByExample({ _from: roomConfigId });
  } else {
    const newRoomConfig = await roomConfigsCollection.save({ roomType: 'sg' });
    await bookInEdgeCollection.save({ _from: `serviceBookings/${serviceBookingKey}`, _to: newRoomConfig._id });
    roomConfigId = newRoomConfig._id;
  }
  const roomConfigToPaxsEdges = paxKeys.map(paxKey => ({ _from: roomConfigId, _to: `paxs/${paxKey}` }));
  const updateRet = await participateEdgeCollection.import(roomConfigToPaxsEdges);
  return serviceBookingsCollection.firstExample({ _key: serviceBookingKey });
}

// get the default preselection tours for the agent of that city
async function getDefaultTours(locationId, officesId) {
  const aqlQuery = `
    let toursOfCity = (FOR vertex, edge IN 1..1 INBOUND @locationId GRAPH 'exo-dev'
      FILTER IS_SAME_COLLECTION('tours', vertex)
      RETURN vertex._id)
    let defaultTours = (
      FOR selection IN selectedFor
      FILTER selection._from == @officesId && selection.default == true
      RETURN selection._to)
    let tourIds = INTERSECTION(toursOfCity, defaultTours)
    for tourId in tourIds
      return document(tourId)
  `;

  const result = await db.query(aqlQuery, {
    locationId, officesId
  });

  return result.next();
}

export { getAccessibleTours, updateTourPaxs, getDefaultTours };
