import { GraphQLString, GraphQLList } from 'graphql';
import { mutationWithClientMutationId } from 'graphql-relay';
import * as citybookingCtrl from './../controllers/CityBooking';
import ServiceBookingType from '../../ServiceBooking/types/ServiceBooking';

const props = {
  cityBookingKey: { type: GraphQLString }
};

export default mutationWithClientMutationId({
  name: 'CancelTourplanCityBooking',
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
    const saveDoc = await citybookingCtrl.removeTourplanCityBookings(inputFields);
    return saveDoc;
  }
});
