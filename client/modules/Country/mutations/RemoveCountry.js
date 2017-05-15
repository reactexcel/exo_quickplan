import Relay from 'react-relay';

export default class TripPlannerRemoveCountryMutation extends Relay.Mutation {
  getMutation() {
    return Relay.QL`mutation{removeCountryTripPlanner}`;
  }

  getVariables() {
    return {
      tripId: this.props.tripId,
      tripKey: this.props.tripKey,
      removedIndex: this.props.removedIndex
    };
  }

  getFatQuery() {
    return Relay.QL`
      fragment on RemoveCountryTripPlannerPayload {
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

