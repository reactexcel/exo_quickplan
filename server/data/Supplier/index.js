import exportedAccessibleSupplierQuery from './queries/AccessibleSuppliers';
import exportedCheckSupplierPaxStatus from './queries/CheckSupplierPaxStatus';
import AccommodationPlacementQuery from './queries/AccommodationPlacement';
import exportedAccessibleSupplierType from './types/AccessibleSupplier';
import UpdateAccommodationPlacementMutation from './mutations/UpdateAccommodationPlacement';
import AddRoomConfigMutation from './mutations/AddRoomConfig';
import RemoveRoomConfigMutation from './mutations/RemoveRoomConfig';
import UpdateRoomConfigMutation from './mutations/UpdateRoomConfig';

const exportedSupplierMutation = {
  updateAccommodationPlacement: UpdateAccommodationPlacementMutation,
  addRoomConfig: AddRoomConfigMutation,
  removeRoomConfig: RemoveRoomConfigMutation,
  updateRoomConfig: UpdateRoomConfigMutation
};
export {
  AccommodationPlacementQuery,
  exportedAccessibleSupplierQuery as AccessibleSupplierQuery,
  exportedCheckSupplierPaxStatus as CheckSupplierPaxStatusQuery,
  exportedAccessibleSupplierType as AccessibleSupplierType,
  exportedSupplierMutation as SupplierMutation
};
