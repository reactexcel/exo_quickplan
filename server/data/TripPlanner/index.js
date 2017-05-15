import TripTripPlannerType from './types/Trip';
import TripPlannerQuery from './queries/Trip';
import AddTripMutation from './mutations/AddTrip';
import AddCountryMutation from './mutations/AddCountry';
import RemoveCountryMutation from './mutations/RemoveCountry';
import AddCityMutation from './mutations/AddCity';
import RemoveCityMutation from './mutations/RemoveCity';
import UpdateCityMutation from './mutations/UpdateCity';
import UpdateDayMutation from './mutations/UpdateDay';
import RemoveDayMutation from './mutations/RemoveDay';
import UpdateServiceMutation from './mutations/UpdateService';

const exportedTripPlannerQuery = TripPlannerQuery;
const exportedTripPlannerType = { TripTripPlanner: TripTripPlannerType };
const exportedTripPlannerMutation = {
  addTripTripPlanner: AddTripMutation,
  addCountryTripPlanner: AddCountryMutation,
  removeCountryTripPlanner: RemoveCountryMutation,
  addCityTripPlanner: AddCityMutation,
  removeCityTripPlanner: RemoveCityMutation,
  updateCityTripPlanner: UpdateCityMutation,
  updateDayTripPlanner: UpdateDayMutation,
  removeDayTripPlanner: RemoveDayMutation,
  updateServiceTripPlanner: UpdateServiceMutation
};

export { exportedTripPlannerType as TripPlannerType, exportedTripPlannerQuery as TripPlannerQuery, exportedTripPlannerMutation as TripPlannerMutation };
