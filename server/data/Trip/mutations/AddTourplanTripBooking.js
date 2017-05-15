import { GraphQLString, GraphQLList } from 'graphql';
import { mutationWithClientMutationId } from 'graphql-relay';
import ServiceBookingType from '../../ServiceBooking/types/ServiceBooking';
import * as tripbookingCtrl from './../controllers/Trip';

const props = {
  tripBookingKey: { type: GraphQLString }
};

export default mutationWithClientMutationId({
  name: 'AddTourplanTripBooking',
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
    const saveDoc = await tripbookingCtrl.addTourplanTripBookings(inputFields);
    return saveDoc;
  }
});
