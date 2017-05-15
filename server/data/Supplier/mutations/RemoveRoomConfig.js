import { GraphQLString } from 'graphql';
import { mutationWithClientMutationId, fromGlobalId } from 'graphql-relay';
import ServiceBookingType from '../../ServiceBooking/types/ServiceBooking';
import { removeRoomConfig } from '../controllers/Supplier';
import { getServiceBooking } from '../../ServiceBooking/controllers/ServiceBooking';

export default mutationWithClientMutationId({
  name: 'RemoveRoomConfig',
  inputFields: {
    serviceBookingKey: {
      type: GraphQLString
    },
    roomConfigId: {
      type: GraphQLString
    }
  },
  outputFields: {
    serviceBooking: {
      type: ServiceBookingType,
      resolve: savedDoc => savedDoc
    }
  },
  mutateAndGetPayload: async (inputFields) => {
    const roomConfigKey = fromGlobalId(inputFields.roomConfigId).id;
    removeRoomConfig(roomConfigKey);
    const aa = await getServiceBooking({ serviceBookingKey: inputFields.serviceBookingKey });
    return aa;
  }
});
