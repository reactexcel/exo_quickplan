import { GraphQLString } from 'graphql';
import { mutationWithClientMutationId } from 'graphql-relay';
import * as citybookingCtrl from './../controllers/CityBooking';
import CityBookingType from './../types/CityBooking';

const props = {
  cityDayKey: { type: GraphQLString }
};

export default mutationWithClientMutationId({
  name: 'RemoveCityDay',
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
    const saveDoc = await citybookingCtrl.removeCityDay(inputFields);
    return saveDoc;
  }
});
