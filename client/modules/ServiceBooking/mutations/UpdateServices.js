import Relay from 'react-relay';

export default class UpdateServiceBooking extends Relay.Mutation {
  getMutation() {
    return Relay.QL`mutation {updateToursByCityDayKey}`;
  }

  getVariables() {
    const { cityDayKey, tourKeys, placeholders } = this.props;

    return {
      cityDayKey,
      tourKeys,
      placeholders
    };
  }

  getFatQuery() {
    return Relay.QL`
      fragment on UpdateToursOfCityDayPayload {
        cityDays
      }
    `;
  }

  getConfigs() {
    return [{
      type: 'FIELDS_CHANGE',
      fieldIDs: {
        cityDays: this.props.id
      }
    }];
  }
}
