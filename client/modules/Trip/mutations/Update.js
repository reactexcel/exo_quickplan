import Relay from 'react-relay';

export default class UpdateTripMutation extends Relay.Mutation {
  getMutation() {
    return Relay.QL`mutation {updateTrip}`;
  }

  getVariables() {
    const { _key, name, status, notes, startDate, endDate, duration } = this.props;
    return { _key, name, status, notes, startDate, endDate, duration };
  }

  getFatQuery() {
    return Relay.QL`
      fragment on UpdateTripPayload {
        trip {
          name, status, notes, startDate, endDate, duration
        }
      }
    `;
  }

  getConfigs() {
    return [{
      type: 'FIELDS_CHANGE',
      fieldIDs: {
        trip: this.props.id
      }
    }];
  }
}
