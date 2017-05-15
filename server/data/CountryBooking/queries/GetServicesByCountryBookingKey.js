import { GraphQLString, GraphQLID } from 'graphql';
import QueryCountryBookingType from '../types/CountryBooking';
import * as countrybookingCtrl from '../controllers/CountryBooking';

export default {
  getServicesByCountryBookingKey: {
    type: QueryCountryBookingType,
    args: {
      countryBookingKey: {
        type: GraphQLID
      },
      agent: {
        type: GraphQLString
      },
      password: {
        type: GraphQLString
      }
    },
    resolve: async (_, { countryBookingKey }) => {
      if (countryBookingKey) {
        const services = await countrybookingCtrl.getCountryBooking(countryBookingKey);
        return services;
      }
      return [];
    }
  }
};
