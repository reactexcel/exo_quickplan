import Relay from 'react-relay';

export default class TripPlannerCancelBookingsMutation extends Relay.Mutation {
  getMutation() {
    return Relay.QL`mutation{cancelTourplanBookings}`;
  }

  getVariables() {
    return {
      serviceBookingKeys: this.props.serviceBookings.map(s => s._key)
    };
  }

  getFatQuery() {
    return Relay.QL`
      fragment on CancelTourplanBookingsPayload {
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
