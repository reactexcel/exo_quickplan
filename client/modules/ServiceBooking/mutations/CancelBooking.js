import Relay from 'react-relay';

export default class TripPlannerCancelBookingMutation extends Relay.Mutation {
  getMutation() {
    return Relay.QL`mutation{cancelTourplanBooking}`;
  }

  getVariables() {
    return {
      serviceBookingKey: this.props.serviceBookings._key
    };
  }

  getFatQuery() {
    return Relay.QL`
      fragment on CancelTourplanBookingPayload {
        serviceBookings
      }
    `;
  }

  getConfigs() {
    return [{
      type: 'FIELDS_CHANGE',
      fieldIDs: {
        serviceBookings: this.props.serviceBookings.id
      }
    }];
  }
}
