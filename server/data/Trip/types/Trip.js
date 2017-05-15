import { GraphQLObjectType, GraphQLString, GraphQLInt, GraphQLList, GraphQLID, } from 'graphql';
import { toGlobalId } from 'graphql-relay';
import _ from 'lodash';
import CountryBooking from '../../CountryBooking/types/CountryBooking';
import ServiceBookingType from '../../ServiceBooking/types/ServiceBooking';
import TransferPlacementType from '../../TransferPlacement/types/TransferPlacement';
import { getTransferPlacement } from '../../TransferPlacement/controllers/TransferPlacement';
import {
  getCombinerCountryBooking,
  getPaxs,
  getLocations,
  getTripTravellerSummary,
  getItinerarySummary,
  getTripBudget
} from '../controllers/Trip';
import Pax from '../../Pax/types/Pax';
import Location from '../../Location/types/Location';


const TripTravellersSummary = new GraphQLObjectType({
  name: 'TripTravellersSummary',
  fields: () => ({
    adults: {
      type: GraphQLInt,
      resolve: ({ adults }) => adults || 0
    },
    children: {
      type: GraphQLInt,
      resolve: ({ children }) => children || 0
    },
    infants: {
      type: GraphQLInt,
      resolve: ({ infants }) => infants || 0
    }
  })
});


const ItinerarySummary = new GraphQLObjectType({
  name: 'TripItinerarySummary',
  fields: () => ({
    country: {
      type: GraphQLString
    },
    cities: {
      type: new GraphQLList(GraphQLString)
    }
  })
});


const TripBudgetUnit = new GraphQLObjectType({
  name: 'TripBudgetUnit',
  fields: () => ({
    planned: {
      type: GraphQLInt,
      resolve: ({ planned }) => planned || 0
    },
    actual: {
      type: GraphQLInt,
      resolve: ({ actual }) => actual || 0
    }
  })
});


const TripBudget = new GraphQLObjectType({
  name: 'TripBudget',
  fields: () => ({
    total: {
      type: TripBudgetUnit,
      resolve: ({ total }) => total || {}
    },
    hotels: {
      type: TripBudgetUnit,
      resolve: ({ hotels }) => hotels || {}
    },
    tours: {
      type: TripBudgetUnit,
      resolve: ({ tours }) => tours || {}
    },
    transfers: {
      type: TripBudgetUnit,
      resolve: ({ tours }) => tours || {}
    },
  })
});

const departureCityOrigin = new GraphQLObjectType({
  name: 'DepartureCityOrigin',
  fields: () => ({
    _key: {
      type: GraphQLString
    },
    _id: {
      type: GraphQLString
    },
    cityCode: {
      type: GraphQLString
    },
    startDate: {
      type: GraphQLString
    },
    durationNights: {
      type: GraphQLString
    },
    startDay: {
      type: GraphQLString
    },
    durationDays: {
      type: GraphQLString
    }
  })
});

const departureTransfer = new GraphQLObjectType({
  name: 'DepartureTransfer',
  fields: () => ({
    _key: {
      type: GraphQLString
    },
    _id: {
      type: GraphQLString
    },
    type: {
      type: GraphQLString
    }
  })
});

const departureTransferPlacement = new GraphQLObjectType({
  name: 'DepartureTransferPlacement',
  fields: () => ({
    _key: {
      type: GraphQLString
    },
    _id: {
      type: GraphQLString
    },
    type: {
      type: GraphQLString
    },
    departureTransfer: {
      type: new GraphQLList(departureTransfer)
    },
    departureCityOrigin: {
      type: departureCityOrigin
    },
    transferPlacement: {
      type: TransferPlacementType,
      resolve: async departureTransferPlacement => await getTransferPlacement(departureTransferPlacement._key)
    }
  })
});


export default new GraphQLObjectType({
  name: 'QueryTripType',
  fields: () => ({
    _key: {
      type: GraphQLString
    },
    name: {
      type: GraphQLString
    },
    status: {
      type: GraphQLString
    },
    startDate: {
      type: GraphQLString
    },
    endDate: {
      type: GraphQLString
    },
    durationDays: {
      type: GraphQLInt
    },
    lastBookedDay: {
      type: GraphQLInt
    },
    notes: {
      type: GraphQLString
    },
    countryOrder: {
      type: new GraphQLList(GraphQLID),
      resolve: (res) => {
        if (res.countryOrder) return res.countryOrder.map(countryId => toGlobalId('CountryBooking', countryId));
        return [];
      }
    },
    countryBookings: {
      type: new GraphQLList(CountryBooking),
      description: 'Countries in the trip'
    },
    combinerCountryBooking: {
      type: CountryBooking,
      resolve: async ({ _key }) => await getCombinerCountryBooking(_key) || {}
    },
    paxs: {
      type: new GraphQLList(Pax),
      resolve: async ({ _key }) => await getPaxs(_key) || []
    },
    combinerLocation: {
      type: Location,
      resolve: async ({ _key }) => {
        const locations = await getLocations(_key) || [];
        const location = locations.find(l => _.get(l, '[0].combiner'));
        if (!location || !location.length) {
          return {};
        }

        const combinedLocation = location[0];
        combinedLocation.name = location.map(l => l.name).join(', ');
        return combinedLocation;
      }
    },
    budget: {
      type: TripBudget,
      resolve: async ({ _key }) => await getTripBudget(_key) || {}
    },
    traveller: {
      type: TripTravellersSummary,
      resolve: async ({ _key }) => await getTripTravellerSummary(_key) || {}
    },
    itinerary: {
      type: new GraphQLList(ItinerarySummary),
      resolve: async trip => await getItinerarySummary(trip) || []
    },
    departureTransferPlacement: {
      type: departureTransferPlacement,
      description: 'Trip Departure'
    }
  })
});
