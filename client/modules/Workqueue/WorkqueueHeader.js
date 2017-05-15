import React from 'react';
import { PT } from 'proptypes-parser';
import Paginator from './Paginator';


const propTypes = PT`{
  proposals: [{
    _key: String!
    startTravelIn: {
      _key: String
      name: String
    }!
    startTravelOnDate: String!
    travelDuration: Number!
    updatedOn: String!
    status: String!
    mainPax: {
      firstName: String!
      lastName: String!
    }
    tripsCount: Number!
    TA: {
      firstName: String!
      lastName: String!
    }
    TC: {
      firstName: String!
      lastName: String!
      office: {
        officeName: String!
      }
    }!
    bookedTrip: {
      combinerCountryBooking: {
        tpBookingRef: String!
      }!
    }
  }!]!
}`;

const WorkqueueHeader = props => (<h1 className='center-align pb-10'>
  <span className='left'>Proposal</span>
  <span className='left ml-20 exo-colors-text fs-16 fw-600 pt-3'>Proposals {props.proposals.length}</span>
</h1>);


WorkqueueHeader.propTypes = propTypes;


export default WorkqueueHeader;
