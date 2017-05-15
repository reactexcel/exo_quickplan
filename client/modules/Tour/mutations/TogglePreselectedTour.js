import Relay from 'react-relay';

export default class TogglePreselectedTour extends Relay.Mutation {
  getMutation() {
    return Relay.QL`mutation {togglePreselection}`;
  }

  getVariables() {
    const { cityDayKey, tourKey, isPreselected, startSlot } = this.props;

    return {
      cityDayKey,
      tourKey,
      isPreselected: !isPreselected,
      startSlot
    };
  }

  getFatQuery() {
    return Relay.QL`
      fragment on TogglePreselectedStateTourToCityDayPayload {
        tour  {
          isPreselected
        }
      }
    `;
  }

  getConfigs() {
    return [{
      type: 'FIELDS_CHANGE',
      fieldIDs: {
        tour: this.props.tourId
      }
    }];
  }
}
