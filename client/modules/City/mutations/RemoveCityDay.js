import Relay from 'react-relay';

export default class RemoveCityDayMutation extends Relay.Mutation {
  getMutation() {
    return Relay.QL`mutation{removeCityDay}`;
  }

  getVariables() {
    return {
      cityDayKey: this.props.cityDayKey
    };
  }

  getFatQuery() {
    return Relay.QL`
      fragment on RemoveCityDayPayload {
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
