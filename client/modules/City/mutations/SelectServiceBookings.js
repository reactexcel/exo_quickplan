import Relay from 'react-relay';

export default class SelectServiceBookings extends Relay.Mutation {
  getMutation() {
    return Relay.QL`mutation {selectServiceBookings}`;
  }

  getVariables() {
    const { cityDayKey, tourKeys, selectedServiceBookingKeys } = this.props;

    return { cityDayKey, tourKeys, selectedServiceBookingKeys };
  }

  getFatQuery() {
    return Relay.QL`
      fragment on SelectServiceBookingsPayload {
        cityDayKey
      }
    `;
  }

  getConfigs() {
    return [{
      type: 'FIELDS_CHANGE',
      fieldIDs: {
        cityDayKey: this.props.cityDayKey
      }
    }];
  }
}
