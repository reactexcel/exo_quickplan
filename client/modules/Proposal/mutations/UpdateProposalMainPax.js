import Relay from 'react-relay';

export default class UpdateProposalMainPaxMutation extends Relay.Mutation {
  getMutation() {
    return Relay.QL`mutation{updateProposalMainPax}`;
  }

  getVariables() {
    const { mainPaxKey, proposalKey } = this.props;
    const vars = {
      mainPaxKey,
      proposalKey
    };
    return vars;
  }

  getFatQuery() {
    return Relay.QL`
      fragment on UpdateProposalMainPaxPayload {
        mainPaxKey
      }
    `;
  }

  getConfigs() {
    return [{
      type: 'FIELDS_CHANGE',
      fieldIDs: {
        mainPaxKey: this.props.mainPaxKey
      }
    }];
  }
}
