import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLList,
  GraphQLBoolean
} from 'graphql';

const CurrencyType = new GraphQLObjectType({
  name: 'CurrencyType',
  fields: () => ({
    countryCode: {
      type: GraphQLString
    },
    currency: {
      type: GraphQLString
    },
    tpPW: {
      type: GraphQLString
    },
    tpUID: {
      type: GraphQLString
    }
  })
});


export default CurrencyType;
