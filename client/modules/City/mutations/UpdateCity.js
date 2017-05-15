import Relay from 'react-relay';

export default class TripPlannerUpdateCityMutation extends Relay.Mutation {
  getMutation() {
    return Relay.QL`mutation{updateCityTripPlanner}`;
  }

  getVariables() {
    return {
      countryIndex: this.props.countryIndex,
      cityIndex: this.props.cityIndex,
      durationNights: this.props.durationNights,
      cityName: this.props.cityName
    };
  }

  getFatQuery() {
    return Relay.QL`
      fragment on UpdateCityTripPlannerPayload {
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

