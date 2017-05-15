import React from 'react';
import Relay from 'react-relay';
// import Select from 'react-select';
// import ReactDOM from 'react-dom';
import { browserHistory } from 'react-router';
import '../../../../node_modules/react-select/scss/default.scss';
import '../Proposal.scss';
import ProposalDetailModal from './ProposalDetailModal';
import MarkAsLostModal from './MarkAsLostModal';
import { Card } from '../../Utils/components';
import UpdateProposalDetails from '../mutations/UpdateProposalDetails';
import CloneProposalMutation from '../mutations/CloneProposal';
import PaxsCard from './PaxsCard';
import TripsCard from './TripsCard';
import ProposalHeader from './ProposalHeader';
import SideNav from './SideNav';
import { STYLE_DATA, STYLE_DATA_BOLD, STYLE_DATA_TITLE, STYLE_TITLE, STYLE_BUTTON_DATA } from '../Constants';
import { getUserRole } from '../../../services/user';

const DATE_OPTIONS = { year: 'numeric', month: 'long', day: 'numeric' };


export default class Proposal extends React.Component {
  static propTypes = {
    viewer: React.PropTypes.object.isRequired,
    relay: React.PropTypes.object
  }

  state = {
    isDetailModalOpened: false,
    isMarkAsLostModalOpened: false,
    userRole: getUserRole(),
    isSideNavOpen: true
  }

  componentDidMount() {
    this.props.relay.forceFetch();
  }

  handleProposalDetailSave = ({
    proposal,
    selectedOffice,
    selectedTC,
    selectedLocation,
    selectedTAOffice,
    selectedTA
  }) => {
    if (selectedTC && selectedTC !== 'Unassigned' && proposal.status === 'New') {
      proposal.status = 'In Progress'; // eslint-disable-line no-param-reassign
    }
    const relay = this.props.relay;
    Relay.Store.commitUpdate(new UpdateProposalDetails({
      proposal,
      selectedOffice,
      selectedTC,
      selectedLocation,
      selectedTAOffice,
      selectedTA
    }), {
      onSuccess: () => relay.forceFetch(),
      onFailure: response => console.log('proposal details update failed', response) // eslint-disable-line no-console
    });
  };

  handleMarkProposalAsLost = (notes) => {
    const proposal = this.props.viewer.proposal;
    const relay = this.props.relay;
    Relay.Store.commitUpdate(new UpdateProposalDetails({
      proposal: {
        ...proposal,
        status: 'Lost'
      },
      notes
    }), {
      onSuccess: () => relay.forceFetch(),
      onFailure: response => console.log('proposal mark as lost failed', response) // eslint-disable-line no-console
    });
  }

  handleProposalClone = () => {
    const { auth } = this.props;
    const proposalKey = this.props.viewer.proposal._key;
    const onCloneSuccess = function onSuccess({ cloneProposal: { proposal: { _key } } }) {
      browserHistory.push(`/trip-planner/${_key}`);
    };
    Relay.Store.commitUpdate(new CloneProposalMutation({
      proposalKey,
      userToken: auth.getAccessToken()
    }), {
      onSuccess: onCloneSuccess,
      onFailure: response => console.log('proposal details clone failed', response) // eslint-disable-line no-console
    });
  }

  markAsInProgressStatus = () => {
    const proposal = this.props.viewer.proposal;
    const relay = this.props.relay;
    Relay.Store.commitUpdate(new UpdateProposalDetails({
      proposal: {
        ...proposal,
        status: 'In Progress'
      },
    }), {
      onSuccess: () => relay.forceFetch(),
      onFailure: response => console.log('proposal mark as in progress failed', response) // eslint-disable-line no-console
    });
  }

  setProposalPrivate(isPrivate) {
    const proposal = this.props.viewer.proposal;
    const relay = this.props.relay;
    Relay.Store.commitUpdate(new UpdateProposalDetails({
      proposal: {
        ...proposal,
        private: isPrivate
      }
    }), {
      onSuccess: () => relay.forceFetch(),
      onFailure: response => console.log('set private failed', response) // eslint-disable-line no-console
    });
  }

  changeDetailModalState = (isOpen) => {
    this.setState({ isDetailModalOpened: isOpen });
  }

  changeMarkAsLostModalState = (isOpen) => {
    this.setState({ isMarkAsLostModalOpened: isOpen });
  }

  initProposalData(proposal) {
    // init the main pax
    for (let i = 0; i < proposal.paxs.length; i++) {
      if (proposal.paxs[i].isMainPax) {
        proposal.mainPAX = `${proposal.paxs[i].firstName} ${proposal.paxs[i].lastName}`; // eslint-disable-line no-param-reassign
      }
    }

    // init createOnDate, status and multi-select fields
    proposal.createOnDate = proposal.createOnDate || new Date().toLocaleDateString('en-US', DATE_OPTIONS); // eslint-disable-line no-param-reassign
    proposal.status = proposal.status || 'New'; // eslint-disable-line no-param-reassign
    proposal.style = proposal.style || []; // eslint-disable-line no-param-reassign
    proposal.class = proposal.class || []; // eslint-disable-line no-param-reassign
    proposal.private = proposal.private || false; // eslint-disable-line no-param-reassign
  }

  renderRate(rate) {
    if (rate < 2 || rate > 6) {
      return null;
    }
    const nodes = [];
    for (let idx = 1; idx <= rate; idx++) {
      nodes.push(<i key={idx} className='mdi-action-grade' style={{ fontSize: '.9em' }} />);
    }
    return <div key={rate} className='chip mt-5 mr-5 fs-16 fw-700'>{nodes}</div>;
  }

  renderProposalDetails() {
    const { proposal } = this.props.viewer;
    const rates = proposal.class.map(i => this.renderRate(i));
    const isTaView = this.state.userRole === 'TA' && !proposal.TA.created;
    const title = isTaView ? <span className={STYLE_TITLE} style={{ float: 'left' }}>Details</span> : (
      <div className='row m-0 pt-6'>
        <div className={`col s3 left-align ${STYLE_TITLE}`} >Details</div>
        <div className='col s9 right-align'>
          { proposal.status === 'New' || proposal.status === 'In Progress' ?
            <a className='pr-20' onClick={this.changeMarkAsLostModalState.bind(this, true)}>
              <i className='mdi-content-block small mr-5 fw-700' />
              <span className={STYLE_BUTTON_DATA}>MARK AS LOST</span>
            </a>
        :
            <a className='pr-20' onClick={this.markAsInProgressStatus.bind(this)}>
              <i className='mdi-action-autorenew small mr-5 fw-700' />
              <span className={STYLE_BUTTON_DATA}>MARK AS IN PROGRESS</span>
            </a>
        }
          <a className='pr-20' onClick={() => this.handleProposalClone()}>
            <i className='mdi-content-content-copy small mr-5 fw-700' />
            <span className={STYLE_BUTTON_DATA}>CLONE</span>
          </a>
          <a className='pr-10' onClick={this.changeDetailModalState.bind(this, true)}>
            <i className='mdi-editor-mode-edit small mr-5 fw-700' />
            <span className={STYLE_BUTTON_DATA}>EDIT</span>
          </a>
        </div>
      </div>);
    return (
      <Card title={title} titleClassName='exo-colors modal-bgr1' titleBackColor='white' showMinimize={false} doFullCardTitleExpand details>
        <div className='row pt-0'>
          <div className='col s12'>
            <span className={STYLE_DATA_TITLE}>Travel plan</span>
          </div>
        </div>
        <div className='row'>
          <div className='col s3'>
            <label htmlFor='startTravelInCity'>Would like to start in</label>
            <div id='startTravelInCity'><span className={STYLE_DATA_BOLD}>{proposal.startTravelIn.name}</span></div>
          </div>
          <div className='col s3'>
            <label htmlFor='startTravelOnDate'>On</label>
            <div id='startTravelOnDate'><span className={STYLE_DATA_BOLD}>{proposal.startTravelOnDate}&nbsp; </span></div>
          </div>
          <div className='col s3'>
            <label htmlFor='travelDuration'>For</label>
            <div id='travelDuration'><span className={STYLE_DATA_BOLD}>{proposal.travelDuration}&nbsp; days</span></div>
          </div>
        </div>
        <div className='row'>
          <div className='col s6'>
            <label htmlFor='Class'>Class</label>
            <div id='Class'>{rates}</div>
          </div>
          <div className='col s6'>
            <label htmlFor='Style'>Style</label>
            <div id='Style'>{proposal.style.map(style => <div key={style} className='chip mt-5 mr-5 fs-16 fw-700'><span>{style}</span></div>)}</div>
          </div>
        </div>
        <div className='row'>
          <div className='col s12 m12 l12'>
            <span className={STYLE_DATA_TITLE}>Description</span>
          </div>
        </div>
        <div className='row'>
          <div className='col s12 m12 l12'>
            <label htmlFor='Names'>Title</label>
            <div id='Names'><span className={STYLE_DATA}>{proposal.name}</span></div>
            <label htmlFor='Notes'>Notes</label>
            <div><span id='Notes' className={STYLE_DATA}>{proposal.notes}</span></div>
          </div>
        </div>
        <div className='row right-align pb-15'>
          <div className='col s3 m3 l3 left-align'>
            <input type='checkbox' id='private' checked={proposal.private} onChange={({ target: { checked } }) => this.setProposalPrivate(checked)} />
            <label htmlFor='private' className={STYLE_BUTTON_DATA}>PRIVATE</label>
          </div>
        </div>
      </Card>
    );
  }

  render() {
    const { proposal, offices, taOffices, locations } = this.props.viewer;
    const { isSideNavOpen } = this.state;
    this.initProposalData(proposal);
    const slideWidth = isSideNavOpen ? '300px' : '70px';
    const proposalTitle = (<div>
      <span className={STYLE_DATA_TITLE}>Proposal</span>
      <span className={`${STYLE_DATA} ml-20 mt-20`}>{proposal._key}</span>
    </div>);
    return (
      <div style={{ margin: '20px 3%' }}>
        <SideNav
          width={slideWidth}
          changeSideNavState={isOpened => this.setState({ isSideNavOpen: isOpened })}
          isSideNavOpen={this.state.isSideNavOpen}
          titleInCloseState={proposalTitle}
        >
          <ProposalHeader proposal={proposal} closeProposalHeaderSideNav={() => this.setState({ isSideNavOpen: false })} />
        </SideNav>
        <div className='modal-content flow-text' style={{ marginLeft: slideWidth }}>
          {this.renderProposalDetails()}
          <PaxsCard {...this.props} />
          <TripsCard {...this.props} />
        </div>
        <div className='modal-footer' />
        {
          this.state.isDetailModalOpened ?
            <ProposalDetailModal
              proposal={proposal}
              isModalOpened={this.state.isDetailModalOpened}
              changeModalState={this.changeDetailModalState}
              handleProposalDetailSave={this.handleProposalDetailSave}
              offices={offices}
              taOffices={taOffices}
              locations={locations}
            />
            : null
        }
        {
          this.state.isMarkAsLostModalOpened ?
            <MarkAsLostModal
              notes={proposal.notes}
              isModalOpened={this.state.isMarkAsLostModalOpened}
              changeModalState={this.changeMarkAsLostModalState}
              handleMarkProposalAsLost={this.handleMarkProposalAsLost}
            />
            : null
        }
      </div>
    );
  }
}
