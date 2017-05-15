import { GraphQLObjectType, GraphQLList, GraphQLString, GraphQLInt, GraphQLBoolean } from 'graphql';
import { globalIdField } from 'graphql-relay';

import LocationImageType from './LocationImage';
import LocationMapType from './LocationMap';
import LocationProvinceType from './LocationProvince';
import LocationTimeZoneType from './LocationTimeZone';
import LocationAirports from './LocationAirports';

export default new GraphQLObjectType({
  name: 'Location',
  fields: () => ({
    id: globalIdField('Location', location => location._key),
    _key: {
      type: GraphQLString
    },
    country: { // Not in data model
      type: GraphQLString
    },
    type: {
      type: GraphQLString
    },
    unCode: {
      type: GraphQLString
    },
    tpCode: {
      type: GraphQLString
    },
    province: {
      type: LocationProvinceType
    },
    name: {
      type: GraphQLString,
      resolve: ({ name }) => name || ''
    },
    map: {
      type: LocationMapType
    },
    phoneCode: {
      type: GraphQLInt
    },
    timeZone: {
      type: LocationTimeZoneType
    },
    description: {
      type: GraphQLString
    },
    images: {
      type: new GraphQLList(LocationImageType)
    },
    isEXODestination: {
      type: GraphQLBoolean
    },
    tpServer: {
      type: GraphQLString
    },
    airports: {
      type: new GraphQLList(LocationAirports)
    }
  })
});
