import Relay from 'react-relay';

// could used to check the services availibility in trip/country/city level.
export default class ServicesAvailabilityMutation extends Relay.Mutation {

  getMutation() {
    return Relay.QL`mutation{updateServicesAvailability}`;
  }

  getVariables() {
    return {
      // could be a tripId, countryId, CityId.
      id: this.props.startNodeId
    };
  }

  getFatQuery() {
    return Relay.QL`
      fragment on UpdateServicesAvailabilityPayload {
        serviceBookings {
          status
        }
      }
    `;
  }

  getConfigs() {
    return [{
      type: 'FIELDS_CHANGE',
      fieldIDs: {
        serviceBookings: this.props.startNodeId
      }
    }];
  }
}
