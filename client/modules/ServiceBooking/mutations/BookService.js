import Relay from 'react-relay';

export default class TripPlannerBookServiceMutation extends Relay.Mutation {

  static fragments = {
    serviceBookings: () => Relay.QL`
    fragment on ServiceBooking {
      id
      _key
      status {
        tpBookingStatus
        state
      }
    }
    `
  };

  getMutation() {
    return Relay.QL`mutation{addTourplanBooking}`;
  }

  getVariables() {
    return {
      serviceBookingKey: this.props.serviceBookings._key
    };
  }

  getFatQuery() {
    return Relay.QL`
      fragment on AddTourplanBookingPayload {
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
