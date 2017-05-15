import { db } from '../data/database';

const proposals = db.collection('proposals');

// query the proposal already started.
async function updateProposalStatus() {
  // query all started proposals with the status didn't Archived
  const aqlQuery = `
  FOR proposal IN proposals
  FILTER proposal.status != 'Archived' AND IS_DATESTRING(proposal.startTravelOnDate)
     AND DATE_DIFF( DATE_TIMESTAMP(proposal.startTravelOnDate), DATE_NOW(), 'd', true) >= 0
     LET proposalStartedDays = DATE_DIFF( DATE_TIMESTAMP(proposal.startTravelOnDate), DATE_NOW(), 'd', true)
     LET status = proposal.travelDuration != null && proposal.travelDuration > 0
        && proposal.travelDuration < proposalStartedDays ? 'Archived' : 'On Tour'
     UPDATE proposal WITH { status:  status } IN proposals
  `;
  try {
    const result = await db.query(aqlQuery);
    return await result.next();
  } catch (ex) {
    console.log('updateProposalStatus failed', ex);
    return null;
  }
}

export default {
  expression: '*/30 * * * *',
  func: updateProposalStatus,
  immediateStart: true
};
