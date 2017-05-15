import { GraphQLString, GraphQLID } from 'graphql';
import { connectionArgs } from 'graphql-relay';
import UserType from './UserType';
import { getUser } from './UserController';
import auth0 from '../../utils/auth';


export default {
  type: UserType,
  args: {
    userKey: {
      type: GraphQLID
    },
    userToken: {
      type: GraphQLString
    },
    agent: {
      type: GraphQLString
    },
    password: {
      type: GraphQLString
    },
    ...connectionArgs
  },
  resolve: (_, user) => new Promise((resolve) => {
    if (user.userToken) {
      auth0.getProfile(user.userToken, (err, profile) => {
        if (err) {
          console.error(err);
          resolve({});
        } else {
          getUser({
            ...user,
            userEmail: JSON.parse(profile).email
          }).then(resolve, (err) => {
            console.error(err);
            resolve({});
          });
        }
      });
    } else {
      getUser(user).then(resolve, (err) => {
        console.error(err);
        resolve({});
      });
    }
  })
};
