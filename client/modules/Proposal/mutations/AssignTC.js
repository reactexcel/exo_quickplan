import Relay from 'react-relay';

export default class AssignTC extends Relay.Mutation {
  getMutation() {
    return Relay.QL`mutation {assignTC}`;
  }

  getVariables() {
    return this.props;
  }

  getFatQuery() {
    return Relay.QL`
      fragment on assignTCPayload {
        edgeId
      }
    `;
  }

  getConfigs() {
    return [];
  }
}
