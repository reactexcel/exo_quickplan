import { GraphQLNonNull, GraphQLID, GraphQLString } from 'graphql';
import { mutationWithClientMutationId } from 'graphql-relay';
import CountryCityTreeType from './../types/CountryCityTree';
import * as countryCityTreeCtrl from '../controllers/CountryCityTree';

export default mutationWithClientMutationId({
  name: 'CountryCityTree',
  inputFields: {
    id: {
      type: new GraphQLNonNull(GraphQLID)
    },
    Tree: {
      type: GraphQLString,
    },
    tripKey: {
      type: GraphQLString
    }
  },
  outputFields: {
    TreeStructure: {
      type: CountryCityTreeType,
      resolve: newTree => newTree
    }
  },
  mutateAndGetPayload: async (inputFields) => {
    const newTree = await countryCityTreeCtrl.mutateTree(inputFields);
    return { Tree: newTree };
  }
});
