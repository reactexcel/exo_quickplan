import { GraphQLObjectType, GraphQLList } from 'graphql';
import { globalIdField } from 'graphql-relay';
import { nodeInterface } from '../../interface';
import CountryItemType from './countryItemType';

export default new GraphQLObjectType({
  name: 'TreeStructureType',
  description: 'A trip country city structure tree.',
  fields: () => ({
    id: globalIdField('TreeStructure'),
    Tree: {
      type: new GraphQLList(CountryItemType)
    }
  }),
  interfaces: [nodeInterface]
});
