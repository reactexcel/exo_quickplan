import Relay from 'react-relay';

export default class CloneTripMutation extends Relay.Mutation {
  getMutation() {
    return Relay.QL`mutation{cloneTrip}`;
  }

  getVariables() {
    const { tripKey } = this.props;
    return { tripKey };
  }

  getFatQuery() {
    return Relay.QL`
      fragment on CloneTripPayload {
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
