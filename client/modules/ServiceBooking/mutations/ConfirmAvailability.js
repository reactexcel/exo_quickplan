import Relay from 'react-relay';

export default class ConfirmAvailabilityMutation extends Relay.Mutation {

  getMutation() {
    return Relay.QL`mutation{confirmServiceAvailability}`;
  }

  getVariables() {
    return {
      serviceBookingKey: this.props.serviceBookingKey
    };
  }

  getFatQuery() {
    return Relay.QL`
      fragment on ConfirmServiceAvailabilityPayload {
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
        serviceBooking: this.props.serviceBookingId
      }
    }];
  }
}
