import Relay from 'react-relay';

export default class UpdateAccommodationPlacementMutation extends Relay.Mutation {
  getMutation() {
    return Relay.QL`mutation {updateAccommodationPlacement}`;
  }

  getVariables() {
    const {
      cityBookingKey,
      accommodationPlacementKey,
      selectedAccommodationKeys,
      preselectedAccommodationKeys,
      durationNights,
      startDay,
      placeholders,
      startDate
    } = this.props;

    let action = this.props.action;

    // action property will be pre-set only if it's the "Delete" action
    if (!action) {
      if (accommodationPlacementKey) action = 'Update';
      else action = 'Add';
    }

    return {
      cityBookingKey,
      accommodationPlacementKey,
      selectedAccommodationKeys,
      preselectedAccommodationKeys,
      durationNights,
      startDay,
      action,
      placeholders,
      startDate
    };
  }

  getFatQuery() {
    return Relay.QL`
      fragment on UpdateAccommodationPlacementPayload {
        cityBooking
      }
    `;
  }

  getConfigs() {
    return [{
      type: 'FIELDS_CHANGE',
      fieldIDs: {
        cityBooking: this.props.cityBookingId
      }
    }];
  }
}
