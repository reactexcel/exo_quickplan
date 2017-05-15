import { db } from '../database';


const isSuperAdmin = ({
  role
}) => role === 'superadmin';


const isCountrySupervisor = ({
  role,
  isSupervisor
}) => role === 'TC' && isSupervisor;


const isOfficeSupervisor = ({
  role,
  isSupervisor
}) => role === 'TA' && isSupervisor;


async function getOffice(userKey) {
  const aqlQuery = `
    FOR office
        IN 1..1 OUTBOUND @userId GRAPH 'exo-dev'
        FILTER
            IS_SAME_COLLECTION('offices', office)
        RETURN office
  `;

  const result = await db.query(aqlQuery, {
    userId: `users/${userKey}`
  });

  return result.next();
}


async function getSuperAdminProposals() {
  const aqlQuery = `
    FOR proposal IN proposals
      RETURN proposal
  `;

  const result = await db.query(aqlQuery);
  return result.all();
}

/**
 * 1) Find countryId by userId
 *    The only possible path:
 *      worksFor (isSupervisor: true)
 *      -> office (type: 'EXO')
 *      optional [
 *      -> locatedIn
 *      -> location (type: 'city')
 *      ]
 *      -> locatedIn
 *      -> location ('type: 'country')
 * 2) Having countryId find all proposals
 *  a) Find all proposals located in the found country
 *    or any city of the found country.
 *  b) Find all proposals assigned to the TCs and TAUs
 *    from the offices of the found country or country cities
 *  c) Find all proposals created by the user
 *    which might not belong to the found country
 * 3) Union all found in step 2 proposals
 *    and return distinct ones
 * @param {string} userKey
 * @returns {Promise.<object[], Error>}
 */
async function getCountrySupervisorProposals(userKey) {
  const aqlQuery = `
    FOR v, e, p
      IN 2..3 OUTBOUND @userId GRAPH 'exo-dev'
      FILTER
          p.edges[0].isSupervisor == true AND
          p.vertices[1].type == 'EXO' AND
          p.vertices[2].type == 'city' AND
          v.type == 'country' AND
          IS_SAME_COLLECTION('locations', v)
      LET countryId =  v._id

      LET countryProposals = (
          FOR proposal IN
              1..2 INBOUND countryId GRAPH 'exo-dev'
              FILTER
                  IS_SAME_COLLECTION ('proposals', proposal)
              RETURN proposal
      )

      LET countryUserProposals = (
          FOR proposal IN
              3..4 INBOUND countryId GRAPH 'exo-dev'
              FILTER
                  IS_SAME_COLLECTION('proposals', proposal)
              RETURN proposal
      )

      LET userCreatedProposals = (
          FOR proposal, edge IN
              1..1 INBOUND @userId GRAPH 'exo-dev'
              FILTER
                  IS_SAME_COLLECTION('proposals', proposal) AND
                  edge.created == true
              RETURN proposal
      )

      RETURN UNION_DISTINCT(
          countryProposals,
          countryUserProposals,
          userCreatedProposals
      )
  `;

  const result = await db.query(aqlQuery, {
    userId: `users/${userKey}`
  });

  return result.next();
}


async function getOfficeSupervisorProposals(userKey) {
  const aqlQuery = `
    LET officeId = FIRST(
        FOR v, e, p
        IN 0..1 OUTBOUND @userId GRAPH 'exo-dev'
        FILTER
            p.edges[0].isSupervisor == true AND
            IS_SAME_COLLECTION('offices', v)
        RETURN v._id
    )

    LET officeProposals = (
        FOR proposal, edge, p
        IN 2..2 INBOUND officeId GRAPH 'exo-dev'
        FILTER
            IS_SAME_COLLECTION('users', p.vertices[1]) AND
            p.vertices[1].role == "TA" AND
            IS_SAME_COLLECTION('proposals', proposal)
        RETURN proposal
    )

    LET userCreatedProposals = (
        FOR proposal, edge
        IN 1..1 INBOUND @userId GRAPH 'exo-dev'
        FILTER
            IS_SAME_COLLECTION('proposals', proposal) AND
            edge.created == true
        RETURN proposal
    )

    RETURN UNION_DISTINCT(officeProposals, userCreatedProposals)
  `;

  const result = await db.query(aqlQuery, {
    userId: `users/${userKey}`
  });

  return result.next();
}


async function getProposals({ userKey, role, isSupervisor }) {
  if (isSuperAdmin({ role })) {
    return getSuperAdminProposals();
  }

  if (isCountrySupervisor({ role, isSupervisor })) {
    return getCountrySupervisorProposals(userKey);
  }

  if (isOfficeSupervisor({ role, isSupervisor })) {
    return getOfficeSupervisorProposals(userKey);
  }

  const aqlQuery = `
    FOR vertex, edge
      IN 1..1 INBOUND @userId GRAPH 'exo-dev'
      FILTER IS_SAME_COLLECTION('proposals', vertex)
      RETURN distinct vertex
  `;

  const result = await db.query(aqlQuery, {
    userId: `users/${userKey}`
  });

  return result.all();
}


async function getUserByKey(userKey) {
  const aqlQuery = `
    FOR user IN users
      FILTER user._id == @userId

      LET isSupervisor = ( (
          FOR edge IN worksFor
              FILTER edge._from == @userId
              RETURN edge.isSupervisor
      ) ANY == true )

      RETURN MERGE (user, { isSupervisor })
  `;

  const result = await db.query(aqlQuery, {
    userId: `users/${userKey}`
  });

  return result.next();
}


async function getUserByEmail(userEmail) {
  const aqlQuery = `
     FOR user IN users
        FILTER user.email == @userEmail

        LET isSupervisor = ( (
            FOR edge IN worksFor
                FILTER edge._from == user._id
                RETURN edge.isSupervisor
        ) ANY == true )

        RETURN MERGE (user, { isSupervisor })
  `;

  const result = await db.query(aqlQuery, { userEmail });
  return result.next();
}


function getUser({ userKey, userEmail }) {
  if (userKey) {
    return getUserByKey(userKey);
  } else if (userEmail) {
    return getUserByEmail(userEmail);
  }

  return Promise.resolve({});
}


async function getAllTCs() {
  const aqlQuery = `
    FOR user IN users
    FILTER
        user.role == 'TC' OR
        user.role == 'superadmin'
    RETURN user
  `;

  const result = await db.query(aqlQuery);
  return result.all();
}


async function getSameOfficeTCs(userKey) {
  const aqlQuery = `
    LET officeId = FIRST(
        FOR vertex, edge
        IN 1..1 OUTBOUND @userId GRAPH 'exo-dev'
        FILTER
            IS_SAME_COLLECTION('offices', vertex) AND
            edge.isSupervisor == true AND
            vertex.type == 'EXO'
        RETURN vertex._id
    )

    FOR vertex
    IN 1..1 INBOUND officeId GRAPH 'exo-dev'
    RETURN vertex
  `;


  const result = await db.query(aqlQuery, {
    userId: `users/${userKey}`
  });

  return result.all();
}


function getSupervisingTCs({ _key: userKey, role, isSupervisor }) {
  if (isSuperAdmin({ role })) {
    return getAllTCs();
  }

  if (isCountrySupervisor({ role, isSupervisor })) {
    return getSameOfficeTCs(userKey);
  }

  return null;
}


export {
  getOffice,
  getProposals,
  getUser,
  getSupervisingTCs,
  getUserByEmail
};
