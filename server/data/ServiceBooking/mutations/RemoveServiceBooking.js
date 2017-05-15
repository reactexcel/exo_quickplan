import { GraphQLID } from 'graphql';
import { mutationWithClientMutationId } from 'graphql-relay';
import * as servicebookingCtrl from './../controllers/ServiceBooking';
import ServiceBookingStatusType from '../types/ServiceBookingStatus';

const props = {
  serviceBookingKey: { type: GraphQLID }
};

export default mutationWithClientMutationId({
  name: 'RemoveServiceBooking',
  inputFields: {
    ...props
  },
  outputFields: {
    result: {
      type: ServiceBookingStatusType,
      resolve: saveDoc => saveDoc
    }
  },
  mutateAndGetPayload: async (inputFields) => {
    const saveDoc = await servicebookingCtrl.removeServiceBooking(inputFields);
    return saveDoc;
  }
});
