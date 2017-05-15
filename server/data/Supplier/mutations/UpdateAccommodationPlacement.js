import { GraphQLString, GraphQLList, GraphQLInt } from 'graphql';
import { mutationWithClientMutationId } from 'graphql-relay';
import CityBookingType from '../../CityBooking/types/CityBooking';
import { updateAccommodationPlacement } from '../controllers/Supplier';
import Placeholder from '../../CityDay/types/PlaceholderInput';

export default mutationWithClientMutationId({
  name: 'UpdateAccommodationPlacement',
  description: 'Add, update, delete the given AccommodationPlacement when clicking save on the hotel picker',
  inputFields: {
    cityBookingKey: {
      type: GraphQLString
    },
    accommodationPlacementKey: {
      type: GraphQLString
    },
    selectedAccommodationKeys: {
      type: new GraphQLList(GraphQLString)
    },
    preselectedAccommodationKeys: {
      type: new GraphQLList(GraphQLString)
    },
    durationNights: {
      type: GraphQLInt
    },
    startDay: {
      type: GraphQLInt
    },
    action: {
      type: GraphQLString
    },
    placeholders: {
      type: new GraphQLList(Placeholder)
    },
    startDate: {
      type: GraphQLString
    }
  },
  outputFields: {
    cityBooking: {
      type: CityBookingType,
      resolve: savedDoc => savedDoc
    }
  },
  mutateAndGetPayload: async inputFields => await updateAccommodationPlacement(inputFields)
});
