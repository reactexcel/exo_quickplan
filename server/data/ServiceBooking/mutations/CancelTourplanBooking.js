import { GraphQLID } from 'graphql';
import { mutationWithClientMutationId } from 'graphql-relay';
import * as servicebookingCtrl from './../controllers/ServiceBooking';
import ServiceBookingType from './../types/ServiceBooking';

const props = {
  serviceBookingKey: { type: GraphQLID }
};

export default mutationWithClientMutationId({
  name: 'CancelTourplanBooking',
  inputFields: {
    ...props
  },
  outputFields: {
    serviceBookings: {
      type: ServiceBookingType,
      resolve: saveDoc => saveDoc
    }
  },
  mutateAndGetPayload: async (inputFields) => {
    const saveDoc = await servicebookingCtrl.cancelTourplanBooking(inputFields);
    return saveDoc;
  }
});
