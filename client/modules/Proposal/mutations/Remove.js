import Relay from 'react-relay';

export default class RemoveProposal extends Relay.Mutation {
  getMutation() {
    return Relay.QL`mutation{RemoveProposal}`;
  }

  getVariables() {
    const { proposalKey } = this.props;
    return { proposalKey };
  }

  getFatQuery() {
    return Relay.QL`
      fragment on RemoveProposalPayload {
        clientMutationId
      }
    `;
  }

  getConfigs() {
    return [];
  }
}
