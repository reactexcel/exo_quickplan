import Relay from 'react-relay';

export default class CityCancelServiceMutation extends Relay.Mutation {
  getMutation() {
    return Relay.QL`mutation{cancelTourplanCityBooking}`;
  }

  getVariables() {
    return {
      cityBookingKey: this.props.cityBookingKey
    };
  }

  getFatQuery() {
    return Relay.QL`
      fragment on CancelTourplanCityBookingPayload {
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
