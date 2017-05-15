import { GraphQLID } from 'graphql';
import { mutationWithClientMutationId } from 'graphql-relay';
import * as countrybookingCtrl from './../controllers/CountryBooking';
import CountryBookingType from './../types/CountryBooking';

const props = {
  id: { type: GraphQLID }
};

export default mutationWithClientMutationId({
  name: 'UpdateCountryServicesAvailability',
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
    const saveDoc = await countrybookingCtrl.updateServicesAvailability({
      ...inputFields
    });
    console.log('saveDoc', JSON.stringify(saveDoc));
    return saveDoc;
  }
});
