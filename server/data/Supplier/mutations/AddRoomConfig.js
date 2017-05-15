import { GraphQLString, GraphQLList } from 'graphql';
import { mutationWithClientMutationId } from 'graphql-relay';
import ServiceBookingType from '../../ServiceBooking/types/ServiceBooking';
import { addRoomConfig, updateRoomConfig } from '../controllers/Supplier';
import { getServiceBooking } from '../../ServiceBooking/controllers/ServiceBooking';

export default mutationWithClientMutationId({
  name: 'AddRoomConfig',
  inputFields: {
    serviceBookingKey: {
      type: GraphQLString
    },
    roomType: {
      type: GraphQLString
    },
    paxKeys: {
      type: new GraphQLList(GraphQLString)
    }
  },
  outputFields: {
    serviceBooking: {
      type: ServiceBookingType,
      resolve: savedDoc => savedDoc
    }
  },
  mutateAndGetPayload: async (inputFields) => {
    const aa = await addRoomConfig(inputFields);
    // start add pax if exists
    if (inputFields.paxKeys.length > 0) {
      await updateRoomConfig({
        roomConfigKey: aa._key,
        roomType: inputFields.roomType,
        paxKeys: inputFields.paxKeys
      });
    }
    // end add pax if exists
    return await getServiceBooking({ serviceBookingKey: inputFields.serviceBookingKey });
  }
});
