import Relay from 'react-relay';

export default class CountryCancelServiceMutation extends Relay.Mutation {
  getMutation() {
    return Relay.QL`mutation{cancelTourplanCountryBooking}`;
  }

  getVariables() {
    return {
      countryBookingKey: this.props.countryBookingKey
    };
  }

  getFatQuery() {
    return Relay.QL`
      fragment on CancelTourplanCountryBookingPayload {
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
