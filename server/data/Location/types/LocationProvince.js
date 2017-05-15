import { GraphQLObjectType, GraphQLString } from 'graphql';

export default new GraphQLObjectType({
  name: 'LocationProvince',
  fields: () => ({
    isoProvinceCode: {
      type: GraphQLString
    },
    provinceName: {
      type: GraphQLString
    }
  })
});
