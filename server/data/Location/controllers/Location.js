import { db } from '../../database';

const collection = db.edgeCollection('locations');


async function getLocation(_key) {
  try {
    if (!_key) {
      const cursor = await collection.all();
      let result = cursor._result;
      if (cursor.hasNext()) {
        result = await cursor.all();
      }
      return result;
    }
    return await collection.firstExample({ _key });
  } catch (e) {
    console.error(e);
    return null;
  }
}


async function getAllLocations() {
  const aqlQuery = `
    RETURN UNIQUE(
        FOR location IN locations
              FOR vertex, edge, path  
              IN 0..1 OUTBOUND location._id
              GRAPH 'exo-dev'
              FILTER 
                  NOT IS_NULL(vertex) AND
                  IS_SAME_COLLECTION('locations', vertex) AND
                  ((
                    LENGTH (path.vertices) == 2 AND 
                    path.vertices[1].type == 'country'
                  ) OR (
                     LENGTH (path.vertices) == 1 AND 
                    path.vertices[0].type == 'country'
                  ))
              RETURN path.vertices
    )
  `;

  const result = await db.query(aqlQuery);
  return result.next();
}


async function getSupervisor(locationKey) {
  const aqlQuery = `
      FOR user, edge
      IN 2..3 INBOUND @locationId GRAPH 'exo-dev'
      FILTER edge.isSupervisor == true
      RETURN user
  `;

  const result = await db.query(aqlQuery, {
    locationId: `locations/${locationKey}`
  });

  return result.next();
}


export {
  getLocation,
  getAllLocations,
  getSupervisor
};
