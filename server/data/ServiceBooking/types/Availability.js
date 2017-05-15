import { GraphQLObjectType, GraphQLString, GraphQLInt, GraphQLList, GraphQLBoolean } from 'graphql';
import PromotionType from '../../Availability/types/Promotion';

export default new GraphQLObjectType({
  name: 'ServiceAvailability',
  description: 'Check availability for services',
  fields: () => ({
    productId: {
      type: GraphQLString,
      description: 'ID from Tourplan'
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
