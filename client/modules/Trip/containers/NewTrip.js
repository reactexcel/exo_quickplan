import Relay from 'react-relay';

class NewTripMutation extends Relay.Mutation {

  props = {
    travelCompany: this.props.travelCompany,
    travelAgent: this.props.travelAgent,
    leadCustomer: this.props.leadCustomer,
    startDate: this.props.startDate,
    tripDuration: this.props.tripDuration,
    country: this.props.country,
    city: this.props.city,
    mainPAX: this.props.mainPAX
  };


  getMutation() {
    return Relay.QL`
        mutation { addTripTripPlanner }
    `;
  }

  getVariables() {
    return this.props;
  }

  getFatQuery() {
    return Relay.QL`
      fragment on AddTripTripPlannerPayload {
          travelCompany
          travelAgent
          leadCustomer
          startDate
          tripDuration
          country
          city
          mainPAX {
            title
            firstName
            lastName
            passportNumber
            passportCountry
            adult
            children
            infant
            dietary {
              vegetarian
              vegan
              kosher
              halal
            }
            allergy
          }
      }`;
  }

  getConfigs() {
    return [{
      type: 'FIELDS_CHANGE',
      fieldIDs: this.props
    }];
  }

}

export default NewTripMutation;
