import { GraphQLID, GraphQLObjectType, GraphQLString, GraphQLList, GraphQLBoolean, GraphQLInt } from 'graphql';
import SupplierAddress from './SupplierAddress';
import AccommodationType from './Accommodation';
import ClassType from './Class';
import ImagesType from '../../Tour/types/Images';

export default new GraphQLObjectType({
  name: 'AccessibleSuppliers',
  description: 'The accessible suppliers in quickplan from tourplan.',
  fields: () => ({
    id: {
      type: GraphQLID,
      resolve: supplier => supplier._key
    },
    _key: {
      type: GraphQLString,
      description: 'Unique supplier ID.'
    },
    supplierId: {
      type: GraphQLString,
      description: 'Supplier ID in tourplan.'
    },
    title: {
      type: GraphQLString,
      description: 'Name of supplier.'
    },
    description: {
      type: GraphQLString,
      description: 'Description of supplier.',
      resolve: ({ description }) => description || ''
    },
    phone: {
      type: GraphQLString,
      description: 'Supplier phone.'
    },
    fax: {
      type: GraphQLString,
      description: 'Supplier fax.'
    },
    email: {
      type: GraphQLString,
      description: 'Supplier email.'
    },
    web: {
      type: GraphQLString,
      description: 'Supplier web.'
    },
    childPolicy: {
      type: GraphQLString,
      description: 'Suppliers child policy.'
    },
    cancellationPolicy: {
      type: GraphQLString,
      description: 'the suppliers cancellation policy.'
    },
    address: {
      type: SupplierAddress,
      description: 'The address of the supplier.'
    },
    supplierCode: {
      type: GraphQLString,
      description: 'The supplier code to use for retrieving information from TourPlan.'
    },
    images: {
      type: new GraphQLList(ImagesType),
      resolve: ({ images }) => images || []
    },
    cheapestRoomRate: {
      type: GraphQLInt,
      resolve: sup => sup.cheapestRoomRate && sup.cheapestRoomRate.length >= 2 ? sup.cheapestRoomRate.substring(0, sup.cheapestRoomRate.length - 2) : null  // eslint-disable-line no-confusing-arrow
    },
    currency: {
      type: GraphQLString
    },
    class: {
      type: ClassType,
      description: 'Supplier class, take from the first accommodation in the supplier',
      resolve: sup => sup.accommodations[0].class
    },
    isPreferred: {
      type: GraphQLBoolean,
      resolve: sup => sup.accommodations.some(acc => acc.isPreferred)
    },
    isPreselected: {
      type: GraphQLBoolean,
      resolve: sup => sup.accommodations.some(acc => acc.isPreselected)
    },
    hasPromotions: {
      type: GraphQLBoolean,
      resolve: sup => sup.accommodations.some(acc => acc.hasPromotions)
    },
    accommodations: {
      type: new GraphQLList(AccommodationType)
    }
  })
});
