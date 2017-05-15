import { GraphQLString, GraphQLID } from 'graphql';
import { mutationWithClientMutationId } from 'graphql-relay';
import * as tripCtrl from './../controllers/Trip';
import TripType from '../types/Trip';

export default mutationWithClientMutationId({
  name: 'UpdateStartDate',
  inputFields: {
    _key: { type: GraphQLID },
    startDate: { type: GraphQLString },
    endDate: { type: GraphQLString }
  },
  outputFields: {
    trip: {
      type: TripType,
      resolve: updatedTrip => updatedTrip
    }
  },
  mutateAndGetPayload: async input => await tripCtrl.updateTripStartDate(input)
});
