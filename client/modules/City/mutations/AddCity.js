import Relay from 'react-relay';

export default class TripPlannerAddCityMutation extends Relay.Mutation {
  getMutation() {
    return Relay.QL`mutation{addCityBooking}`;
  }

  getVariables() {
    return {
      countryBookingKey: this.props.countryBookingKey,
      cityCode: this.props.cities[0],
      cityIndex: this.props.cityIndex
      // countryIndex: this.props.countryIndex,
      // cityOrder: this.props.cityOrder,
    };
  }

  getFatQuery() {
    return Relay.QL`
      fragment on AddCityBookingPayload {
        cityBooking
      }
    `;
  }

  getConfigs() {
    return [];
  }
}

