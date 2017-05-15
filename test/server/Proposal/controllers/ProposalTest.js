/* eslint-disable no-unused-expressions */

import chai from 'chai';
import { addProposal } from '../../../../server/data/Proposal/controllers/Proposal';

const expect = chai.expect;

// FIXME, the arangojs db did not init in test case
describe('Proposal', () => {
  it('Add new proposal', async function test() {
    const props = {
      startTravelInCity: 'Bangkok',
      startTravelOnDate: '2017-10-10',
      travelDuration: 14,
      nrAdult: 1,
      nrChildren: 1,
      nrInfant: 1,
      notes: 'A note...',
      class: 3,
      style: ['Active', 'Wellness & Spirit', 'Nature & Wildlife'],
      occasion: ['Anniversary', 'Graduation'],
      preferredLanguage: 'English'
    };

    const proposalDoc = await addProposal(props);

    // expect(proposalDoc._id).is.not.empty;
    expect(proposalDoc).to.be.a('object');
  });
});
