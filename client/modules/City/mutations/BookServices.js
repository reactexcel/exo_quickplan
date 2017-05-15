import Relay from 'react-relay';

export default class CityBookServiceMutation extends Relay.Mutation {

  getMutation() {
    return Relay.QL `mutation{addTourplanCityBooking}`;
  }
  getVariables() {
    return {
      cityBookingKey: this.props.cityBookingKey
    };
  }
  getFatQuery() {
    return Relay.QL `
      fragment on AddTourplanCityBookingPayload {
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
