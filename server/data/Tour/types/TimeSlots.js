import { GraphQLObjectType } from 'graphql';
import SlotsType from './Slots';

export default new GraphQLObjectType({
  name: 'TimeSlotsType',
  fields: () => ({
    Morning: {
      type: SlotsType
    },
    Afternoon: {
      type: SlotsType
    },
    Evening: {
      type: SlotsType
    }
  })
});
