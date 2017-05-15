import Relay from 'react-relay';

export default class RemoveLocalTransferMutation extends Relay.Mutation {
  getMutation() {
    return Relay.QL`mutation{removeLocalTransfer}`;
  }

  getVariables() {
    const { transferPlacementKey } = this.props;
    return {
      serviceBookingKey: transferPlacementKey
    };
  }

  getFatQuery() {
    return Relay.QL`
      fragment on RemoveLocalTransferPayload {
        serviceBookingKey
      }
    `;
  }

  getConfigs() {
    return [{
      type: 'FIELDS_CHANGE',
      fieldIDs: {
        serviceBookingKey: this.props.transferPlacementKey
      }
    }];
  }
}

