import { GraphQLNonNull, GraphQLID, GraphQLString, GraphQLBoolean } from 'graphql';
import { mutationWithClientMutationId } from 'graphql-relay';
import * as wordFileURLCtrl from '../controllers/WordFileURL';

export default mutationWithClientMutationId({
  name: 'TripToWordURL',
  inputFields: {
    id: {
      type: new GraphQLNonNull(GraphQLID)
    },
    tripKey: {
      type: GraphQLString
    },
    userToken: {
      type: GraphQLString
    },
    firstName: {
      type: GraphQLString
    },
    lastName: {
      type: GraphQLString
    },
    showLineAmounts: {
      type: GraphQLBoolean
    },
    showCategoryAmounts: {
      type: GraphQLBoolean
    },
    showImages: {
      type: GraphQLBoolean
    },
    showDescriptions: {
      type: GraphQLBoolean
    },
    showDayNotes: {
      type: GraphQLBoolean
    }
  },
  outputFields: {
    wordFileURL: {
      type: GraphQLString,
      resolve: newURL => newURL.url
    }
  },
  mutateAndGetPayload: async (inputFields) => {
    const newURL = await wordFileURLCtrl.getWordURL(inputFields);
    console.log(newURL);
    return newURL;
  }
});
