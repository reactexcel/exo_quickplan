import Relay from 'react-relay';

export default class CloneProposalMutation extends Relay.Mutation {
  getMutation() {
    return Relay.QL`mutation{cloneProposal}`;
  }

  getVariables() {
    const { proposalKey, userToken } = this.props;
    return { proposalKey, userToken };
  }

  getFatQuery() {
    return Relay.QL`
      fragment on CloneProposalPayload {
        proposal
      }
    `;
  }

  getConfigs() {
    return [{
      type: 'REQUIRED_CHILDREN',
      children: [
        Relay.QL`
          fragment on CloneProposalPayload {
            proposal {
             _key
              travelDuration
              status
              startTravelOnDate
              startTravelIn {
                _key
                name
              }
              updatedOn
              mainPax {
                firstName
                lastName
              }
              tripsCount
              TC {
                _key
                firstName
                lastName
                office {
                  _key
                  officeName
                }
              }
              TA {
                firstName
                lastName
                office {
                 _key
                  companyName
                }
              }
              bookedTrip {
                combinerCountryBooking {
                  tpBookingRef
                }
              }
            }
          }
        `,
      ],
    }];
  }
}
