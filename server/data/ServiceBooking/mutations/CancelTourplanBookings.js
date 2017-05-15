import { GraphQLID, GraphQLList } from 'graphql';
import { mutationWithClientMutationId } from 'graphql-relay';
import * as servicebookingCtrl from './../controllers/ServiceBooking';
import ServiceBookingType from './../types/ServiceBooking';

const props = {
  serviceBookingKeys: { type: new GraphQLList(GraphQLID) }
};

export default mutationWithClientMutationId({
  name: 'CancelTourplanBookings',
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
    const saveDoc = await servicebookingCtrl.cancelTourplanBookings(inputFields);
    return saveDoc;
  }
});
