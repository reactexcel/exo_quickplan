import { GraphQLID, GraphQLInt, GraphQLBoolean } from 'graphql';
import { mutationWithClientMutationId } from 'graphql-relay';
import * as citydayCtrl from './../controllers/CityDay';
import AccessibleTourType from './../../Tour/types/AccessibleTour';


const props = {
  cityDayKey: {
    type: GraphQLID,
    description: 'The key of the city day object to preselect.'
  },
  tourKey: {
    type: GraphQLID,
    description: 'The key of the tour object to preselect.'
  },
  isPreselected: {
    type: GraphQLBoolean,
    description: 'Preselected state. Toggles the preselection.'
  },
  startSlot: {
    type: GraphQLInt,
    description: 'Start slot of preselection.'
  }
};

export default mutationWithClientMutationId({
  name: 'TogglePreselectedStateTourToCityDay',
  description: 'Toggle preselected state on tour to city day.',
  inputFields: {
    ...props
  },
  outputFields: {
    tour: {
      type: AccessibleTourType,
      resolve: saveDoc => saveDoc
    }
  },
  mutateAndGetPayload: async (inputFields) => {
    const saveDoc = await citydayCtrl.togglePreselection(inputFields);
    return saveDoc;
  }
});

