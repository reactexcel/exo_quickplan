import CountryBookingType from './types/CountryBooking';
import CountryBookingMutation from './mutations/AddCountryBooking';
import GetServicesByCountryBookingKeyQuery from './queries/GetServicesByCountryBookingKey';
import AddTourplanCountryBooking from './mutations/AddTourplanCountryBooking';
import CancelTourplanCountryBooking from './mutations/CancelTourplanCountryBooking';
import UpdateCountryServicesAvailability from './mutations/UpdateCountryServicesAvailability';

const countryBookingType = CountryBookingType;
const exportedCountryBookingMutation = {
  addCountryBooking: CountryBookingMutation,
  addTourplanCountryBooking: AddTourplanCountryBooking,
  cancelTourplanCountryBooking: CancelTourplanCountryBooking,
  updateCountryServicesAvailability: UpdateCountryServicesAvailability
};
const exportedGetServicesByCountryBookingKeyQuery = GetServicesByCountryBookingKeyQuery;

export {
  countryBookingType as CountryBookingType,
  exportedCountryBookingMutation as CountryBookingMutation,
  exportedGetServicesByCountryBookingKeyQuery as GetServicesByCountryBookingKeyQuery };
