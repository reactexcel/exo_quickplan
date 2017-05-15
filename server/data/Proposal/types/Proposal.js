import { GraphQLObjectType, GraphQLString, GraphQLInt, GraphQLList, GraphQLBoolean } from 'graphql';
import { globalIdField } from 'graphql-relay';
import PaxType from '../../Pax/types/Pax';
import UserType from '../../User/UserType';
import TripType from '../../Trip/types/Trip';
import LocationType from '../../Location/types/Location';
import {
  getBookedTrip,
  getUser,
  getMainPax,
  getTripsCount,
  getLocation,
  getTrips
} from '../controllers/Proposal';
import { getProposalPaxs } from '../../Pax/controllers/Pax';

export default new GraphQLObjectType({
  name: 'Proposal',
  description: 'The proposal object in Quickplan',
  fields: () => ({
    id: globalIdField('Proposal', proposal => proposal._key),
    _key: {
      type: GraphQLString
    },
    startTravelInCity: {
      type: GraphQLString
    },
    startTravelIn: {
      type: LocationType,
      resolve: async ({ _key }) => {
        const location = (await getLocation(_key) || [])[0];
        if (!location) {
          return {};
        }

        const combinedLocation = location[0];
        combinedLocation.name = location.map(l => l.name).join(', ');
        return combinedLocation;
      }
    },
    startTravelOnDate: {
      type: GraphQLString,
      resolve: ({ startTravelOnDate }) => startTravelOnDate || ''
    },
    travelDuration: {
      type: GraphQLInt,
      resolve: ({ travelDuration }) => travelDuration || 0
    },
    nrAdult: {
      type: GraphQLInt
    },
    nrChildren: {
      type: GraphQLInt
    },
    nrInfant: {
      type: GraphQLInt
    },
    notes: {
      type: GraphQLString
    },
    class: {
      type: new GraphQLList(GraphQLInt)
    },
    style: {
      type: new GraphQLList(GraphQLString)
    },
    occasion: {
      type: new GraphQLList(GraphQLString)
    },
    preferredLanguage: {
      type: GraphQLString
    },
    createOnDate: {
      type: GraphQLString
    },
    updatedOn: {
      type: GraphQLString,
      resolve: ({ updatedOn }) => updatedOn || ''
    },
    status: {
      type: GraphQLString,
      resolve: ({ status }) => status || ''
    },
    mainPax: {
      type: PaxType,
      resolve: async ({ _key }) => await getMainPax(_key) || {}
    },
    tripsCount: {
      type: GraphQLInt,
      resolve: ({ _key }) => getTripsCount(_key)
    },
    name: {
      type: GraphQLString
    },
    private: {
      type: GraphQLBoolean,
      resolve: proposal => proposal.private || false
    },
    TA: {
      type: UserType,
      resolve: async ({ _key: proposalKey }) => await getUser(proposalKey, 'TA')
        || {}
    },
    TC: {
      type: UserType,
      resolve: async ({ _key: proposalKey }) => await getUser(proposalKey, 'TC')
        || {}
    },
    bookedTrip: {
      type: TripType,
      resolve: async ({ _key }) => await getBookedTrip(_key) || {}
    },
    trips: {
      type: new GraphQLList(TripType),
      resolve: async ({ _key }) => await getTrips(_key) || []
    },
    paxs: {
      type: new GraphQLList(PaxType),
      resolve: async ({ _key }) => await getProposalPaxs(_key) || []
    }
  })
});
