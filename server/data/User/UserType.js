import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLList,
  GraphQLBoolean
} from 'graphql';
import OfficeType from '../Office/OfficeType';
import ProposalType from '../Proposal/types/Proposal';
import {
  getOffice,
  getProposals,
  getSupervisingTCs
} from './UserController';

const UserType = new GraphQLObjectType({
  name: 'UserType',
  fields: () => ({
    _key: {
      type: GraphQLString
    },
    email: {
      type: GraphQLString,
      resolve: ({ email }) => email || ''
    },
    role: {
      type: GraphQLString
    },
    firstName: {
      type: GraphQLString,
      resolve: ({ firstName }) => firstName || ''
    },
    lastName: {
      type: GraphQLString,
      resolve: ({ lastName }) => lastName || ''
    },
    office: {
      type: OfficeType,
      resolve: async ({ _key: userKey }) => await getOffice(userKey) || {}
    },
    isSupervisor: {
      type: GraphQLBoolean
    },
    proposals: {
      type: new GraphQLList(ProposalType),
      resolve: async ({
        _key: userKey,
        role,
        isSupervisor
      }) => await getProposals({ userKey, role, isSupervisor }) || []
    },
    supervisingTCs: {
      type: new GraphQLList(UserType),
      resolve: async user => await getSupervisingTCs(user) || [user]
    },
    created: {
      type: GraphQLBoolean
    }
  })
});


export default UserType;
