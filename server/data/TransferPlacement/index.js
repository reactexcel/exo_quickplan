import TransferPlacementType from './types/TransferPlacement';
import TransferPlacementMutation from './mutations/TransferPlacement';
import ClearTransferPlacementMutation from './mutations/ClearTransferPlacement';
import TransferPlacementQuery from './queries/TransferPlacement';
import GetAccessibleTransfersQuery from './queries/AccessibleTransfers';
import AddServiceBookingMutation from './mutations/AddServiceBooking';
import RemoveServiceBookingMutation from './mutations/RemoveServiceBooking';
import UpdateTransferPlacement from './mutations/UpdateTransferPlacement';
import RemoveLocalTransfer from './mutations/RemoveLocalTransfer';

const proposalType = TransferPlacementType;
const exportedTransferPlacementMutation = {
  addTransferPlacement: TransferPlacementMutation,
  addServiceBooking: AddServiceBookingMutation,
  removeServiceBooking: RemoveServiceBookingMutation,
  updateTransferPlacement: UpdateTransferPlacement,
  clearTransferPlacement: ClearTransferPlacementMutation,
  removeLocalTransfer: RemoveLocalTransfer
};

export {
  proposalType as TransferPlacementType,
  exportedTransferPlacementMutation as TransferPlacementMutation,
  TransferPlacementQuery,
  GetAccessibleTransfersQuery
};
