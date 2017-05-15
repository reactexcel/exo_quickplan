import TripType from './types/Trip';
import TripMutation from './mutations/AddTrip';
import GetTripQuery from './queries/GetTrip';
import UpdateStartDate from './mutations/UpdateStartDate';
import UpdateTripPaxEdges from './mutations/UpdateTripPaxEdges';
import DeleteTripMutation from './mutations/DeleteTrip';
import CloneTripMutation from './mutations/CloneTrip';
import AddTourplanTripBooking from './mutations/AddTourplanTripBooking';
import CancelTourplanTripBooking from './mutations/CancelTourplanTripBooking';
import UpdateTrip from './mutations/UpdateTrip';

const tripType = TripType;
const exportedTripMutation = {
  addTrip: TripMutation,
  UpdateStartDate,
  UpdateTripPaxEdges,
  deleteTrip: DeleteTripMutation,
  cloneTrip: CloneTripMutation,
  addTourplanTripBooking: AddTourplanTripBooking,
  cancelTourplanTripBooking: CancelTourplanTripBooking,
  updateTrip: UpdateTrip
};
const exportedGetTripQuery = GetTripQuery;

export {
  tripType as TripType,
  exportedTripMutation as TripMutation,
  exportedGetTripQuery as GetTripQuery,
};
