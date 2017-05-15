import { GraphQLID, GraphQLList } from 'graphql';
import { mutationWithClientMutationId } from 'graphql-relay';
import * as servicebookingCtrl from './../controllers/ServiceBooking';
import ServiceBookingType from './../types/ServiceBooking';

const props = {
  id: { type: GraphQLID }
};

export default mutationWithClientMutationId({
  name: 'UpdateServicesAvailability',
  inputFields: {
    ...props
  },
  outputFields: {
    serviceBookings: {
      type: new GraphQLList(ServiceBookingType),
      resolve: saveDoc => saveDoc
    }
  },
  mutateAndGetPayload: async (inputFields) => {
    const saveDoc = await servicebookingCtrl.updateServicesAvailability({
      ...inputFields
    });
    console.log('saveDoc', saveDoc);
    return saveDoc;
  }
});
