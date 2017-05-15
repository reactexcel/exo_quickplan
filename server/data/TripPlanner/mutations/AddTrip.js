import { GraphQLString, GraphQLInt } from 'graphql';
import { mutationWithClientMutationId } from 'graphql-relay';
import * as tripCtrl from './../controllers/Trip';
import { PassengerInputType, PassengerOutputType } from './../types/TripPassenger';

const props = {
  travelCompany: { type: GraphQLString },
  travelAgent: { type: GraphQLString },
  leadCustomer: { type: GraphQLString },
  startDate: { type: GraphQLString },
  tripDuration: { type: GraphQLInt },
  country: { type: GraphQLString },
  city: { type: GraphQLString }
};

export default mutationWithClientMutationId({
  name: 'AddTripTripPlanner',
  inputFields: {
    ...props,
    mainPAX: { type: PassengerInputType }
  },
  outputFields: {
    ...props,
    mainPAX: { type: PassengerOutputType }
  },
  mutateAndGetPayload: async (inputFields) => {
    const saveDoc = await tripCtrl.addTrip(inputFields);
    return tripCtrl.getTrip(saveDoc);
  }
});
