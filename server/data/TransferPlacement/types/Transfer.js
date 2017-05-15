import { GraphQLObjectType, GraphQLString, GraphQLInt } from 'graphql';
import { globalIdField } from 'graphql-relay';
import SupplierType from '../../Supplier/types/AccessibleSupplier';
import { getSupplierByTransferId } from '../controllers/Transfer';

const LocationType = new GraphQLObjectType({
  name: 'LocationType',
  fields: () => ({
    cityName: {
      type: GraphQLString
    },
    tpCode: {
      type: GraphQLString
    },
    localityName: {
      type: GraphQLString,
      resolve: ({ localityName }) => {
        if (localityName === '-') {
          return '';
        }

        return localityName || '';
      }
    },
    place: {
      type: GraphQLString,
      resolve: ({ place }) => {
        if (place === '-') {
          return '';
        }

        return place || '';
      }
    }
  })
});

const RouteType = new GraphQLObjectType({
  name: 'Route',
  fields: () => ({
    direction: {
      type: GraphQLString
    },
    from: {
      type: LocationType
    },
    to: {
      type: LocationType
    },
    departureTime: { // TODO: change stub data
      type: GraphQLString,
      resolve: ({ departureTime }) => departureTime || '10:15'
    },
    arrivalTime: { // TODO: change stub data
      type: GraphQLString,
      resolve: ({ arrivalTime }) => arrivalTime || '11:20'
    }
  })
});

const TypeType = new GraphQLObjectType({
  name: 'Type',
  fields: () => ({
    description: {
      type: GraphQLString
    }
  })
});

const ClassType = new GraphQLObjectType({
  name: 'Class',
  fields: () => ({
    description: {
      type: GraphQLString
    }
  })
});

const VehicleType = new GraphQLObjectType({
  name: 'Vehicle',
  fields: () => ({
    category: {
      type: GraphQLString
    },
    model: {
      type: GraphQLString
    },
    maxPax: {
      type: GraphQLString
    }

  })
});

export default new GraphQLObjectType({
  name: 'Transfer',
  description: 'The accessible transfers in quickplan from tourplan.',
  fields: () => ({
    id: globalIdField('Transfer', transfer => transfer._key),
    _key: {
      type: GraphQLString,
      description: 'Unique transfer ID.'
    },
    route: {
      type: RouteType
    },
    title: {
      type: GraphQLString
    },
    description: {
      type: GraphQLString
    },
    comment: {
      type: GraphQLString
    },
    guideLanguage: {
      type: GraphQLString
    },
    type: {
      type: TypeType
    },
    vehicle: {
      type: VehicleType
    },
    class: {
      type: ClassType
    },
    supplier: {
      type: SupplierType,
      resolve: async transfer => await getSupplierByTransferId(transfer._id)
    }
  })
});
