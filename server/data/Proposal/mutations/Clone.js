import { GraphQLString } from 'graphql';
import { mutationWithClientMutationId } from 'graphql-relay';
import * as proposalCtrl from '../controllers/Proposal';
import auth0 from '../../../utils/auth';
import Proposal from '../../Proposal/types/Proposal';

export default mutationWithClientMutationId({
  name: 'CloneProposal',
  inputFields: {
    proposalKey: { type: GraphQLString },
    userToken: { type: GraphQLString }
  },
  outputFields: {
    proposal: {
      type: Proposal,
      resolve: proposal => proposal
    }
  },
  mutateAndGetPayload: async ({ proposalKey, userToken }) => {
    const res = await new Promise((resolve, reject) => {
      if (!userToken) {
        reject('Invalid user token');
      } else {
        auth0.getProfile(userToken, (err, profile) => {
          if (err) {
            reject(err);
          } else {
            proposalCtrl.cloneProposal({
              proposalKey,
              userEmail: JSON.parse(profile).email
            }).then(resolve, reject);
          }
        });
      }
    });

    return res;
  }
});
