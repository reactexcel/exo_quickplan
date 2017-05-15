import { GraphQLInputObjectType, GraphQLObjectType, GraphQLBoolean } from 'graphql';

const props = {
  vegetarian: {
    type: GraphQLBoolean
  },
  vegan: {
    type: GraphQLBoolean
  },
  kosher: {
    type: GraphQLBoolean
  },
  halal: {
    type: GraphQLBoolean
  }
};

const DietaryInputType = new GraphQLInputObjectType({
  name: 'DietaryInputTripPlanner',
  description: 'Dietary preferences',
  fields: () => props
});

const DietaryOutputType = new GraphQLObjectType({
  name: 'DietaryOutputTripPlanner',
  description: 'Dietary preferences',
  fields: () => props
});

export { DietaryInputType, DietaryOutputType };
