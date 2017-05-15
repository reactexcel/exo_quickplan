import { GraphQLString, GraphQLList, GraphQLBoolean, GraphQLInt } from 'graphql';
import { mutationWithClientMutationId } from 'graphql-relay';
import * as paxCtrl from '../controllers/Pax';
import PaxType from '../types/Pax';

const props = {
  paxKey: { type: GraphQLString },
  isMainPax: { type: GraphQLBoolean },

  firstName: { type: GraphQLString },
  lastName: { type: GraphQLString },
  gender: { type: GraphQLString },
  dateOfBirth: { type: GraphQLString },
  ageOnArrival: { type: GraphQLString },
  ageGroup: { type: GraphQLString },
  language: { type: GraphQLString },
  passportNr: { type: GraphQLString },
  // passportImage: { type: GraphQLString },
  nationality: { type: GraphQLString },
  passportExpiresOn: { type: GraphQLString },
  diet: { type: new GraphQLList(GraphQLString) },
  allergies: { type: new GraphQLList(GraphQLString) }
};

export default mutationWithClientMutationId({
  name: 'UpdatePax',
  inputFields: {
    ...props
  },
  outputFields: {
    pax: {
      type: PaxType,
      resolve: pax => pax
    }
  },
  mutateAndGetPayload: async (inputFields) => {
    const pax = await paxCtrl.updatePax(inputFields);
    return pax;
  }
});
