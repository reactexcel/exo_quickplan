import React, { PropTypes, Component } from 'react';
import { PT } from 'proptypes-parser';
import Relay from 'react-relay';
import AssignTCMutation from '../../Proposal/mutations/AssignTC';
import Header from './WorkqueueTableHeader';
import Row from './WorkqueueTableRow';
import AssignProposalModal from './AssignProposalModal';
import '../Workqueue.scss';

export default class WorkqueueTable extends Component {
  static propTypes = {
    ...PT`{
      user: {
        userKey: String!
        supervisingTCs: [{
          _key: String!
          firstName: String!
          lastName: String!
        }]!
      }!
      proposals: [{
        _key: String!
       startTravelIn: {
          _key: String
          name: String
        }!
        startTravelOnDate: String!
        travelDuration: Number!
        private: Boolean!
        updatedOn: String!
        status: String!
        mainPax: {
          firstName: String!
          lastName: String!
        }
        tripsCount: Number!
        TA: {
          firstName: String!
          lastName: String!
        }
        TC: {
          firstName: String!
          lastName: String!
          office: {
            officeName: String!
          }
        }!
        bookedTrip: {
          combinerCountryBooking: {
            tpBookingRef: String!
          }!
        }
      }!]!
      offices: [{
         _key: String!
         companyName: String
         officeName: String
      }]
      locations: [{
        _key: String!
        name: String!
      }]
    }`,
    sortBy: PropTypes.func.isRequired,
    changeProposalTC: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);

    this.state = {
      isAssignProposalModalOpened: false,
      proposalKey: '',
      isEditProposalModalOpened: false
    };
  }


  closeAssignProposalModal() {
    this.setState({
      isAssignProposalModalOpened: false
    });
  }


  openAssignProposalModal = proposalKey => this.setState({
    isAssignProposalModalOpened: true,
    proposalKey
  });


  selectTCForAssignment = (userKey) => {
    const { proposalKey } = this.state;
    const { changeProposalTC } = this.props;

    Relay.Store.commitUpdate(new AssignTCMutation({
      proposalKey,
      userKey,
    }));

    changeProposalTC({
      proposalKey,
      userKey,
    });
  };


  render() {
    const {
      user,
      proposals,
      auth,
      cloneProposal,
      removeProposal
    } = this.props;

    const rows = proposals.map(proposal => (<Row
      {...proposal}
      key={`row${proposal._key}`}
      openAssignProposalModal={this.openAssignProposalModal}
      userRole={user.role}
      auth={auth}
      cloneProposal={cloneProposal}
      removeProposal={removeProposal}
      openEditProposalModal={() => this.setState({
        isEditProposalModalOpened: true,
        proposalKey: proposal._key
      })}
    />));

    const {
      isAssignProposalModalOpened
    } = this.state;

    return (<div>
      <table className='bordered work-queue-table'>
        <Header
          {...this.props}
        />
        <tbody>
          {rows}
        </tbody>

      </table>
      <AssignProposalModal
        isOpened={isAssignProposalModalOpened}
        close={() => this.closeAssignProposalModal()}
        user={user}
        selectTC={this.selectTCForAssignment}
      />
    </div>);
  }
}
