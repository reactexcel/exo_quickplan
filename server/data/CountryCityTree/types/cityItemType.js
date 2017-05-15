import { GraphQLID, GraphQLObjectType, GraphQLString, GraphQLList } from 'graphql';

export default new GraphQLObjectType({
  name: 'cityItemType',
  description: 'City tree view item.',
  fields: () => ({
    id: {
      type: GraphQLID,
      description: 'City item id.'
    },
    title: {
      type: GraphQLString
    },
    children: {
      type: new GraphQLList(GraphQLString),
      description: 'Empty array.'
    }
  })
});
