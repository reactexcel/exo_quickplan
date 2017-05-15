import { GraphQLID } from 'graphql';
import { mutationWithClientMutationId } from 'graphql-relay';
import * as servicebookingCtrl from './../controllers/ServiceBooking';
import ServiceBookingType from './../types/ServiceBooking';

const props = {
  serviceBookingKey: { type: GraphQLID }
};

export default mutationWithClientMutationId({
  name: 'UpdateServiceAvailability',
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
    const saveDoc = await servicebookingCtrl.updateServiceAvailability({
      ...inputFields
    });
    return saveDoc;
  }
});
