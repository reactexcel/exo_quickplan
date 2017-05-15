import React from 'react';
import Relay from 'react-relay';
import { browserHistory } from 'react-router';
import '../../../../node_modules/react-select/scss/default.scss';
import '../Proposal.scss';
import { Card } from '../../Utils/components';
import { STYLE_DATA, STYLE_DATA_2, STYLE_DATA_TITLE, STYLE_BUTTON_DATA } from '../Constants';

const PROPOSAL_STATUS_ICONS = {
  New: <i className='mdi mdi-map-marker-circle small mr-10' />,
  'In Progress': <i className='mdi-action-autorenew small mr-10' />,
  Confirmed: <i className='mdi-action-check-circle small mr-10' />,
  Lost: <i className='mdi-content-block small mr-10' />,
  'On Tour': <i className='mdi mdi-web small mr-10' />,
  Archived: <i className='mdi-content-archive small mr-10' />,
  Cloned: <i className='mdi-content-content-copy small mr-10' />,
};

export default class ProposalHeader extends React.Component {
  static propTypes = {
    proposal: React.PropTypes.object,
    closeProposalHeaderSideNav: React.PropTypes.func,
    isProposalKeyClick: React.PropTypes.bool
  }

  handleClickPropopsal() {
    const proposalKey = this.props.proposal._key;
    browserHistory.push(`/trip-planner/${proposalKey}`);
  }

  getMainPax() { // eslint-disable-line  consistent-return
    const { proposal } = this.props;
    if (proposal.mainPax && proposal.mainPax !== '') {
      return (proposal.mainPax);
    }

    for (let i = 0; i < proposal.paxs.length; i++) {
      if (proposal.paxs[i] && proposal.paxs[i].isMainPax) {
        return (`${proposal.paxs[i].firstName} ${proposal.paxs[i].lastName}`); // eslint-disable-line no-param-reassign
      }
    }
  }

  render() {
    const { proposal, closeProposalHeaderSideNav, isProposalKeyClick } = this.props;
    const mainPax = this.getMainPax();
    return (
      <div className='pl-20'>
        <div className='row'>
          <div className='col s9 light-green-text fs-16 fw-700'>
            {PROPOSAL_STATUS_ICONS[proposal.status]}
            <span>{proposal.status}</span>
          </div>
          <div className='col s3 grey-text text-lighten-1'>
            <i className='mdi mdi-chevron-double-left small mr-20' onClick={() => closeProposalHeaderSideNav()} />
          </div>
        </div>
        <div className='row pb-2'>
          <div className='col s12'>
            <label className='fs-12' htmlFor='createOnDate'>{proposal.createOnDate}</label>
          </div>
        </div>
        <div className='row mt-5'>
          <div className='col s5'>
            <span className={STYLE_DATA_TITLE}>Proposal</span>
          </div>
          <div className='col s7 mt-5'>
            { isProposalKeyClick ? <span className='exo-colors-text text-base1 fs-16 fw-600' style={{ color: '#7fc7b3', cursor: 'pointer' }} onClick={() => this.handleClickPropopsal()}>{proposal._key}</span>
            : <span className='exo-colors-text text-base1 fs-16 fw-600'>{proposal._key}</span> }
          </div>
        </div>
        <div className='row pt-10 pr-0'>
          <div className='col s3'>
            <label htmlFor='travelAgent'>REQUESTED BY</label>
          </div>
          <div className='col s9 valign-wrapper'>
            <i className='mdi mdi-account-circle mr-10' style={{ fontSize: '32px' }} />
            <div>
              <span className={STYLE_DATA}>{proposal.TA.office.companyName}</span><br />
              <span className={STYLE_DATA_2}>{`${proposal.TA.firstName} ${proposal.TA.lastName}`}</span>
            </div>
          </div>
        </div>
        <div className='row pt-10 pr-0'>
          <div className='col s3'>
            <label htmlFor='traveller'>TRAVELLER</label>
          </div>
          <div className='col s9'>
            <i className='mdi mdi-account-star mr-10' style={{ fontSize: '32px' }} />
            <span className={STYLE_DATA}>{mainPax}</span>
          </div>
        </div>
        <div className='row pt-10 pr-0'>
          <div className='col s3'>
            <label htmlFor='travelAgent'>EXO TRAVEL CONSULTANT (TC)</label>
          </div>
          <div className='col s9 valign-wrapper'>
            <i className='mdi mdi-account-box mr-10' style={{ fontSize: '32px' }} />
            <div>
              <span className={STYLE_DATA}>{proposal.TC.office.officeName}</span><br />
              <span className={STYLE_DATA_2}>{`${proposal.TC.firstName} ${proposal.TC.lastName}`}</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

}
