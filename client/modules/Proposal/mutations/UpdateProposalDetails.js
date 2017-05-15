import Relay from 'react-relay';

export default class ProposalUpdateComponentMutation extends Relay.Mutation {
  getMutation() {
    return Relay.QL`
        mutation { updateProposalDetails }
    `;
  }

  getVariables() {
    const {
      proposal: {
        _key, name, travelCompany, travelAgent, exoCompany,
        exoConsultant, startTravelInCity, startTravelOnDate,
        travelDuration, style, notes, status
      },
      selectedTC,
      selectedLocation,
      selectedOffice,
      selectedTAOffice,
      selectedTA
    } = this.props;
    const proposal = {
      class: this.props.proposal.class,
      proposalKey: _key,
      name,
      private: this.props.proposal.private,
      startTravelInCity,
      startTravelOnDate,
      travelDuration,
      style,
      notes,
      status
    };
    return {
      proposal,
      selectedTC,
      selectedLocation,
      selectedOffice,
      selectedTAOffice,
      selectedTA
    };
  }

  getFatQuery() {
    return Relay.QL`
      fragment on UpdateProposalDetailsPayload {
        proposal
      }`;
  }

  getConfigs() {
    return [{
      type: 'FIELDS_CHANGE',
      fieldIDs: {
        proposal: this.props.id // `proposals/${this.props._key}`
      }
    }];
  }
}
