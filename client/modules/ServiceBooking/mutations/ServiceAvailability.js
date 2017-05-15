import Relay from 'react-relay';

export default class ServiceAvailabilityMutation extends Relay.Mutation {

  getMutation() {
    return Relay.QL`mutation{updateServiceAvailability}`;
  }

  getVariables() {
    return {
      serviceBookingKey: this.props.serviceBooking._key
    };
  }

  getFatQuery() {
    return Relay.QL`
      fragment on UpdateServiceAvailabilityPayload {
        serviceBooking {
          status
        }
      }
    `;
  }

  getConfigs() {
    return [{
      type: 'FIELDS_CHANGE',
      fieldIDs: {
        serviceBooking: this.props.serviceBooking.id
      }
    }];
  }
}
