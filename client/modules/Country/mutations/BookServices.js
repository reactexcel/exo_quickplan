import Relay from 'react-relay';

export default class CountryBookServiceMutation extends Relay.Mutation {

  getMutation() {
    return Relay.QL `mutation{addTourplanCountryBooking}`;
  }
  getVariables() {
    return {
      countryBookingKey: this.props.countryBookingKey
    };
  }
  getFatQuery() {
    return Relay.QL `
      fragment on AddTourplanCountryBookingPayload {
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
