import { GraphQLString, GraphQLID } from 'graphql';
import { mutationWithClientMutationId } from 'graphql-relay';
import * as countrybookingCtrl from './../controllers/CountryBooking';
import CountryBookingType from './../types/CountryBooking';

const props = {
  tripKey: { type: GraphQLID },
  _key: { type: GraphQLString },
  countryCode: { type: GraphQLString },
  createdBy: { type: GraphQLString },
  order: { type: GraphQLString },
  addedIndex: { type: GraphQLString },
};

export default mutationWithClientMutationId({
  name: 'AddCountryBooking',
  inputFields: {
    ...props
  },
  outputFields: {
    countryBooking: {
      type: CountryBookingType,
      resolve: saveDoc => saveDoc
    }
  },
  mutateAndGetPayload: async (inputFields) => {
    const saveDoc = await countrybookingCtrl.addCountryBooking(inputFields);
    return saveDoc;
  }
});
