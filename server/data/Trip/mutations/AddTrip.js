import { GraphQLString, GraphQLID, GraphQLInt } from 'graphql';
import { mutationWithClientMutationId } from 'graphql-relay';
import * as tripCtrl from './../controllers/Trip';
import MutationTripType from '../types/MutationTrip';

const props = {
  proposalKey: { type: GraphQLID },
  name: { type: GraphQLString },
  startDate: { type: GraphQLString },
  endDate: { type: GraphQLString },
  duration: { type: GraphQLInt },
  notes: { type: GraphQLString },
  status: { type: GraphQLString }
};

function add30DaysToTrip() {
  const todayAdd30 = new Date();
  todayAdd30.setDate(todayAdd30.getDate() + 30);
  const year = todayAdd30.getFullYear();
  const month = (todayAdd30.getMonth() + 1) < 10 ? `0${todayAdd30.getMonth() + 1}` : (todayAdd30.getMonth() + 1);
  const day = todayAdd30.getDate() < 10 ? `0${todayAdd30.getDate()}` : todayAdd30.getDate();
  return `${year}-${month}-${day}`;
}

export default mutationWithClientMutationId({
  name: 'AddTrip',
  inputFields: {
    ...props
  },
  outputFields: {
    trip: {
      type: MutationTripType,
      resolve: saveDoc => saveDoc
    }
  },
  mutateAndGetPayload: async (inputFields) => {
    if (!inputFields.startDate) {
      // Add start date 30 days from today to new trip.
      // TODO: Implement correct start date for trips.
      inputFields.startDate = add30DaysToTrip(); // eslint-disable-line no-param-reassign
    }
    // console.log(inputFields);
    const saveDoc = await tripCtrl.addTrip(inputFields);
    return saveDoc;
  }
});
