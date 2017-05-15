import Relay from 'react-relay';

export default class TripPlannerBookServicesMutation extends Relay.Mutation {

  // static fragments = {
  //   serviceBookings: () => Relay.QL`
  //   fragment on ServiceBooking {
  //     id
  //     _key
  //     status {
  //       tpBookingStatus
  //       state
  //     }
  //   }
  //   `
  // };

  getMutation() {
    return Relay.QL`mutation{addTourplanBookings}`;
  }

  getVariables() {
    return {
      serviceBookingKeys: this.props.serviceBookings.map(s => s._key)
    };
  }

  getFatQuery() {
    return Relay.QL`
      fragment on AddTourplanBookingsPayload {
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
