import { GraphQLString } from 'graphql';
import { mutationWithClientMutationId } from 'graphql-relay';
import { changeNote } from './../controllers/CityDay';
import CityDay from '../types/CityDay';

export default mutationWithClientMutationId({
  name: 'ChangeNote',
  inputFields: {
    cityDayKey: { type: GraphQLString },
    note: { type: GraphQLString },
  },
  outputFields: {
    cityDay: {
      type: CityDay,
      resolve: cityDay => cityDay
    }
  },
  mutateAndGetPayload: input => changeNote(input)
});
