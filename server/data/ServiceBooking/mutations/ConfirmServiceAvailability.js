import { GraphQLID } from 'graphql';
import { mutationWithClientMutationId } from 'graphql-relay';
import * as servicebookingCtrl from './../controllers/ServiceBooking';
import ServiceBookingType from './../types/ServiceBooking';

export default mutationWithClientMutationId({
  name: 'ConfirmServiceAvailability',
  inputFields: {
    serviceBookingKey: { type: GraphQLID }
  },
  outputFields: {
    serviceBooking: {
      type: ServiceBookingType,
      resolve: saveDoc => saveDoc
    }
  },
  mutateAndGetPayload: async (inputFields) => {
    const saveDoc = await servicebookingCtrl.confirmServiceAvailability(inputFields);
    return saveDoc;
  }
});
