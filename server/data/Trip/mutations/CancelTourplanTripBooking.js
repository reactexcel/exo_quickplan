import { GraphQLString, GraphQLList } from 'graphql';
import { mutationWithClientMutationId } from 'graphql-relay';
import * as tripbookingCtrl from './../controllers/Trip';
import ServiceBookingType from '../../ServiceBooking/types/ServiceBooking';

const props = {
  tripBookingKey: { type: GraphQLString }
};

export default mutationWithClientMutationId({
  name: 'CancelTourplanTripBooking',
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
    const saveDoc = await tripbookingCtrl.removeTourplanTripBookings(inputFields);
    return saveDoc;
  }
});
