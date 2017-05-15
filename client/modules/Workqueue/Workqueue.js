import React, { Component } from 'react';
import _ from 'lodash';
import { PT } from 'proptypes-parser';
import Relay from 'react-relay';
import Header from './WorkqueueHeader';
import Paginator from './Paginator';
import CloneProposalMutation from '../Proposal/mutations/CloneProposal';
import WorkqueueTable from './WorkqueueTable/WorkqueueTable';
import RemoveProposal from '../Proposal/mutations/Remove';


export default class Workqueue extends Component {
  static propTypes = PT`{
    viewer: {
      user: {
        role: String!
        _key: String!
        supervisingTCs: [{
          _key: String!
          firstName: String!
          lastName: String!
        }]!
        proposals: [{
          _key: String!
          startTravelIn: {
            _key: String
            name: String
          }
          private: Boolean!
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
      }!
      offices: [{
        _key: String!
        companyName: String
        officeName: String
      }]

      locations: [{
        _key: String!
        name: String!
      }]
    }!
  }`;


  constructor(props) {
    super(props);

    const { proposals } = props.viewer.user;
    this.state = {
      page: 1,
      proposals
    };
  }

  goToPage = (page) => {
    this.setState({ page });
  }


  sortBy(field, sortOrder) {
    this.setState(({ proposals }) => {
      let sortedProposals = _.sortBy(proposals, field);
      if (sortOrder === 'DESC') {
        sortedProposals = _.reverse(sortedProposals);
      }

      return {
        page: 1,
        proposals: sortedProposals,
        sortField: field,
      };
    });
  }

  componentWillReceiveProps({ viewer: { user: { proposals } } }) {
    this.setState({ proposals });
  }


  changeProposalTC = ({ proposalKey, userKey }) => {
    this.setState((prevState, props) => {
      const { proposals } = prevState;
      const { supervisingTCs } = props.viewer.user;

      const proposalToUpdateIndex = proposals
        .findIndex(proposal => proposal._key === proposalKey);
      const proposalToUpdate = _.cloneDeep(proposals[proposalToUpdateIndex]);


      proposalToUpdate.TC = supervisingTCs
        .find(user => userKey === user._key) || {
          office: {}
        };

      return {
        proposals: [
          ...proposals.slice(0, proposalToUpdateIndex),
          proposalToUpdate,
          ...proposals.slice(proposalToUpdateIndex + 1)
        ]
      };
    });
  };


  cloneProposal = (proposalKey) => {
    const { auth } = this.props;

    Relay.Store.commitUpdate(new CloneProposalMutation({
      proposalKey,
      userToken: auth.getAccessToken(),
    }), {
      onSuccess: ({ cloneProposal: { proposal } }) => {
        this.setState((prevState) => {
          const { proposals } = prevState;
          const beforeProposalIndex = proposals.findIndex(p => p._key === proposalKey);

          return {
            proposals: [
              ...proposals.slice(0, beforeProposalIndex),
              proposal,
              ...proposals.slice(beforeProposalIndex)
            ]
          };
        });
      },
      onFailure: response => console.error('proposal details clone failed', response) // eslint-disable-line no-console
    });
  };


  removeProposal = (proposalKey) => {
    Relay.Store.commitUpdate(new RemoveProposal({ proposalKey }), {
      onSuccess: () => this.props.relay.forceFetch()
    });
  };


  /*

  changeProposalLocation = ({ proposal: { _key: proposalKey }, selectedLocation }) => {
    this.setState((prevState, props) => {
      const { proposals } = prevState;
      const { locations } = props.viewer;

      const proposalToUpdateIndex = proposals
        .findIndex(proposal => proposal._key === proposalKey);
      const proposalToUpdate = _.cloneDeep(proposals[proposalToUpdateIndex]);

      proposalToUpdate.startTravelIn = locations
        .find(location => selectedLocation === location._key) || {};

      return {
        proposals: [
          ...proposals.slice(0, proposalToUpdateIndex),
          proposalToUpdate,
          ...proposals.slice(proposalToUpdateIndex + 1)
        ]
      };
    });
  };
*/


  render() {
    const limit = 20;
    const {
      user: {
        _key: userKey,
        supervisingTCs,
        role
      },
    } = this.props.viewer;
    const { proposals, page } = this.state;
    const pageProposals = proposals.slice(
      (page - 1) * limit,
      page * limit
    );


    return (<div style={{ backgroundColor: 'white', padding: '5px 2%', margin: '18px 2%' }}>
      <Header
        proposals={proposals}
        goToPage={this.goToPage}
        limit={20}
        page={page}
      />
      <WorkqueueTable
        user={{ userKey, supervisingTCs, role }}
        proposals={pageProposals}
        cloneProposal={this.cloneProposal}
        removeProposal={this.removeProposal}
        sortBy={(field, sortOrder) => this.sortBy(field, sortOrder)}
        changeProposalTC={this.changeProposalTC}
        auth={this.props.auth}
      />
      <h1 className='align-center'>
        <Paginator
          proposals={proposals}
          goToPage={this.goToPage}
          limit={limit}
          page={page}
        />
      </h1>

    </div>);
  }
}
