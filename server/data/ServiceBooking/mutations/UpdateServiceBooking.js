import { GraphQLID } from 'graphql';
import { mutationWithClientMutationId } from 'graphql-relay';
import * as servicebookingCtrl from './../controllers/ServiceBooking';
import ServiceBookingInputType from './../types/ServiceBookingInput';
import ServiceBookingType from './../types/ServiceBooking';

const props = {
  serviceBookingKey: { type: GraphQLID },
  patchData: { type: ServiceBookingInputType }
};

export default mutationWithClientMutationId({
  name: 'UpdateServiceBooking',
  inputFields: {
    ...props
  },
  outputFields: {
    servicebooking: {
      type: ServiceBookingType,
      resolve: saveDoc => saveDoc
    }
  },
  mutateAndGetPayload: async (inputFields) => {
    const saveDoc = await servicebookingCtrl.updateServiceBooking(inputFields);
    return saveDoc;
  }
});
