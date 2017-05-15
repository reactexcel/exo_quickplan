import { GraphQLString } from 'graphql';
import { mutationWithClientMutationId } from 'graphql-relay';
import * as tripCtrl from '../controllers/Trip';

const props = {
  tripKey: { type: GraphQLString }
};

export default mutationWithClientMutationId({
  name: 'CloneTrip',
  inputFields: {
    ...props
  },
  outputFields: {
    tripKey: {
      type: GraphQLString,
      resolve: saveDoc => saveDoc._key
    }
  },
  mutateAndGetPayload: async (inputFields) => {
    const trip = await tripCtrl.cloneTrip(inputFields);
    return trip;
  }
});
