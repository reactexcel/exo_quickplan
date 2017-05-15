import Relay from 'react-relay';

export default class DeleteTripMutation extends Relay.Mutation {
  getMutation() {
    return Relay.QL`mutation{deleteTrip}`;
  }

  getVariables() {
    const { tripKey } = this.props;
    return { tripKey };
  }

  getFatQuery() {
    return Relay.QL`
      fragment on DeleteTripPayload {
        tripKey
      }
    `;
  }

  getConfigs() {
    return [{
      type: 'FIELDS_CHANGE',
      fieldIDs: {
        tripKey: this.props.tripKey
      }
    }];
  }
}
