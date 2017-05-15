import Relay from 'react-relay';

export default class AddRoomConfig extends Relay.Mutation {
  getMutation() {
    return Relay.QL`mutation{removeRoomConfig}`;
  }

  getVariables() {
    return {
      serviceBookingKey: this.props.serviceBookingKey,
      roomConfigId: this.props.roomConfigId
    };
  }

  getFatQuery() {
    return Relay.QL`
      fragment on RemoveRoomConfigPayload {
        serviceBooking
      }
    `;
  }

  getConfigs() {
    return [{
      type: 'FIELDS_CHANGE',
      fieldIDs: {
        serviceBooking: this.props.serviceBookingKey
      }
    }];
  }
}
