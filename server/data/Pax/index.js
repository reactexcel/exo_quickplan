import PaxType from './types/Pax';
import GetPaxs from './queries/GetPaxs';
import AddPaxMutation from './mutations/AddPax';
import UpdatePaxMutation from './mutations/UpdatePax';
import DeletePaxMutation from './mutations/DeletePax';
import UpdateProposalMainPaxMutation from './mutations/UpdateProposalMainPax';

const exportedPaxMutation = {
  addPax: AddPaxMutation,
  updatePax: UpdatePaxMutation,
  deletePax: DeletePaxMutation,
  updateProposalMainPax: UpdateProposalMainPaxMutation
};

export { PaxType,
  GetPaxs as PaxsQuery, exportedPaxMutation as PaxMutation };
