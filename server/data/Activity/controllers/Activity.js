import { db } from '../../database';
import config from '../../../config/environment';


const graph = db.graph(config.arango.databaseName);
const activities = graph.vertexCollection('serviceBookings');


const remove = activityKey => activities.remove(activityKey);

/**
 * Get vertex-activity edges (records)
 * @param {string} vertexId
 * @return {Promise.<Error,object[]>}
 */
async function getActivities(vertexId) {
  const aqlQuery = `
    FOR activity, edge
    IN 1..1 OUTBOUND @vertexId 
    GRAPH 'exo-dev'
    FILTER 
      IS_SAME_COLLECTION('activities', activity) AND
      IS_SAME_COLLECTION('records', edge)
    RETURN activity
  `;

  const result = await db.query(aqlQuery, { vertexId });
  return result.all();
}


export { remove, getActivities };
