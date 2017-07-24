'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _graphql = require('graphql');

var _graphqlRelay = require('graphql-relay');

var _interface = require('../../interface');

// import { PaxErrorType } from './PaxError';

var ErrorType = new _graphql.GraphQLObjectType({
  name: 'Error',
  fields: function fields() {
    return {
      severity: {
        type: _graphql.GraphQLInt
      },
      message: {
        type: _graphql.GraphQLString
      },
      errorType: {
        type: _graphql.GraphQLString
      }
    };
  }
});

exports.default = new _graphql.GraphQLObjectType({
  name: 'Pax',
  description: 'Passenger type',
  fields: function fields() {
    return {
      id: (0, _graphqlRelay.globalIdField)('Pax', function (pax) {
        return pax._key;
      }),
      _key: {
        type: _graphql.GraphQLString
      },
      firstName: {
        type: _graphql.GraphQLString,
        resolve: function resolve(_ref) {
          var firstName = _ref.firstName;
          return firstName || '';
        }
      },
      lastName: {
        type: _graphql.GraphQLString,
        resolve: function resolve(_ref2) {
          var lastName = _ref2.lastName;
          return lastName || '';
        }
      },
      gender: {
        type: _graphql.GraphQLString
      },
      dateOfBirth: {
        type: _graphql.GraphQLString
      },
      ageOnArrival: {
        type: _graphql.GraphQLString
      },
      ageGroup: {
        type: _graphql.GraphQLString
      },
      language: {
        type: _graphql.GraphQLString
      },
      passportNr: {
        type: _graphql.GraphQLString,
        resolve: function resolve(_ref3) {
          var passportNr = _ref3.passportNr;
          return passportNr || '';
        }
      },
      passportImage: {
        type: _graphql.GraphQLString
      },
      nationality: {
        type: _graphql.GraphQLString,
        resolve: function resolve(_ref4) {
          var nationality = _ref4.nationality;
          return nationality || '';
        }
      },
      passportExpiresOn: {
        type: _graphql.GraphQLString
      },
      diet: {
        type: new _graphql.GraphQLList(_graphql.GraphQLString),
        resolve: function resolve(_ref5) {
          var diet = _ref5.diet;
          return diet || [];
        }
      },
      allergies: {
        type: new _graphql.GraphQLList(_graphql.GraphQLString),
        resolve: function resolve(_ref6) {
          var allergies = _ref6.allergies;
          return allergies || [];
        }
      },
      isMainPax: {
        type: _graphql.GraphQLBoolean
      },
      paxError: {
        type: new _graphql.GraphQLList(ErrorType)
      }
    };
  }
  // ,interfaces: [nodeInterface]
});