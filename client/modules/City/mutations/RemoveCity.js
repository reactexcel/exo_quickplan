import Relay from 'react-relay';

export default class TripPlannerRemoveCountryMutation extends Relay.Mutation {
  getMutation() {
    return Relay.QL`mutation{removeCityTripPlanner}`;
  }

  getVariables() {
    return {
      tripId: this.props.tripId,
      tripKey: this.props.tripKey,
      countryIndex: this.props.countryIndex,
      cityIndex: this.props.cityIndex,
      countryBookingKey: this.props.countryBookingKey,
      cityBookingKey: this.props.cityBookingKey
    };
  }

  getFatQuery() {
    return Relay.QL`
      fragment on RemoveCityTripPlannerPayload {
        trips
      }
    `;
  }

  getConfigs() {
    return [{
      type: 'FIELDS_CHANGE',
      fieldIDs: {
        trips: this.props.tripId
      }
    }];
  }
}

