import { GraphQLString, GraphQLID, GraphQLList } from 'graphql';
import { mutationWithClientMutationId } from 'graphql-relay';
import * as citybookingCtrl from './../controllers/CityBooking';
import CityBookingType from './../types/CityBooking';

const props = {
  cityBookingKey: { type: GraphQLID },
  tourKeys: { type: new GraphQLList(GraphQLString) }
};

export default mutationWithClientMutationId({
  name: 'UpdateServicesBooking',
  inputFields: {
    ...props
  },
  outputFields: {
    serviceBookings: {
      type: CityBookingType,
      resolve: saveDoc => saveDoc
    }
  },
  mutateAndGetPayload: async (inputFields) => {
    const saveDoc = await citybookingCtrl.updateServicesByCityKey(inputFields);
    return saveDoc;
  }
});
