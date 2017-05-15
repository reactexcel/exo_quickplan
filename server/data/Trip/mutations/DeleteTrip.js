import { GraphQLString } from 'graphql';
import { mutationWithClientMutationId } from 'graphql-relay';
import * as tripCtrl from '../controllers/Trip';

const props = {
  tripKey: { type: GraphQLString }
};

export default mutationWithClientMutationId({
  name: 'DeleteTrip',
  inputFields: {
    ...props
  },
  outputFields: {
    tripKey: {
      type: GraphQLString
    }
  },
  mutateAndGetPayload: async (inputFields) => {
    const tripKey = await tripCtrl.deleteTrip(inputFields);
    return tripKey;
  }
});
