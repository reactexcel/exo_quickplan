import { GraphQLObjectType, GraphQLInt, GraphQLList, GraphQLString } from 'graphql';
import { globalIdField } from 'graphql-relay';
import { nodeInterface } from '../../interface';
import ServiceBookingType from '../../ServiceBooking/types/ServiceBooking';
import LocationType from '../../Location/types/Location';
import { getServiceBooking } from '../../ServiceBooking/controllers/ServiceBooking';
import { getCityLocationByTransferPlacementKey, getTransferStatus } from '../controllers/TransferPlacement';
import TransferStatusesType from '../types/TransferStatuses';

export default new GraphQLObjectType({
  name: 'TransferPlacement',
  fields: () => ({
    id: globalIdField('TransferPlacement', transferPlacement => transferPlacement._key),
    _key: {
      type: GraphQLString
    },
    durationDays: {
      type: GraphQLInt
    },
    startDate: {
      type: GraphQLString
    },
    startDay: {
      type: GraphQLInt
    },
    serviceBookings: {
      type: new GraphQLList(ServiceBookingType),
      resolve: (transferPlacement) => {
        if (!transferPlacement.serviceBookingOrder) return [];
        return transferPlacement.serviceBookingOrder.map(async serviceBookingKey => await getServiceBooking(serviceBookingKey));
      }
    },
    transferStatus: {
      type: TransferStatusesType,
      resolve: async transferPlacement => await getTransferStatus(transferPlacement._key)
    },
    fromCity: {
      type: LocationType,
      resolve: async (transferPlacement) => {
        if (transferPlacement.returnLocalTransferAdded) { // added for local transfer case
          return {};
        }
        return await getCityLocationByTransferPlacementKey({ transferPlacementKey: transferPlacement._key, type: 'from' });
      }
    },
    toCity: {
      type: LocationType,
      resolve: async (transferPlacement) => {
        if (transferPlacement.returnLocalTransferAdded) { // added for local transfer case
          return {};
        }
        return await getCityLocationByTransferPlacementKey({ transferPlacementKey: transferPlacement._key, type: 'to' });
      }
    }
  }),
  interfaces: [nodeInterface]
});
