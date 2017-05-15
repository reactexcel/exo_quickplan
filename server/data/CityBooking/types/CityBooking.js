import { GraphQLObjectType, GraphQLString, GraphQLInt, GraphQLList } from 'graphql';
import { globalIdField } from 'graphql-relay';
import { nodeInterface } from '../../interface';
import CityDayType from '../../CityDay/types/CityDay';
import AccommodationPlacementType from '../../Supplier/types/AccommodationPlacement';
import TransferPlacementType from '../../TransferPlacement/types/TransferPlacement';
import { getTransferPlacementByCityBookingKey } from '../../TransferPlacement/controllers/TransferPlacement';
import LocationType from '../../Location/types/Location';
import { getCityLocation, getDefaultToursForCity } from '../controllers/CityBooking';

export default new GraphQLObjectType({
  name: 'CityBooking',
  description: 'The city booking object in Quickplan',
  fields: () => ({
    id: globalIdField('CityBooking', city => city._key),
    _key: {
      type: GraphQLString,
      description: 'Unique city booking ID.'
    },
    cityCode: {
      type: GraphQLString
    },
    startDay: {
      type: GraphQLInt
    },
    startDate: {
      type: GraphQLString
    },
    durationDays: {
      type: GraphQLInt
    },
    durationNights: {
      type: GraphQLInt
    },
    cityOrder: {
      type: GraphQLInt
    },
    cityDays: {
      type: new GraphQLList(CityDayType)
    },
    accommodationPlacements: {
      type: new GraphQLList(AccommodationPlacementType)

    },
    transferPlacements: {
      type: TransferPlacementType,
      resolve: async cityBooking => await getTransferPlacementByCityBookingKey({ cityBookingKey: cityBooking._key })
    },
    location: {
      type: LocationType,
      resolve: async cityBooking => await getCityLocation(cityBooking._key)
    },
    defaultTours: {
      type: new GraphQLList(GraphQLString),
      resolve: async cityBooking => await getDefaultToursForCity(cityBooking._key)
    }
  }),
  interfaces: [nodeInterface]
});
