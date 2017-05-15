import Relay from 'react-relay';

export default class CityServicesAvailabilityMutation extends Relay.Mutation {

  getMutation() {
    return Relay.QL`mutation{updateCityServicesAvailability}`;
  }

  getVariables() {
    return {
      id: 'cityBookings/'.concat(this.props.cityBooking._key)
    };
  }

  getFatQuery() {
    return Relay.QL`
      fragment on UpdateCityServicesAvailabilityPayload {
        cityBooking
      }
    `;
  }

  getConfigs() {
    return [{
      type: 'FIELDS_CHANGE',
      fieldIDs: {
        cityBooking: this.props.cityBooking.id
      }
    }];
  }
}
