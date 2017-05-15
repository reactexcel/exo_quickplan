import Relay from 'react-relay';

export default class DeletePaxMutation extends Relay.Mutation {
  getMutation() {
    return Relay.QL`mutation{deletePax}`;
  }

  getVariables() {
    const { paxKey, proposalKey } = this.props;
    const vars = {
      paxKey,
      proposalKey
    };
    return vars;
  }

  getFatQuery() {
    return Relay.QL`
      fragment on DeletePaxPayload {
        paxKey
      }
    `;
  }

  getConfigs() {
    return [{
      type: 'FIELDS_CHANGE',
      fieldIDs: {
        paxKey: this.props.paxKey
      }
    }];
  }
}
