import ServiceBookingType from './types/ServiceBooking';
import ServiceBookingInputType from './types/ServiceBookingInput';
// import ServiceBookingMutation from './mutations/ServiceBooking';
import TourplanBookingType from './types/TourplanBookingType';
import TourplanAddBookingMutation from './mutations/AddTourplanBooking';
import TourplanAddBookingsMutation from './mutations/AddTourplanBookings';
import TourplanCancelBookingMutation from './mutations/CancelTourplanBooking';
import TourplanCancelBookingsMutation from './mutations/CancelTourplanBookings';
import RemoveServiceBookingType from './types/ServiceBookingStatus';
import RemoveServiceBookingMutation from './mutations/RemoveServiceBooking';
import UpdateServiceBookingMutation from './mutations/UpdateServiceBooking';
import UpdateServiceAvailability from './mutations/UpdateServiceAvailability';
import UpdateServicesAvailability from './mutations/UpdateServicesAvailability';
import ChangeServiceDaySlotMutation from './mutations/ChangeServiceDaySlot';
import ServiceBookingController from './queries/CheckServiceBookingPaxStatus';
import ServiceBooking from './queries/ServiceBooking';
import CheckServicesAvailabilityQuery from './queries/CheckServicesAvailability';
import ConfirmServiceAvailabilityMutation from './mutations/ConfirmServiceAvailability';

const serviceBookingType = ServiceBookingType;
const serviceBookingInputType = ServiceBookingInputType;
const tourplanBookingType = TourplanBookingType;
const removeServiceBookingType = RemoveServiceBookingType;
const exportedServiceBookingMutation = {
  addTourplanBooking: TourplanAddBookingMutation, // TODO: Remove and use batch version instead
  cancelTourplanBooking: TourplanCancelBookingMutation, // TODO: Remove and use batch version instead
  addTourplanBookings: TourplanAddBookingsMutation,
  cancelTourplanBookings: TourplanCancelBookingsMutation,
  removeServiceBooking: RemoveServiceBookingMutation,
  updateServiceBooking: UpdateServiceBookingMutation,
  updateServiceAvailability: UpdateServiceAvailability,
  updateServicesAvailability: UpdateServicesAvailability,
  changeServiceDaySlot: ChangeServiceDaySlotMutation,
  confirmServiceAvailability: ConfirmServiceAvailabilityMutation
};
const exportedCheckServicesAvailabilityQuery = CheckServicesAvailabilityQuery;

export {
  serviceBookingType as ServiceBookingType,
  serviceBookingInputType as ServiceBookingInputType,
  exportedServiceBookingMutation as ServiceBookingMutation,
  tourplanBookingType as TourplanBookingType,
  removeServiceBookingType as RemoveServiceBookingType,
  ServiceBookingController as ServiceBookingControllerQuery,
  ServiceBooking,
  exportedCheckServicesAvailabilityQuery as CheckServicesAvailabilityQuery
};
