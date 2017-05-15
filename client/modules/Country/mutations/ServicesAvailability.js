import Relay from 'react-relay';

export default class CountryServicesAvailabilityMutation extends Relay.Mutation {

  getMutation() {
    return Relay.QL`mutation{updateCountryServicesAvailability}`;
  }

  getVariables() {
    return {
      id: 'countryBookings/'.concat(this.props.countryBooking._key)
    };
  }

  getFatQuery() {
    return Relay.QL`
      fragment on UpdateCountryServicesAvailabilityPayload {
        countryBooking
      }
    `;
  }

  getConfigs() {
    return [{
      type: 'FIELDS_CHANGE',
      fieldIDs: {
        countryBooking: this.props.countryBooking.id
      }
    }];
  }
}
