import { GraphQLString, GraphQLID, GraphQLList } from 'graphql';
import { mutationWithClientMutationId } from 'graphql-relay';
import * as tripCtrl from './../controllers/Trip';
import PaxType from '../../Pax/types/Pax';

export default mutationWithClientMutationId({
  name: 'UpdateTripPaxEdges',
  inputFields: {
    tripKey: { type: GraphQLID },
    tripPaxKeys: {
      type: new GraphQLList(GraphQLString)
    }
  },
  outputFields: {
    tripPaxs: {
      type: new GraphQLList(PaxType),
      resolve: tripPaxs => tripPaxs
    }
  },
  mutateAndGetPayload: async input => await tripCtrl.updateTripPaxEdges(input)
});
