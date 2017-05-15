import { GraphQLObjectType, GraphQLInt, GraphQLList, GraphQLString } from 'graphql';
import { globalIdField } from 'graphql-relay';
import { nodeInterface } from '../../interface';
import ServiceBookingType from '../../ServiceBooking/types/ServiceBooking';
import ImageType from '../../Tour/types/Images';
import SupplierType from '../../Supplier/types/AccessibleSupplier';

export default new GraphQLObjectType({
  name: 'AccommodationPlacement',
  fields: ({
    id: globalIdField('AccommodationPlacement', accommodationPlacement => accommodationPlacement._key),
    _key: {
      type: GraphQLString,
      description: 'Unique tour ID.'
    },
    durationNights: {
      type: GraphQLInt
    },
    startDay: {
      type: GraphQLInt
    },
    images: {
      type: new GraphQLList(ImageType)
    },
    serviceBookings: {
      type: new GraphQLList(ServiceBookingType)
    },
    supplier: {
      type: SupplierType
    },
    startDate: {
      type: GraphQLString
    },
    preselectionNum: {
      type: GraphQLInt
    }
  }),
  interfaces: [nodeInterface]
});
