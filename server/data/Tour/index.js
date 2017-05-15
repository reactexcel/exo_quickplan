import TourType from './types/Tour';
import AccessibleTourQuery from './queries/AccessibleTours';
import UpdateTourPaxs from './mutations/UpdateTourPaxs';

const exportedAccessibleTourQuery = AccessibleTourQuery;
const exportedTourType = TourType;

const exportedTourMutation = {
  updateTourPaxs: UpdateTourPaxs
};
export {
  exportedAccessibleTourQuery as AccessibleTourQuery,
  exportedTourType as TourType,
  exportedTourMutation as TourMutation
};
