import TripType from './../types/Trip';
import * as tripCtrl from './../controllers/Trip';

export default {
  trips: {
    type: TripType,
    resolve: async () => {
      const trip = await tripCtrl.getTrips();
      return trip[0];
    }
  }
};
