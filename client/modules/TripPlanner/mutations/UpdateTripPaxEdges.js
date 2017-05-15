import Relay from 'react-relay';

export default class UpdateTripPaxEdges extends Relay.Mutation {
  getMutation() {
    return Relay.QL`mutation {UpdateTripPaxEdges}`;
  }

  getVariables() {
    return this.props;
  }

  getFatQuery() {
    return Relay.QL`
      fragment on UpdateTripPaxEdgesPayload {
        tripPaxs 
      }
    `;
  }

  getConfigs() {
    return [{
      type: 'REQUIRED_CHILDREN',
      children: [
        Relay.QL`
          fragment on UpdateTripPaxEdgesPayload {
            tripPaxs {
               _key
               ageGroup
               firstName
               lastName
            }
          }
        `
      ]
    }];
  }
}
