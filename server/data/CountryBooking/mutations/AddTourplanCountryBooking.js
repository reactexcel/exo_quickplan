import { GraphQLString, GraphQLList } from 'graphql';
import { mutationWithClientMutationId } from 'graphql-relay';
import ServiceBookingType from '../../ServiceBooking/types/ServiceBooking';
import * as countrybookingCtrl from './../controllers/CountryBooking';

const props = {
  countryBookingKey: { type: GraphQLString }
};

export default mutationWithClientMutationId({
  name: 'AddTourplanCountryBooking',
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
    const saveDoc = await countrybookingCtrl.addTourplanCountryBookings(inputFields);
    return saveDoc;
  }
});
