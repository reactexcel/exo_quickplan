import { GraphQLObjectType, GraphQLString, GraphQLBoolean, GraphQLList } from 'graphql';
import { globalIdField } from 'graphql-relay';
import PaxInfoType from './PaxInfo';
import StayLimitType from './StayLimit';
import LocalityType from './Locality';
import ClassType from './Class';
import AccommodationSupplierType from './Supplier';
import AccommodationRate from './AccommodationRate';
import PromotionType from '../../Availability/types/Promotion';

export default new GraphQLObjectType({
  name: 'Accommodation',
  fields: () => ({
    id: globalIdField('Accommodation', acc => acc._key),
    _key: {
      type: GraphQLString
    },
    isPreferred: {
      type: GraphQLBoolean
    },
    isPromotion: {
      type: GraphQLBoolean
    },
    isPreselected: {
      type: GraphQLBoolean
    },
    hasPromotions: {
      type: GraphQLBoolean
    },
    promotions: {
      type: new GraphQLList(PromotionType)
    },
    rate: {
      type: AccommodationRate
    },
    productId: {
      type: GraphQLString
    },
    supplierId: {
      type: GraphQLString
    },
    pax: {
      type: PaxInfoType
    },
    stayLimits: {
      type: StayLimitType
    },
    productOptCode: {
      type: GraphQLString
    },
    title: {
      type: GraphQLString
    },
    category: {
      type: GraphQLString
    },
    sType: {
      type: GraphQLString
    },
    voucherName: {
      type: GraphQLString
    },
    locality: {
      type: LocalityType
    },
    class: {
      type: ClassType
    },
    supplier: {
      type: AccommodationSupplierType
    }
  })
});
