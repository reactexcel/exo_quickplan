import Relay from 'react-relay';

export default class UpdateStartDate extends Relay.Mutation {
  getMutation() {
    return Relay.QL`mutation {UpdateStartDate}`;
  }

  getVariables() {
    return this.props;
  }

  getFatQuery() {
    return Relay.QL`
      fragment on UpdateStartDatePayload {
        trip {
          startDate,
          endDate
        }
      }
    `;
  }

  getConfigs() {
    return [{
      type: 'FIELDS_CHANGE',
      fieldIDs: {
        trip: {
          startDate: this.props.startDate
        }
      }
    }];
  }
}
