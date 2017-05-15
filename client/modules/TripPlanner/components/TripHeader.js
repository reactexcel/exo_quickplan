import React, { Component, PropTypes } from 'react';
import moment from 'moment';
import Relay from 'react-relay';
import { browserHistory } from 'react-router';
import './TripHeader.scss';
import StartDateModal from './StartDateModal';
import PaxModal from './PaxModal';
import UpdateStartDateMutation from '../mutations/UpdateStartDate';
import UpdateTripPaxEdgesMutation from '../mutations/UpdateTripPaxEdges';
import TravellersSummary from './TravellersSummary';
import { getMainPax } from '../../Pax/utils';
import AddPaxModal from '../../Proposal/components/PaxModal';
import AddProposalPax from '../../Proposal/mutations/AddProposalPax';

export default class TripHeader extends Component {
  static propTypes = {
    viewOnly: PropTypes.bool
  };


  static defaultProps = {
    viewOnly: false
  };


  static getPaxs(proposalPaxs, tripPaxs) {
    return proposalPaxs.map(proposalPax => Object.assign({}, proposalPax, {
      isTripPax: (
        proposalPax.isMainPax ||
        tripPaxs.length === 0 ||
        Boolean(tripPaxs.find(tripPax => tripPax._key === proposalPax._key))
      )
    }));
  }


  constructor(props) {
    super(props);

    const { proposal, trip } = props.viewer;
    const { paxs: tripPaxs } = trip;
    const startDate = this.getTripStartDate({ proposal, trip });

    this.state = {
      isStartDateModalOpened: false,
      isPaxModalOpened: false,
      isAddPaxModalOpened: false,
      startDate,
      tripPaxs,
      endDate: this.getEndDate(startDate, proposal.travelDuration)
    };

    this.proposalStartTravelOnDate = proposal.startTravelOnDate
      ? moment(new Date(proposal.startTravelOnDate)).format('MMMM DD, YYYY')
      : '';
  }

  getTripStartDate = ({ proposal, trip }) => {
    if (trip.startDate) {
      return moment(new Date(trip.startDate));
    }

    if (proposal.startTravelOnDate) {
      return moment(new Date(proposal.startTravelOnDate));
    }

    return moment();
  };


  getEndDate = (startDate, duration) => moment(startDate).add(duration, 'days');


  getProposalStatus = ({ status }) => {
    const defaultStatusInfo = {
      text: 'In Progress',
      className: 'mdi-action-autorenew'
    };

    const statusInfo = {
      new: {
        text: 'NEW',
        className: 'mdi mdi-map-marker-circle'
      },
      inprogress: defaultStatusInfo,
      confirmed: {
        text: 'Confirmed',
        className: 'mdi mdi-check-circle-outline'
      },
      lost: {
        text: 'Lost',
        className: 'mdi mdi-block-helper'
      },
      ontour: {
        text: 'On Tour',
        className: 'mdi mdi-web'
      },
      archived: {
        text: 'Archived',
        className: 'mdi mdi-archive'
      }
    };

    const { text, className } = statusInfo[status] || defaultStatusInfo;

    return (<div className='col m9  right-align'>
      <i className={`${className} small pr-5`} />
      <span className='fs-16'>{ text }</span>
    </div>);
  };

  shouldOpenStartModal = trip => trip.status !== 'booked' && !this.props.viewOnly;


  openStartDateModal = trip => this.shouldOpenStartModal(trip) && this.setState({
    isStartDateModalOpened: true
  });


  openPaxModal = () => !this.props.viewOnly && this.setState({
    isPaxModalOpened: true
  });


  closeStartDateModal = () => this.setState({
    isStartDateModalOpened: false
  });


  closePaxModal = () => this.setState({
    isPaxModalOpened: false
  });


  changeAddPaxModalState = () =>
    this.setState(({ isAddPaxModalOpened }) => ({
      isAddPaxModalOpened: !isAddPaxModalOpened
    }));


  updateTripPaxs = (tripPaxKeys) => {
    const {
      trip: { _key: tripKey },
    } = this.props.viewer;

    Relay.Store.commitUpdate(new UpdateTripPaxEdgesMutation({
      tripKey,
      tripPaxKeys,
    }), {
      onSuccess: ({ UpdateTripPaxEdges: { tripPaxs } }) => this.setState({ tripPaxs })
    });
  };

  changeStartDate = newStartDate => this.setState((prevState, props) => {
    const { proposal, trip: { _key } } = props.viewer;
    const startDate = moment(newStartDate, 'MMMM, DD YYYY');
    const endDate = this.getEndDate(startDate, proposal.travelDuration);

    Relay.Store.commitUpdate(new UpdateStartDateMutation({
      _key,
      startDate,
      endDate
    }));

    return {
      startDate,
      endDate
    };
  });


  addProposalPax = (pax) => {
    const { proposal: { _key: proposalKey } } = this.props.viewer;
    const { relay } = this.props;

    Relay.Store.commitUpdate(new AddProposalPax({
      ...pax,
      proposalKey
    }), {
      onSuccess: () => {
        relay.forceFetch();
      },
      onFailure: response => console.log('pax add failed', response) // eslint-disable-line no-console
    });
  };

  handleClickPropopsal() {
    const proposalKey = this.props.viewer.proposal._key;
    browserHistory.push(`/trip-planner/${proposalKey}`);
  }

  render() {
    const { proposal, trip } = this.props.viewer;
    const { tripPaxs } = this.state;

    const paxs = TripHeader.getPaxs(proposal.paxs, tripPaxs);
    const mainPax = getMainPax(proposal.paxs);

    const travelAgent = `${proposal.TA.office.companyName} - ${proposal.TA.firstName} ${proposal.TA.lastName}`;
    const travelConsultant = `${proposal.TC.office.officeName} - ${proposal.TC.firstName} ${proposal.TC.lastName}`;

    return (<div className='exo-colors modal-bgr2 trip exo-colors-text text-data-1 pl-10 pt-10'>
      <div className='row '>
        <div className='row valign-wrapper'>
          <div className='col w-120'><span className=' fs-24'>Proposal</span></div>
          <div className='col m3 '><span className='fs-16 exo-colors-text' onClick={() => this.handleClickPropopsal()}>{proposal._key}
            - {this.proposalStartTravelOnDate} </span></div>
          {this.getProposalStatus(proposal)}
        </div>
        <div className='row valign-wrapper'>
          <div className='col w-120' />
          <div className='col m12'>
            <div className='row proposal-border'>
              <div className='col m5 '>
                <span className='fs-14 exo-colors-text text-label-1 '>Travel agent(TA)</span>
                <div className='valign-wrapper'>
                  <i className='mdi-action-account-circle small exo-colors-text text-label-1' />
                  <span className='fs-16 ml-4'>{travelAgent}</span>
                </div>
              </div>
              <div className='col m3 '>
                <span className='fs-14 exo-colors-text text-label-1 '>Lead Traveller</span>
                <div className='valign-wrapper pt-8'>
                  <i className='mdi mdi-account-star small black-text' />
                  <span className='fs-16 ml-4'>{mainPax.firstName} {mainPax.lastName}</span>
                </div>
              </div>
              <div className='col m4 '>
                <span className='fs-14 exo-colors-text text-label-1 '>Lead Travel Consultant ( TC )</span>
                <div className='valign-wrapper'>
                  <i className='mdi-action-account-box small exo-colors-text text-label-1' />
                  <span className='fs-16 ml-4'>{travelConsultant}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className='row '>
        <div className='row valign-wrapper'>
          <div className='col w-120'><span className=' fs-24'>Trip</span></div>
          <div className='col m6 valign-wrapper'>
            <span className='fs-16'>{trip._key} - {this.state.startDate.format('MMMM, DD YYYY')}
              - {this.state.endDate.format('MMMM, DD YYYY')}</span>
            {
              this.props.viewOnly
                ? ''
                : <a id='openStartDateModal' onClick={() => this.openStartDateModal(trip)}>
                  <i className='mdi-editor-mode-edit exo-colors-text pl-10 fs-20' />
                </a>
            }

          </div>
          <div className='col offset-m5 m1 valign-wrapper black-text'>
            <i className='mdi mdi-file-hidden small pr-5 ' />
            <span className='fs-16'>{trip.status}</span>
          </div>
        </div>
        <div className='row valign-wrapper'>
          <div className='col w-120' />
          <div className='col m12'>
            <div className='row'>
              <div className='col m2 '>
                <a onClick={this.openPaxModal} tabIndex={0}>
                  <span className='fs-14 exo-colors-text text-label-1 '>Travellers</span>
                  {
                    this.props.viewOnly
                      ? ''
                      : <i className='mdi-editor-mode-edit exo-colors-text pl-10 fs-20' />
                  }
                </a>
                <div>
                  <TravellersSummary proposalPaxs={proposal.paxs} tripPaxs={tripPaxs} />
                </div>
              </div>
              <div className='col m2 '>
                <span className='fs-14 exo-colors-text text-label-1 '>Duration</span>
                <div >
                  <b><span className='fs-16 '>{proposal.travelDuration} Days</span></b>
                </div>
              </div>
              <div className='col m2 right-align'>
                <span className='fs-14 exo-colors-text text-label-1 '>Hotels</span>
                <div>
                  <b><span className='fs-16 '>US$ 1,210</span></b>
                </div>
              </div>
              <div className='col m2 right-align'>
                <span className='fs-14 exo-colors-text text-label-1 '>Tours</span>
                <div >
                  <b><span className='fs-16 '>US$ 200.00</span></b>
                </div>
              </div>
              <div className='col m2 right-align'>
                <span className='fs-14 exo-colors-text text-label-1 '>Transfers</span>
                <div >
                  <b><span className='fs-16 '>US$ 525.00</span></b>
                </div>
              </div>
              <div className='col m2 right-align'>
                <span className='fs-14 exo-colors-text text-label-1 '>Total</span>
                <div>
                  <b><span className='fs-16 '>US$ 1,935.00</span></b>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <StartDateModal
        isOpened={this.state.isStartDateModalOpened}
        close={this.closeStartDateModal}
        startDate={this.state.startDate}
        endDate={this.state.endDate}
        duration={proposal.travelDuration}
        changeStartDate={this.changeStartDate}
        getEndDate={this.getEndDate}
      />
      <PaxModal
        isOpened={this.state.isPaxModalOpened}
        close={this.closePaxModal}
        paxs={paxs}
        tripPaxs={tripPaxs}
        onSave={this.updateTripPaxs}
        openAddPaxModal={this.changeAddPaxModalState}
      />

      <AddPaxModal
        pax={{
          _key: null,
          firstName: '',
          lastName: '',
          ageOnArrival: '',
          passportNr: '',
          diet: [],
          allergies: []
        }}
        isModalOpened={this.state.isAddPaxModalOpened}
        changeModalState={() => this.setState({
          isAddPaxModalOpened: false
        })}
        handlePaxSave={this.addProposalPax}
      />
    </div>);
  }
}
