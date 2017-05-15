import {
  GraphQLString,
  GraphQLInputObjectType,
  GraphQLInt,
  GraphQLNonNull,
  GraphQLBoolean,
  GraphQLList
} from 'graphql';
import { mutationWithClientMutationId } from 'graphql-relay';
import ProposalType from '../types/Proposal';
import { updateProposalDetails } from '../controllers/Proposal';


export default mutationWithClientMutationId({
  name: 'UpdateProposalDetails',
  description: 'Update the the give Proposal Details',
  inputFields: {
    proposal: {
      type: new GraphQLInputObjectType({
        name: 'ProposalInput',
        fields: {
          startTravelInCity: { type: GraphQLString },
          startTravelOnDate: { type: GraphQLString },
          travelDuration: { type: GraphQLInt },
          class: { type: new GraphQLList(GraphQLInt) },
          style: { type: new GraphQLList(GraphQLString) },
          notes: { type: GraphQLString },
          proposalKey: { type: new GraphQLNonNull(GraphQLString) },
          status: { type: GraphQLString },
          name: { type: GraphQLString },
          private: { type: GraphQLBoolean },
        }
      })
    },
    selectedTC: {
      type: GraphQLString
    },
    selectedOffice: {
      type: GraphQLString,
    },
    selectedTAOffice: {
      type: GraphQLString
    },
    selectedTA: {
      type: GraphQLString
    },
    selectedLocation: {
      type: GraphQLString,
    },
  },
  outputFields: {
    proposal: {
      type: ProposalType,
      resolve: saveDoc => saveDoc
    }
  },
  mutateAndGetPayload: async inputFields => await updateProposalDetails(inputFields)

});
