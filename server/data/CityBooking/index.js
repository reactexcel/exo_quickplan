import CityBookingType from './types/CityBooking';
import CityBookingMutation from './mutations/CityBooking';
import UpdateServiceBookingsByCityKey from './mutations/UpdateServiceBookingsByCityKey';
import AddCityDayMutation from './mutations/AddCityDay';
import RemoveCityDayMutation from './mutations/RemoveCityDay';
import CityBookingQuery from './queries/CityBooking';
import AddTourplanCityBooking from './mutations/AddTourplanCityBooking';
import CancelTourplanCityBooking from './mutations/CancelTourplanCityBooking';
import UpdateCityServicesAvailability from './mutations/UpdateCityServicesAvailability';

const cityBookingType = CityBookingType;
const exportedCityBookingMutation = {
  addCityBooking: CityBookingMutation,
  updateServiceBookings: UpdateServiceBookingsByCityKey,
  addCityDay: AddCityDayMutation,
  removeCityDay: RemoveCityDayMutation,
  addTourplanCityBooking: AddTourplanCityBooking,
  cancelTourplanCityBooking: CancelTourplanCityBooking,
  updateCityServicesAvailability: UpdateCityServicesAvailability
};

export {
  cityBookingType as CityBookingType,
  exportedCityBookingMutation as CityBookingMutation,
  CityBookingQuery };
