import Relay from 'react-relay';

export default class TripBookServiceMutation extends Relay.Mutation {

  getMutation() {
    return Relay.QL `mutation{addTourplanTripBooking}`;
  }
  getVariables() {
    return {
      tripBookingKey: this.props.tripBookingKey
    };
  }
  getFatQuery() {
    return Relay.QL `
      fragment on AddTourplanTripBookingPayload {
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
