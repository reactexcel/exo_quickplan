import { GraphQLString, GraphQLList, GraphQLInt, GraphQLBoolean, GraphQLInputObjectType } from 'graphql';
import { mutationWithClientMutationId } from 'graphql-relay';
import * as proposalCtrl from './../controllers/Proposal';
import ProposalType from './../types/Proposal';

const props = {
  startTravelInCity: { type: GraphQLString },
  startTravelOnDate: { type: GraphQLString },
  travelDuration: { type: GraphQLInt },
  notes: { type: GraphQLString },
  class: { type: new GraphQLList(GraphQLInt) },
  style: { type: new GraphQLList(GraphQLString) },
  status: { type: GraphQLString },
  createOnDate: { type: GraphQLString },
  name: { type: GraphQLString },
  private: { type: GraphQLBoolean },
};

const paxProps = {
  firstName: { type: GraphQLString },
  lastName: { type: GraphQLString },
  gender: { type: GraphQLString },
  dateOfBirth: { type: GraphQLString },
  ageOnArrival: { type: GraphQLString },
  ageGroup: { type: GraphQLString }
};

export default mutationWithClientMutationId({
  name: 'AddProposal',
  inputFields: {
    proposal: {
      type: new GraphQLInputObjectType({
        name: 'ProposalAddInput',
        fields: props
      })
    },
    pax: {
      type: new GraphQLInputObjectType({
        name: 'ProposalAddPaxInput',
        fields: paxProps
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
      type: GraphQLString
    },
    userToken: {
      type: GraphQLString
    }
  },
  outputFields: {
    proposal: {
      type: ProposalType,
      resolve: saveDoc => saveDoc
    }
  },
  mutateAndGetPayload: async (inputFields) => {
    const saveDoc = await proposalCtrl.addProposal(inputFields);
    return saveDoc;
  }
});
