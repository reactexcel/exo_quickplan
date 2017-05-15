import Relay from 'react-relay';

export default class AddCityDayMutation extends Relay.Mutation {
  getMutation() {
    return Relay.QL`mutation{addCityDay}`;
  }

  getVariables() {
    return {
      cityBookingKey: this.props.cityBookingKey,
      dayIndex: this.props.dayIndex
    };
  }

  getFatQuery() {
    return Relay.QL`
      fragment on AddCityDayPayload {
        cityBooking
      }
    `;
  }

  getConfigs() {
    return [{
      type: 'FIELDS_CHANGE',
      fieldIDs: {
        cityBooking: this.props.id
      }
    }];
  }
}
