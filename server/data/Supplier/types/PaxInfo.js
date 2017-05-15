import { GraphQLObjectType } from 'graphql';

import AccommodationPax from './Pax';

export default new GraphQLObjectType({
  name: 'AccommodationPaxInfo',
  fields: () => ({
    infants: {
      type: AccommodationPax
    },
    children: {
      type: AccommodationPax
    },
    adults: {
      type: AccommodationPax
    }
  })
});
