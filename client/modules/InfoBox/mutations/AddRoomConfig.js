import Relay from 'react-relay';

export default class AddRoomConfig extends Relay.Mutation {
  getMutation() {
    return Relay.QL`mutation{addRoomConfig}`;
  }

  getVariables() {
    return {
      serviceBookingKey: this.props.serviceBookingKey,
      roomType: this.props.roomType,
      paxKeys: this.props.paxKeys,
    };
  }

  getFatQuery() {
    return Relay.QL`
      fragment on AddRoomConfigPayload {
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
