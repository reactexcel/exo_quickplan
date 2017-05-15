import Relay from 'react-relay';

export default class UpdateStartDate extends Relay.Mutation {
  getMutation() {
    return Relay.QL`mutation {ChangeNote}`;
  }

  getVariables() {
    const {
      note,
      cityDayKey
    } = this.props;
    return { note, cityDayKey };
  }

  getFatQuery() {
    return Relay.QL`
      fragment on ChangeNotePayload {
        cityDay {
          note
        }
      }
    `;
  }

  getConfigs() {
    const { cityDayId } = this.props;
    console.log(cityDayId);

    return [{
      type: 'FIELDS_CHANGE',
      fieldIDs: {
        cityDay: cityDayId
      }
    }];
  }
}
