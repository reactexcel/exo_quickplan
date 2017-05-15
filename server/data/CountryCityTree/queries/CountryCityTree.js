import { GraphQLString } from 'graphql';
import * as countryCityTreeCtrl from '../controllers/CountryCityTree';
import CountryCityTreeType from '../types/CountryCityTree';

export default {
  TreeStructure: {
    type: CountryCityTreeType,
    args: {
      tripKey: {
        type: GraphQLString
      }
    },
    resolve: async (_, args) => {
      const result = await countryCityTreeCtrl.getTree(args);
      return { Tree: result };
    }
  }
};
