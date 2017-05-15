import Relay from 'react-relay';

export default class AddRoomConfig extends Relay.Mutation {
  getMutation() {
    return Relay.QL`mutation{updateTourPaxs}`;
  }

  getVariables() {
    const { serviceBookingKey, paxKeys } = this.props;

    return {
      serviceBookingKey,
      paxKeys
    };
  }

  getFatQuery() {
    return Relay.QL`
      fragment on UpdateTourPaxsPayload {
        serviceBooking
      }
    `;
  }

  getConfigs() {
    return [{
      type: 'FIELDS_CHANGE',
      fieldIDs: {
        serviceBooking: this.props.serviceBookingId
      }
    }];
  }
}
