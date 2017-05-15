import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import moment from 'moment';
import PubSub from 'pubsub-js';
import Relay from 'react-relay';
import { browserHistory } from 'react-router';
import './TripHeader.scss';
import StartDateModal from './StartDateModal';
import PaxModal from './PaxModal';
import UpdateStartDateMutation from '../mutations/UpdateStartDate';
import UpdateTripPaxEdgesMutation from '../mutations/UpdateTripPaxEdges';
import TravellersSummary from './TravellersSummary';
import { getMainPax, groupPaxsByAgeGroup } from '../../Pax/utils';
import AddPaxModal from '../../Proposal/components/PaxModal';
import AddProposalPax from '../../Proposal/mutations/AddProposalPax';
import { STYLE_DATA_2, STYLE_DATA, STYLE_DATA_TITLE, STYLE_BUTTON_DATA } from '../../Proposal/Constants';

const TRIP_STATUS_ICONS = {
  Draft: <i className='mdi mdi-file-hidden small mr-10' />,
  Complete: <i className='mdi mdi-check small mr-10' />,
  Approved: <i className='mdi mdi-check-all small mr-10' />,
  Booked: <i className='mdi mdi-cash-usd small mr-10' />
};

export default class TripHeaderSlide extends Component {
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
      endDate: this.getEndDate(startDate, trip.durationDays)
    };

    this.proposalStartTravelOnDate = proposal.startTravelOnDate
      ? moment(new Date(proposal.startTravelOnDate)).format('MMMM DD, YYYY')
      : '';
  }

  componentDidMount() {
    $(ReactDOM.findDOMNode(this.refs.startTravelOnDate)).pickadate({
      selectMonths: true, // Creates a dropdown to control month
      selectYears: 15, // Creates a dropdown of 15 years to control year
    });
    // Datepicker onChange event handler
    $(ReactDOM.findDOMNode(this.refs.startTravelOnDate)).on('change', ({ target: { value } }) => this.changeStartDate(value));
    $(ReactDOM.findDOMNode(this.refs.startTravelOnDate)).pickadate('picker').on('close', param => this.closeStartDatePickerHandler(param));
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.viewer.trip.durationDays !== this.props.viewer.trip.durationDays) {
      this.setState({
        endDate: this.getEndDate(this.state.startDate, nextProps.viewer.trip.durationDays)
      });
    }
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

  openStartDatePicker = () => {
    $(ReactDOM.findDOMNode(this.refs.startTravelOnDate)).pickadate('picker').open();
  }

  changeStartDate = (newStartDate) => {
    this.startDate = newStartDate;
  };

  closeStartDatePickerHandler = (param) => {
    const newStartDate = this.startDate;
    if (!newStartDate) {
      return;
    }
    const { proposal, trip: { _key, durationDays } } = this.props.viewer;
    const startDate = moment(newStartDate, 'DD MMMM, YYYY');
    const endDate = this.getEndDate(startDate, durationDays);
    const successCallBack = () => this.setState({
      startDate,
      endDate
    });
    Relay.Store.commitUpdate(new UpdateStartDateMutation({
      _key,
      startDate,
      endDate
    }), {
      onSuccess: successCallBack,
      onFailure: response => console.log('update start date failed', response) // eslint-disable-line no-console
    });
  }

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

  showTripInfobox = () => {
    PubSub.publish('showTripInfobox', { });
  }

  render() {
    const { proposal, trip, locations } = this.props.viewer;
    const { tripPaxs, startDate, endDate } = this.state;
    const paxs = TripHeaderSlide.getPaxs(proposal.paxs, tripPaxs);
    const mainPax = getMainPax(proposal.paxs);
    const groupedPaxs = groupPaxsByAgeGroup(paxs, startDate);
    const totalPaxsNum = paxs.length;
    const travellerDetails = Object.keys(groupedPaxs)
      .map(groupName => `${groupedPaxs[groupName].length} ${groupName}`)
      .join(' + ');

    const travelAgent = `${proposal.TA.office.companyName} - ${proposal.TA.firstName} ${proposal.TA.lastName}`;
    const travelConsultant = `${proposal.TC.office.officeName} - ${proposal.TC.firstName} ${proposal.TC.lastName}`;

    return (<div className='pl-20'>
      <div className='row'>
        <div className='col s12 light-green-text fs-16 fw-700'>
          {TRIP_STATUS_ICONS[trip.status]}
          <span>{trip.status}</span>
        </div>
      </div>
      <div className='row'>
        <div className='col s5'>
          <span className={STYLE_DATA_TITLE}>Trip</span>
        </div>
        <div className='col s7 mt-8'>
          <span className='exo-colors-text text-base1 fs-16 fw-600' style={{ cursor: 'pointer' }} onClick={this.showTripInfobox}>{trip._key}</span>
        </div>
      </div>
      <div className='row'>
        <div className='col s3'><label htmlFor='Duration'>DURATION</label></div>
        <div className='col s6'>
          <div className={STYLE_DATA}>{trip.durationDays} Days</div>

          <div className={STYLE_DATA_2}>{startDate.format('MMMM, DD YYYY')} - {endDate.format('MMMM, DD YYYY')}</div>
          <input id='startTravelOnDate' ref='startTravelOnDate' defaultValue={startDate.format('DD MMMM, YYYY')} className='datepicker' id='input_startTravelOnDate' type='text' style={{ display: 'none' }} required />
        </div>
        <div className='col s3 left-align'>
          {
          this.props.viewOnly
            ? null
            : <a id='openStartDateModal' className='p-0' onClick={() => this.openStartDatePicker(trip)}>
              <i className='mdi-editor-mode-edit exo-colors-text pl-10 fs-20' />
            </a>
        }
        </div>
      </div>
      <div className='row'>
        <div className='col s3'><label htmlFor='Traveller'>TRAVELLER</label></div>
        <div className='col s6'>
          <div id='travellers' className={STYLE_DATA}>{`${totalPaxsNum} People`}</div>
          <div><div className={STYLE_DATA_2}>{travellerDetails}</div></div>
        </div>
        <div className='col s3 left-align'>
          <a onClick={this.openPaxModal} className='p-0'>
            {
              this.props.viewOnly
                ? ''
                : <i className='mdi-editor-mode-edit exo-colors-text pl-10 fs-20' />
            }
          </a>
        </div>
      </div>
      <div className='row'>
        <div className='col s3'><label htmlFor='Budget'>BUDGET</label></div>
        <div className='col s6'>
          <div id='Budget' className={STYLE_DATA}>{`$ ${trip.budget.total.actual}`}</div>
          <div className={STYLE_DATA_2}>{`Hotel $${trip.budget.hotels.actual}`}</div>
          <div className={STYLE_DATA_2}>{`Tour $${trip.budget.tours.actual}`}</div>
          <div className={STYLE_DATA_2}>{`Transfer $${trip.budget.transfers.actual}`}</div>
        </div>
      </div>
      <StartDateModal
        isOpened={this.state.isStartDateModalOpened}
        close={this.closeStartDateModal}
        startDate={this.state.startDate}
        endDate={this.state.endDate}
        duration={trip.durationDays}
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
        locations={locations}
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
