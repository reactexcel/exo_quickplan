import { GraphQLID } from 'graphql';
import { mutationWithClientMutationId } from 'graphql-relay';
import * as citybookingCtrl from './../controllers/CityBooking';
import CityBookingType from './../types/CityBooking';

const props = {
  id: { type: GraphQLID }
};

export default mutationWithClientMutationId({
  name: 'UpdateCityServicesAvailability',
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
    const saveDoc = await citybookingCtrl.updateServicesAvailability({
      ...inputFields
    });
    console.log('saveDoc', JSON.stringify(saveDoc));
    return saveDoc;
  }
});
