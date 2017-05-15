import Relay from 'react-relay';

export default class ChangeServiceDayMutation extends Relay.Mutation {
  getMutation() {
    return Relay.QL`mutation{changeServiceDaySlot}`;
  }

  getVariables() {
    return {
      serviceBookingKey: this.props.serviceBookingKey,
      cityDayKey: this.props.cityDayKey,
      startSlot: this.props.startSlot,
    };
  }

  getFatQuery() {
    return Relay.QL`
      fragment on ChangeServiceDaySlotPayload {
        serviceBooking
      }
    `;
  }

  getConfigs() {
    return [{
      type: 'FIELDS_CHANGE',
      fieldIDs: {
        serviceBooking: this.props.serviceBookingID
      }
    }];
  }
}
