import Relay from 'react-relay';

export default class ClearTransferPlacementMutation extends Relay.Mutation {
  getMutation() {
    return Relay.QL`mutation {clearTransferPlacement}`;
  }

  getVariables() {
    const { transferPlacementKey } = this.props;

    return {
      transferPlacementKey
    };
  }

  getFatQuery() {
    return Relay.QL`
      fragment on ClearTransferPlacementPayload {
        transferPlacement
      }
    `;
  }

  getConfigs() {
    return [{
      type: 'FIELDS_CHANGE',
      fieldIDs: {
        transferPlacement: this.props.transferPlacementId
      }
    }];
  }
}
