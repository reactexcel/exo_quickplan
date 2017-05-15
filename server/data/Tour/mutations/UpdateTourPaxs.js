import { GraphQLString, GraphQLList, GraphQLNonNull } from 'graphql';
import { mutationWithClientMutationId } from 'graphql-relay';
import ServiceBookingType from '../../ServiceBooking/types/ServiceBooking';
import { updateTourPaxs } from '../controllers/Tours';
import { getServiceBooking } from '../../ServiceBooking/controllers/ServiceBooking';

export default mutationWithClientMutationId({
  name: 'UpdateTourPaxs',
  inputFields: {
    paxKeys: {
      type: new GraphQLList(GraphQLString)
    },
    serviceBookingKey: {
      type: new GraphQLNonNull(GraphQLString)
    }
  },
  outputFields: {
    serviceBooking: {
      type: ServiceBookingType,
      resolve: savedDoc => savedDoc
    }
  },
  mutateAndGetPayload: async ({ serviceBookingKey, paxKeys }) => {
    await updateTourPaxs({ serviceBookingKey, paxKeys });
    return await getServiceBooking({ serviceBookingKey });
  }
});
