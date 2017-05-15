import { GraphQLObjectType, GraphQLString, GraphQLBoolean } from 'graphql';

export default new GraphQLObjectType({
  name: 'AccessibleTourPromotion',
  fields: () => ({
    promotionStatus: {
      type: GraphQLBoolean
    },
    promotionsDetails: {
      type: GraphQLString
    }
  })
});
