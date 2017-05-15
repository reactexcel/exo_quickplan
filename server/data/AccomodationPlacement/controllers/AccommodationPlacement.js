import { db } from '../../database';
import {
  getServiceBookings,
  remove as removeServiceBooking
} from '../../ServiceBooking/controllers/ServiceBooking';

import config from '../../../config/environment';

const graph = db.graph(config.arango.databaseName);
const accommodationPlacements = graph.vertexCollection('accommodationPlacements');


const remove = async (accommodationPlacementKey) => {
  // get and remove cityDay serviceBookings
  const serviceBookings = await getServiceBookings(`accommodationPlacements/${accommodationPlacementKey}`);
  await Promise.all(serviceBookings.map(({ _key }) => removeServiceBooking(_key)));

  return accommodationPlacements.remove(accommodationPlacementKey);
};

async function getAccommodationPlacements(vertexId) {
  const aqlQuery = `
    FOR vertex, edge
    IN 1..1 OUTBOUND @vertexId 
    GRAPH 'exo-dev'
    FILTER 
      IS_SAME_COLLECTION('accommodationPlacements', vertex) AND
      IS_SAME_COLLECTION('bookIn', edge)
    RETURN vertex
  `;

  const result = await db.query(aqlQuery, { vertexId });
  return result.all();
}


export {
  remove,
  getAccommodationPlacements
};
