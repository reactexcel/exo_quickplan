import { GraphQLID, GraphQLList, GraphQLString, GraphQLInputObjectType, GraphQLInt } from 'graphql';
import { mutationWithClientMutationId } from 'graphql-relay';
import CityDayType from './../types/CityDay';
import * as citydayCtrl from './../controllers/CityDay';
import Placeholder from '../types/PlaceholderInput';


const TourUpdateObject = new GraphQLInputObjectType({
  name: 'TourUpdateObject',
  description: 'The objects sent to update tours',
  fields: () => ({
    tourKey: {
      type: GraphQLString
    },
    startSlot: {
      type: GraphQLInt
    },
  })
});
const props = {
  cityDayKey: {
    type: GraphQLID,
    description: 'The key of the city day object to update tours on.'
  },
  tourKeys: {
    type: new GraphQLList(TourUpdateObject),
    description: 'An array of objects {tourKey: tourKey(string), startSlot: startSlot(integer)} for the tours to update.'
  },
  placeholders: {
    type: new GraphQLList(Placeholder)
  }
};

export default mutationWithClientMutationId({
  name: 'UpdateToursOfCityDay',
  description: 'Update tours on a city day object.',
  inputFields: {
    ...props
  },
  outputFields: {
    cityDays: {
      type: CityDayType,
      resolve: saveDoc => saveDoc
    }
  },
  mutateAndGetPayload: async (inputFields) => {
    const saveDoc = await citydayCtrl.updateServicesByCityDayKey(inputFields);
    return saveDoc;
  }
});
