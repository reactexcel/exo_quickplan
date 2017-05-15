import ProposalType from './types/Proposal';
import AddProposalMutation from './mutations/Proposal';
import UpdateProposalDetailsMutation from './mutations/UpdateProposalDetails';
import assignTC from './mutations/AssignTC';
import cloneProposal from './mutations/Clone';
import RemoveProposal from './mutations/Remove';

const proposalType = ProposalType;
const exportedProposalMutation = {
  addProposal: AddProposalMutation,
  cloneProposal,
  updateProposalDetails: UpdateProposalDetailsMutation,
  assignTC,
  RemoveProposal
};

export {
  proposalType as ProposalType,
  exportedProposalMutation as ProposalMutation
};
