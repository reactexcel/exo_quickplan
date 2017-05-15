import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLList
} from 'graphql';


import UserType from '../User/UserType';
import CurrencyType from '../User/CurrencyType';
import { getUsers } from './OfficeController';


export default new GraphQLObjectType({
  name: 'OfficeType',
  fields: () => ({
    _key: {
      type: GraphQLString
    },
    companyName: {
      type: GraphQLString,
      resolve: ({ companyName }) => companyName || ''
    },
    workInCountries: {
      type: new GraphQLList(CurrencyType)
    },
    officeName: {
      type: GraphQLString,
      resolve: ({ officeName }) => officeName || ''
    },
    users: {
      type: new GraphQLList(UserType),
      resolve: async ({ _key }) => await getUsers(_key) || []
    }
  })
});
