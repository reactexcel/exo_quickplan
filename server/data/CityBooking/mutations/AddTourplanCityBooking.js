import { GraphQLString, GraphQLList } from 'graphql';
import { mutationWithClientMutationId } from 'graphql-relay';
import ServiceBookingType from '../../ServiceBooking/types/ServiceBooking';
import * as citybookingCtrl from './../controllers/CityBooking';

const props = {
  cityBookingKey: { type: GraphQLString }
};

export default mutationWithClientMutationId({
  name: 'AddTourplanCityBooking',
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
    const saveDoc = await citybookingCtrl.addTourplanCityBookings(inputFields);
    return saveDoc;
  }
});
