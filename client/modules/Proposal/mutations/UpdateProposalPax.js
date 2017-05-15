import Relay from 'react-relay';

export default class UpdateProposalPaxMutation extends Relay.Mutation {
  getMutation() {
    return Relay.QL`
      mutation { updatePax }
    `;
  }

  getVariables() {
    const vars = {
      paxKey: this.props._key,
      isMainPax: this.props.isMainPax,
      firstName: this.props.firstName,
      lastName: this.props.lastName,
      gender: this.props.gender,
      dateOfBirth: this.props.dateOfBirth,
      ageOnArrival: this.props.ageOnArrival,
      ageGroup: this.props.ageGroup,
      language: this.props.language,
      passportNr: this.props.passportNr,
      // passportImage: { type: GraphQLString },
      nationality: this.props.nationality,
      passportExpiresOn: this.props.passportExpiresOn,
      diet: this.props.diet,
      allergies: this.props.allergies
    };
    return vars;
  }

  getFatQuery() {
    return Relay.QL`
      fragment on UpdatePaxPayload {
        pax
    }`;
  }

  getConfigs() {
    return [{
      type: 'FIELDS_CHANGE',
      fieldIDs: {
        pax: this.props.paxKey
      }
    }];
  }
}
