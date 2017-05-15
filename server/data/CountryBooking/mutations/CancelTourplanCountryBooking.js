import { GraphQLString, GraphQLList } from 'graphql';
import { mutationWithClientMutationId } from 'graphql-relay';
import * as countrybookingCtrl from './../controllers/CountryBooking';
import ServiceBookingType from '../../ServiceBooking/types/ServiceBooking';

const props = {
  countryBookingKey: { type: GraphQLString }
};

export default mutationWithClientMutationId({
  name: 'CancelTourplanCountryBooking',
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
    const saveDoc = await countrybookingCtrl.removeTourplanCountryBookings(inputFields);
    return saveDoc;
  }
});
