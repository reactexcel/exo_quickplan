import Relay from 'react-relay';

export default class TripToWordURLMutation extends Relay.Mutation {

  getMutation() {
    console.log('getMutation');
    return Relay.QL`
      mutation{ tripToWordURLMutation }
    `;
  }

  getVariables() {
    console.log('getVariables');
    return {
      id: this.props.tripKey,
      userToken: this.props.userToken,
      firstName: this.props.firstName,
      lastName: this.props.lastName,
      tripKey: this.props.tripKey,
      showLineAmounts: this.props.showLineAmounts,
      showCategoryAmounts: this.props.showCategoryAmounts,
      showImages: this.props.showImages,
      showDescriptions: this.props.showDescriptions,
      showDayNotes: this.props.showDayNotes
    };
  }

  getFatQuery() {
    console.log('getFatQuery');
    return Relay.QL`
      fragment on TripToWordURLPayload {
        wordFileURL
      }`;
  }

  getConfigs() {
    console.log('getConfigs');
    return [{
      type: 'FIELDS_CHANGE',
      fieldIDs: {
        wordFileURL: this.props.tripKey
      }
    }];
  }
}
