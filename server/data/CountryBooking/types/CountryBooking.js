import { globalIdField } from 'graphql-relay';
import { GraphQLObjectType, GraphQLString, GraphQLInt, GraphQLList } from 'graphql';
import { nodeInterface } from '../../interface';
import CityBookingType from '../../CityBooking/types/CityBooking';
import LocationType from '../../Location/types/Location';
import TransferPlacementType from '../../TransferPlacement/types/TransferPlacement';
import { getTransferPlacementByCountryBookingKey } from '../../TransferPlacement/controllers/TransferPlacement';
import { getCountryLocation } from '../controllers/CountryBooking';


export default new GraphQLObjectType({
  name: 'CountryBooking',
  description: 'The country booking object in Quickplan',
  fields: () => ({
    id: globalIdField('CountryBooking', country => country._key),
    _key: {
      type: GraphQLString,
      description: 'Unique country booking ID.'
    },
    countryCode: {
      type: GraphQLString
    },
    qpBookingId: {
      type: GraphQLInt
    },
    tpBookingId: {
      type: GraphQLInt
    },
    tpBookingRef: {
      type: GraphQLString,
      resolve: ({ tpBookingRef }) => tpBookingRef || ''
    },
    cities: {
      type: new GraphQLList(GraphQLInt)
    },
    createdBy: {
      type: GraphQLString
    },
    createdOn: {
      type: GraphQLString
    },
    dateFrom: {
      type: GraphQLString
    },
    totalPrice: {
      type: GraphQLInt
    },
    currency: {
      type: GraphQLString
    },
    notes: {
      type: GraphQLString
    },
    startDate: {
      type: GraphQLString
    },
    durationDays: {
      type: GraphQLString
    },
    durationNights: {
      type: GraphQLString
    },
    cityBookings: {
      type: new GraphQLList(CityBookingType)
    },
    transferPlacements: {
      type: TransferPlacementType,
      resolve: async countryBooking => await getTransferPlacementByCountryBookingKey({ countryBookingKey: countryBooking._key })
    },
    location: {
      type: LocationType,
      resolve: async countryBooking => await getCountryLocation(countryBooking._key)
    },
  }),
  interfaces: [nodeInterface]
});
