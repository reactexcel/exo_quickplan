import Relay from 'react-relay';

export default class CountryCityTreeMutation extends Relay.Mutation {

  getMutation() {
    return Relay.QL`
      mutation{ countryCityTreeMutation }
    `;
  }

  getVariables() {
    return {
      id: this.props.TreeStructure.id,
      Tree: JSON.stringify(this.props.TreeStructure.Tree),
      tripKey: this.props.tripKey
    };
  }

  getFatQuery() {
    return Relay.QL`
      fragment on CountryCityTreePayload {
        TreeStructure
      }`;
  }

  getConfigs() {
    return [{
      type: 'FIELDS_CHANGE',
      fieldIDs: {
        TreeStructure: this.props.TreeStructure.id
      }
    }];
  }
}
