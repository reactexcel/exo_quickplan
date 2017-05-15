import { GraphQLID, GraphQLString, GraphQLList, GraphQLInputObjectType, GraphQLInt } from 'graphql';
import { mutationWithClientMutationId } from 'graphql-relay';
import * as citydayCtrl from './../controllers/CityDay';

const SelectTourObject = new GraphQLInputObjectType({
  name: 'SelectTourObject',
  description: 'The tours objects to select ',
  fields: () => ({
    tourKey: {
      type: GraphQLString
    },
    startSlot: {
      type: GraphQLInt
    },
    durationSlots: {
      type: GraphQLInt
    }
  })
});

const props = {
  cityDayKey: {
    type: GraphQLID,
    description: 'The id of the cityday/accommodation placement to preselect.'
  },
  selectedServiceBookingKeys: {
    type: new GraphQLList(GraphQLString),
    description: 'An array of the serviceBookings which TC create and TA want to select/follow'
  },
  tourKeys: {
    type: new GraphQLList(SelectTourObject),
    description: 'An array of tour preselection objects {tourKey: tourKey(string), startSlot: startSlot(integer)}, will new booking service and followed.'
  },
};

export default mutationWithClientMutationId({
  name: 'SelectServiceBookings',
  description: 'TA select/follow tour/accommodation service bookings, ',
  inputFields: {
    ...props
  },
  outputFields: {
    cityDayKey: {
      type: GraphQLString,
      resolve: saveDoc => saveDoc
    }
  },
  mutateAndGetPayload: async (inputFields) => {
    const cityDayKey = await citydayCtrl.selectServiceBookings(inputFields);
    return cityDayKey;
  }
});
