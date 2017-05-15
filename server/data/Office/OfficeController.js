import { db } from '../database';

async function getAllOffices(type) {
  const aqlQuery = `
    FOR office IN offices
    FILTER
      office.type == @type
    Sort office.companyName
    RETURN office
  `;

  const result = await db.query(aqlQuery, {
    type
  });
  // console.log(result);
  return result.all();
}

async function getOffice(officeKey) {
  const aqlQuery = `
    FOR office IN offices
    FILTER
      office._id == @officeId
    RETURN office
  `;

  const result = await db.query(aqlQuery, {
    officeId: `offices/${officeKey}`
  });
  return result.next();
}


async function getUsers(officeKey) {
  const aqlQuery = `
    FOR vertex, edge
    IN 1..1 INBOUND @officeId GRAPH 'exo-dev'
    FILTER
        IS_SAME_COLLECTION('users', vertex) AND
        IS_SAME_COLLECTION('worksFor', edge)
    RETURN vertex
  `;

  const result = await db.query(aqlQuery, {
    officeId: `offices/${officeKey}`
  });

  return result.all();
}


async function getSupervisor(officeKey) {
  const aqlQuery = `
    FOR user, edge
      IN 1..1 INBOUND @officeId GRAPH 'exo-dev'
      FILTER edge.isSupervisor == true
      RETURN user
  `;

  const result = await db.query(aqlQuery, {
    officeId: `offices/${officeKey}`
  });

  return result.next();
}


export {
  getAllOffices,
  getUsers,
  getOffice,
  getSupervisor
};
