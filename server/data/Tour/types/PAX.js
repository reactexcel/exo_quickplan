import { GraphQLObjectType, GraphQLInt } from 'graphql';
import KidsType from './Kid';
import AdultPAXType from './AdultPAX';

export default new GraphQLObjectType({
  name: 'PAXType',
  fields: () => ({
    maxPax: {
      type: GraphQLInt
    },
    infants: {
      type: KidsType
    },
    children: {
      type: KidsType
    },
    adults: {
      type: AdultPAXType
    }
  })
});
