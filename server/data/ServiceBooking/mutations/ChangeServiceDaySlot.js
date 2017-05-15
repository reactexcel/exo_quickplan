import { GraphQLString, GraphQLInt } from 'graphql';
import { mutationWithClientMutationId } from 'graphql-relay';
import * as servicebookingCtrl from './../controllers/ServiceBooking';
import ServiceBookingType from './../types/ServiceBooking';

const props = {
  serviceBookingKey: { type: GraphQLString },
  cityDayKey: { type: GraphQLString },
  startSlot: { type: GraphQLInt },
};

export default mutationWithClientMutationId({
  name: 'ChangeServiceDaySlot',
  inputFields: {
    ...props
  },
  outputFields: {
    serviceBooking: {
      type: ServiceBookingType,
      resolve: saveDoc => saveDoc
    }
  },
  mutateAndGetPayload: async (inputFields) => {
    const saveDoc = await servicebookingCtrl.changeServiceDaySlot(inputFields);
    return saveDoc;
  }
});
