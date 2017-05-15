import { GraphQLObjectType, GraphQLString, GraphQLInt, GraphQLList, GraphQLBoolean } from 'graphql';
import PromotionType from './Promotion';

export default new GraphQLObjectType({
  name: 'TourAvailability',
  description: 'Check tour for availability',
  fields: () => ({
    productId: {
      type: GraphQLString,
      description: 'Tour ID from Tourplan'
    },
    productOptCode: {
      type: GraphQLString
    },
    availability: {
      type: GraphQLString
    },
    currency: {
      type: GraphQLString
    },
    totalPrice: {
      type: GraphQLInt
    },
    commisionPersent: {
      type: GraphQLInt
    },
    agentPrice: {
      type: GraphQLInt
    },
    rateId: {
      type: GraphQLString
    },
    rateName: {
      type: GraphQLString
    },
    rateText: {
      type: GraphQLString
    },
    cancelHours: {
      type: GraphQLInt
    },
    dateFrom: {
      type: GraphQLString
    },
    dateTo: {
      type: GraphQLString
    },
    promotions: {
      type: new GraphQLList(PromotionType)
    },
    hasPromotions: {
      type: GraphQLBoolean
    }
  })
});
