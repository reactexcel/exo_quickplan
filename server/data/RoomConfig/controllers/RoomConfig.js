import { db } from '../../database';
import {
  remove as removePax,
  getPaxs
} from '../../Pax/controllers/Pax';
import config from '../../../config/environment';


const graph = db.graph(config.arango.databaseName);
const roomConfigs = graph.vertexCollection('roomConfigs');


/**
 * Remove room config and related data
 * @param {string} roomConfigKey
 * @return {Promise}
 */
const remove = async (roomConfigKey) => {
  // get and remove roomConfig paxs
  const paxs = await getPaxs(`roomConfigs/${roomConfigKey}`);
  await Promise.all(paxs.map(({ _key }) => removePax(_key)));

  // remove room config inbound edges (bookIn) and room config itself
  return roomConfigs.remove(roomConfigKey);
};

const getRoomConfigs = async (vertexId) => {
  const aqlQuery = `
      FOR roomConfig
          IN 1..1 OUTBOUND @vertexId GRAPH 'exo-dev'
          FILTER
              IS_SAME_COLLECTION('roomConfigs', roomConfig)
          RETURN roomConfig
  `;

  const result = await db.query(aqlQuery, { vertexId });

  return result.all();
};


export {
  remove,
  getRoomConfigs
};
