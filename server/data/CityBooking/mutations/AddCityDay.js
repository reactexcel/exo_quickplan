import { GraphQLString, GraphQLInt } from 'graphql';
import { mutationWithClientMutationId } from 'graphql-relay';
import * as citybookingCtrl from './../controllers/CityBooking';
import CityBookingType from './../types/CityBooking';

const props = {
  cityBookingKey: { type: GraphQLString },
  dayIndex: { type: GraphQLInt }
};

export default mutationWithClientMutationId({
  name: 'AddCityDay',
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
    const saveDoc = await citybookingCtrl.addCityDay(inputFields);
    return saveDoc;
  }
});
