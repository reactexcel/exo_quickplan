import Relay from 'react-relay';

export default class TripPlannerUpdateDayMutation extends Relay.Mutation {
  getMutation() {
    return Relay.QL`mutation{updateDayTripPlanner}`;
  }

  getVariables() {
    return {
      dayKey: this.props.dayKey,
      unavailableSlots: this.props.unavailableSlots
    };
  }

  getFatQuery() {
    return Relay.QL`
      fragment on UpdateDayTripPlannerPayload {
        cityDays
      }
    `;
  }

  getConfigs() {
    return [{
      type: 'FIELDS_CHANGE',
      fieldIDs: {
        cityDays: this.props.dayKey
      }
    }];
  }
}
