import Relay from 'react-relay';

export default class ProposalAddBlankTripMutation extends Relay.Mutation {
  getMutation() {
    return Relay.QL`
        mutation { addBlankTripProposal }
    `;
  }

  getVariables() {
    return {
      id: this.props.id
    };
  }

  getFatQuery() {
    return Relay.QL`
      fragment on AddBlankTripProposalPayload {
        proposal
      }`;
  }

  getConfigs() {
    return [{
      type: 'FIELDS_CHANGE',
      fieldIDs: {
        proposal: this.props.id
      }
    }];
  }
}

