import Relay from 'react-relay';

export default class TripPlannerAddCountryMutation extends Relay.Mutation {
  getMutation() {
    return Relay.QL`mutation{addCountryBooking}`;
  }

  getVariables() {
    return {
      tripKey: this.props.tripKey,
      countryCode: this.props.countryCode,
      order: this.props.order,
      addedIndex: this.props.addedIndex
    };
  }

  getFatQuery() {
    return Relay.QL`
      fragment on AddCountryBookingPayload {
        countryBooking
      }
    `;
  }

  getConfigs() {
    return [];
  }
}
