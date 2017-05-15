import Relay from 'react-relay';

export default class TripCancelServiceMutation extends Relay.Mutation {
  getMutation() {
    return Relay.QL`mutation{cancelTourplanTripBooking}`;
  }

  getVariables() {
    return {
      tripBookingKey: this.props.tripBookingKey
    };
  }

  getFatQuery() {
    return Relay.QL`
      fragment on CancelTourplanTripBookingPayload {
        serviceBookings
      }
    `;
  }

  getConfigs() {
    return [{
      type: 'FIELDS_CHANGE',
      fieldIDs: {
        serviceBookings: this.props.id
      }
    }];
  }
}
