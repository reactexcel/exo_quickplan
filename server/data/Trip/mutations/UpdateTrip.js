import { GraphQLString, GraphQLID, GraphQLInt } from 'graphql';
import { mutationWithClientMutationId } from 'graphql-relay';
import * as tripCtrl from './../controllers/Trip';
import MutationTripType from '../types/MutationTrip';

export default mutationWithClientMutationId({
  name: 'UpdateTrip',
  description: 'Update the basic information of trip,',
  inputFields: {
    _key: { type: GraphQLID },
    name: { type: GraphQLString },
    status: { type: GraphQLString },
    startDate: { type: GraphQLString },
    endDate: { type: GraphQLString },
    duration: { type: GraphQLInt },
    notes: { type: GraphQLString }
  },
  outputFields: {
    trip: {
      type: MutationTripType,
      resolve: updatedTrip => updatedTrip
    }
  },
  mutateAndGetPayload: async inputFields => await tripCtrl.updateTrip(inputFields)

});
