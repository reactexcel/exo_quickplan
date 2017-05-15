import Relay from 'react-relay';

export default class UpdateTransferPlacementMutation extends Relay.Mutation {
  getMutation() {
    return Relay.QL`mutation {updateTransferPlacement}`;
  }

  getVariables() {
    const { isLocaltransfer, proposalKey, n_city_key, n_day_id, n_remove_local_transferPlacementKey, transferPlacementKey, selectedTransferKeys, durationDays, serviceBookingData, startDate } = this.props;

    return {
      isLocaltransfer,
      proposalKey,
      n_city_key,
      n_day_id,
      n_remove_local_transferPlacementKey,
      transferPlacementKey,
      selectedTransferKeys,
      durationDays,
      serviceBookingData,
      startDate
    };
  }

  getFatQuery() {
    return Relay.QL`
      fragment on UpdateTransferPlacementPayload {
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
