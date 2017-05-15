/* eslint-disable no-unused-vars */
import { GraphQLObjectType, GraphQLSchema } from 'graphql';
import { nodeField } from './interface';

import {
  ProposalMutation
} from './Proposal';
import { AccessibleTourQuery, TourMutation } from './Tour';
import { TripPlannerQuery, TripPlannerMutation } from './TripPlanner';
import { CountryBookingMutation, GetServicesByCountryBookingKeyQuery } from './CountryBooking';
import { CityBookingMutation, CityBookingQuery } from './CityBooking';
import { ServiceBookingMutation, ServiceBookingControllerQuery, ServiceBooking, CheckServicesAvailabilityQuery } from './ServiceBooking';
import { TripMutation, GetTripQuery } from './Trip';
import { CityDayMutation, CityDayQuery } from './CityDay';
import { CountryCityTreeMutation, CountryCityTreeQuery } from './CountryCityTree';
import { TripToWordMutation } from './Word';
import {
  AccessibleSupplierQuery,
  CheckSupplierPaxStatusQuery,
  SupplierMutation,
  AccommodationPlacementQuery
} from './Supplier';
import { PaxsQuery, PaxMutation } from './Pax';
import {
  TransferPlacementQuery,
  TransferPlacementMutation,
  GetAccessibleTransfersQuery
} from './TransferPlacement';
import {
  TourAvailabilityQuery,
  TransferAvailabilityQuery
} from './Availability';
import {
  LocationQuery
} from './Location';

import user from './User/UserField';
import office from './Office/OfficeField';
import offices from './Office/OfficesField';
import locations from './Location/queries/Locations';
import proposal from './Proposal/fields/Proposal';
import trip from './Trip/fields/Trip';

/**
 * Viewer type is the starting node that will be used to traverse a graph,
 * we need a viewer type because the root type in Relay currently can't return an array.
 * Moreover, it allows us to write just one "viewerQuery" in the front-end side.
 * @see https://github.com/facebook/relay/issues/112
 *
 */
const viewerType = new GraphQLObjectType({
  name: 'Viewer',
  fields: () => ({
    ...TripPlannerQuery,
    ...AccessibleTourQuery,
    ...TourAvailabilityQuery,
    ...TransferAvailabilityQuery,
    ...GetTripQuery,
    ...GetServicesByCountryBookingKeyQuery,
    ...AccessibleSupplierQuery,
    ...CheckSupplierPaxStatusQuery,
    ...ServiceBookingControllerQuery,
    ...ServiceBooking,
    ...PaxsQuery,
    ...CityDayQuery,
    ...CityBookingQuery,
    ...AccommodationPlacementQuery,
    ...TransferPlacementQuery,
    ...GetAccessibleTransfersQuery,
    ...LocationQuery,
    ...CheckServicesAvailabilityQuery,
    ...CountryCityTreeQuery,
    user,
    office,
    offices,
    locations,
    proposal,
    trip
  })
});

/**
 * This is the type that will be the root of our query,
 * and the entry point into our schema.
 */
const queryType = new GraphQLObjectType({
  name: 'Query',
  fields: () => ({
    node: nodeField,
    viewer: {
      type: viewerType,
      resolve: () => ({})
    }
  })
});

/**
 * This is the type that will be the root of our mutations,
 * and the entry point into performing writes in our schema.
 */
const mutationType = new GraphQLObjectType({
  name: 'Mutation',
  fields: () => ({
    ...TripPlannerMutation,
    ...ProposalMutation,
    ...CountryBookingMutation,
    ...CityBookingMutation,
    ...ServiceBookingMutation,
    ...TripMutation,
    ...CityDayMutation,
    ...SupplierMutation,
    ...TourMutation,
    ...TransferPlacementMutation,
    ...PaxMutation,
    ...CountryCityTreeMutation,
    ...TripToWordMutation
  })
});

/**
 * Finally, we construct our schema (whose starting query type is the query
 * type we defined above) and export it.
 */
export default new GraphQLSchema({
  query: queryType,
  mutation: mutationType
});
