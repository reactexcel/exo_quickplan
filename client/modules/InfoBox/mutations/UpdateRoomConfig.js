import Relay from 'react-relay';

export default class AddRoomConfig extends Relay.Mutation {
  getMutation() {
    return Relay.QL`mutation{updateRoomConfig}`;
  }

  getVariables() {
    const { roomConfigId, roomType, paxKeys } = this.props;

    return {
      roomConfigId,
      roomType,
      paxKeys
    };
  }

  getFatQuery() {
    return Relay.QL`
      fragment on UpdateRoomConfigPayload {
        roomConfig
      }
    `;
  }

  getConfigs() {
    return [{
      type: 'FIELDS_CHANGE',
      fieldIDs: {
        roomConfig: this.props.roomConfigId
      }
    }];
  }
}
