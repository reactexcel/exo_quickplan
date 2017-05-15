import { GraphQLObjectType, GraphQLString, GraphQLInt, GraphQLBoolean, GraphQLList } from 'graphql';
import LocalityType from './LocalityType';
import RateType from './Rate';
import AccessibleTourPromotionType from './AccessibleTourPromotion';
import PromotionType from '../../Availability/types/Promotion';
import PAXType from './PAX';
import ExtrasType from './Extras';
import ImagesType from './Images';
import TimeSlotsType from './TimeSlots';

export default new GraphQLObjectType({
  name: 'Tour',
  description: 'The tour object in quickplan',
  fields: () => ({
    _key: {
      type: GraphQLString,
      description: 'Unique tour ID.'
    },
    productId: {
      type: GraphQLString,
      description: 'Tour ID from Tourplan'
    },
    title: {
      type: GraphQLString
    },
    productOptCode: {
      type: GraphQLString
    },
    category: {
      type: GraphQLString
    },
    sType: {
      type: GraphQLString
    },
    guideLanguage: {
      type: GraphQLString
    },
    locality: {
      type: LocalityType
    },
    comment: {
      type: GraphQLString
    },
    description: {
      type: GraphQLString,
      resolve: ({ description }) => description || ''
    },
    rank: {
      type: GraphQLInt
    },
    rate: {
      type: RateType
    },
    isPreferred: {
      type: GraphQLBoolean
    },
    isPreselected: {
      type: GraphQLBoolean
    },
    isPromotion: {
      type: GraphQLBoolean
    },
    hasPromotions: {
      type: GraphQLBoolean
    },
    promotions: {
      type: new GraphQLList(PromotionType)
    },
    accessibleTourPromotion: {
      type: AccessibleTourPromotionType
    },
    durationSlots: {
      type: GraphQLInt
    },
    cancellationPolicy: {
      type: GraphQLString
    },
    timeSlots: {
      type: TimeSlotsType
    },
    voucherName: {
      type: GraphQLString
    },
    pax: {
      type: PAXType
    },
    childPolicy: {
      type: GraphQLString
    },
    extras: {
      type: new GraphQLList(ExtrasType)
    },
    introduction: {
      type: GraphQLString
    },
    notes: {
      type: GraphQLString
    },
    details: {
      type: GraphQLString
    },
    exclusions: {
      type: new GraphQLList(GraphQLString),
      resolve: ({ exclusions }) => exclusions || []
    },
    highlights: {
      type: new GraphQLList(GraphQLString),
      resolve: ({ highlights }) => highlights || []
    },
    inclusions: {
      type: new GraphQLList(GraphQLString),
      resolve: ({ inclusions }) => inclusions || []
    },
    styles: {
      type: new GraphQLList(GraphQLString)
    },
    images: {
      type: new GraphQLList(ImagesType),
      resolve: ({ images }) => images || []
    }
  })
});
