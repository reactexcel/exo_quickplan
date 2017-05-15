import Relay from 'react-relay';

export default class AddTripMutation extends Relay.Mutation {
  getMutation() {
    return Relay.QL`mutation {addTrip}`;
  }

  getVariables() {
    return this.props;
  }

  getFatQuery() {
    return Relay.QL`
      fragment on AddTripPayload {
        trip
      }
    `;
  }

  getConfigs() {
    return [{
      type: 'REQUIRED_CHILDREN',
      children: [
        Relay.QL`
          fragment on AddTripPayload {
            trip {
              _key
            }
          }
        `
      ]
    }];
  }
}
