import CityDayType from './types/CityDay';
import UpdateToursByCityDayKey from './mutations/UpdateServiceBookingsByCityDayKey';
import TogglePreselection from './mutations/TogglePreselection';
import SelectServiceBookings from './mutations/SelectServiceBookings';
import AddMeal from './mutations/AddMeal';
import CityDayQuery from './queries/CityDay';
import ChangeNote from './mutations/ChangeNote';

const cityDayType = CityDayType;
const exportedCityDayMutation = {
  updateToursByCityDayKey: UpdateToursByCityDayKey,
  togglePreselection: TogglePreselection,
  selectServiceBookings: SelectServiceBookings,
  addMeal: AddMeal,
  ChangeNote
};

export { cityDayType as CityDayType, exportedCityDayMutation as CityDayMutation, CityDayQuery };
