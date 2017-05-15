import { GraphQLString } from 'graphql';
import * as cityDayController from '../controllers/CityDay';
import CityDay from '../types/CityDay';

export default {
  cityDay: {
    type: CityDay,
    args: {
      cityDayKey: {
        type: GraphQLString
      },
      slot: {
        type: GraphQLString
      }
    },
    resolve: async (_, args) => await cityDayController.getCityDay(args) || []
  }
};
