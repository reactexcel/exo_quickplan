import Relay from 'react-relay';

export default class ProposalComponentMutation extends Relay.Mutation {
  getMutation() {
    return Relay.QL`
        mutation { addProposal }
    `;
  }

  getVariables() {
    const {
      selectedTC,
      selectedLocation,
      selectedOffice,
      selectedTAOffice,
      selectedTA,
      userToken,
    } = this.props;
    const proposal = {
      startTravelInCity: this.props.proposal.startTravelInCity,
      startTravelOnDate: this.props.proposal.startTravelOnDate,
      travelDuration: this.props.proposal.travelDuration,
      notes: this.props.proposal.notes,
      class: this.props.proposal.class,
      style: this.props.proposal.style,
      status: this.props.proposal.status,
      createOnDate: this.props.proposal.createOnDate,
      name: this.props.proposal.name,
      private: this.props.proposal.name
    };
    const pax = this.props.pax;
    return {
      proposal,
      pax,
      selectedTC,
      selectedLocation,
      selectedOffice,
      selectedTAOffice,
      selectedTA,
      userToken
    };
  }

  getFatQuery() {
    return Relay.QL`
      fragment on AddProposalPayload {
        proposal
      }`;
  }

  getConfigs() {
    return [{
      type: 'REQUIRED_CHILDREN',
      children: [
        Relay.QL`
          fragment on AddProposalPayload {
            proposal {
              _key
            }
          }
        `
      ]
    }];
  }
}
