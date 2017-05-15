import { GraphQLObjectType, GraphQLString } from 'graphql';

export default new GraphQLObjectType({
  name: 'AccommodationSupplier',
  fields: () => ({
    supplierId: {
      type: GraphQLString
    },
    supplierName: {
      type: GraphQLString
    }
  })
});
