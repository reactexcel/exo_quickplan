import { GraphQLID, GraphQLObjectType, GraphQLString, GraphQLList } from 'graphql';
import CityItemType from './cityItemType';

export default new GraphQLObjectType({
  name: 'countryItemType',
  description: 'Country tree view item.',
  fields: () => ({
    id: {
      type: GraphQLID,
      description: 'Country item id.'
    },
    title: {
      type: GraphQLString,
      description: 'Item title.'
    },
    children: {
      type: new GraphQLList(CityItemType),
      description: 'Cities of a country'
    }
  })
});
