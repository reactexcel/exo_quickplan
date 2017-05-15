import { GraphQLString, GraphQLID, GraphQLInt } from 'graphql';
import { mutationWithClientMutationId } from 'graphql-relay';
import * as citybookingCtrl from './../controllers/CityBooking';
import CityBookingType from './../types/CityBooking';

const props = {
  cityCode: { type: GraphQLString },
  countryBookingKey: { type: GraphQLID },
  tourKey: { type: GraphQLID },
  _key: { type: GraphQLString },
  startDay: { type: GraphQLInt },
  durationNights: { type: GraphQLInt },
  cityOrder: { type: GraphQLInt },
  cityIndex: { type: GraphQLInt }
};

export default mutationWithClientMutationId({
  name: 'AddCityBooking',
  inputFields: {
    ...props
  },
  outputFields: {
    cityBooking: {
      type: CityBookingType,
      resolve: saveDoc => saveDoc
    }
  },
  mutateAndGetPayload: async (inputFields) => {
    const saveDoc = await citybookingCtrl.addCityBooking(inputFields);
    return saveDoc;
  }
});

