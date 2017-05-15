import Relay from 'react-relay';

export default class AddMealMutation extends Relay.Mutation {
  getMutation() {
    return Relay.QL`
      mutation { addMeal }
    `;
  }

  getVariables() {
    const { cityDayKey, mealOrder, mealType, mealNote } = this.props;
    return { cityDayKey, mealOrder, mealType, mealNote };
  }

  getFatQuery() {
    return Relay.QL`
      fragment on AddMealPayload {
        cityDay
    }`;
  }

  getConfigs() {
    return [{
      type: 'FIELDS_CHANGE',
      fieldIDs: {
        cityDay: this.props.cityDayKey
      }
    }];
  }
}
