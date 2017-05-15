import React from 'react';
import Relay from 'react-relay';
import { browserHistory } from 'react-router';
import moment from 'moment';
import '../../../../node_modules/react-select/scss/default.scss';
import '../Proposal.scss';
import { Modal, Card, Dropdown } from '../../Utils/components';
import { groupPaxsByAgeGroup } from '../../Pax/utils';
import AddTripMutation from '../../Trip/mutations/Add';
import DeleteTripMutation from '../../Trip/mutations/Delete';
import CloneTripMutation from '../../Trip/mutations/Clone';
import DeleteTripModal from '../../TripPlanner/components/DeleteTripModal';

import { STYLE_TITLE, STYLE_DATA_TITLE, STYLE_DATA, STYLE_DATA_BOLD, STYLE_BUTTON_DATA, STYLE_BUTTON_DISABLE } from '../Constants';

const TRIP_STATUS_ICONS = {
  Draft: <i className='mdi mdi-file-hidden small mr-10' />,
  Complete: <i className='mdi mdi-check small mr-10' />,
  Approved: <i className='mdi mdi-check-all small mr-10' />,
  Booked: <i className='mdi mdi-cash-usd small mr-10' />
};

export default class ProposalTripsCard extends React.Component {
  static propTypes = {
    viewer: React.PropTypes.object.isRequired,
    relay: React.PropTypes.object
  }

  static renderBudgetBox = (budget, budgetName) => (
    <div key={`${budgetName}-box`} className='col s3'>
      <label htmlFor={budgetName}>{budgetName.charAt(0).toUpperCase() + budgetName.slice(1)}</label>
      <div id={budgetName} className={STYLE_DATA_BOLD}>
        <span>{`$ ${budget[budgetName].actual}`}</span>
      </div>
    </div>
  );

  state = {
    isTripModalOpened: false,
    isDeleteTripModalOpened: false,
    tripModalIdx: -1
  }

  initTripData = (trip) => {
    trip.startDate = trip.startDate || ''; // eslint-disable-line no-param-reassign
    trip.durationDays = trip.durationDays || 0; // eslint-disable-line no-param-reassign
    trip.itinerary = trip.itinerary || []; // eslint-disable-line no-param-reassign
    trip.status = trip.status || 'Draft'; // eslint-disable-line no-param-reassign
  }

  changeDeleteTripModalState = (isOpen, idx) => {
    this.setState({ isDeleteTripModalOpened: isOpen, tripModalIdx: idx });
  }

  addBlankTrip() {
    const proposalKey = this.props.viewer.proposal._key;
    const onTripSuccess = function onSuccess(res) {
      browserHistory.push(`/trip-planner/${proposalKey}/${res.addTrip.trip._key}`);
    };

    const onFailure = (transaction) => {
      const error = transaction.getError() || new Error('Add Trip failed.');
      console.error(error);// eslint-disable-line no-console
    };

    Relay.Store.commitUpdate(new AddTripMutation({
      proposalKey,
      status: 'Draft',
      startDate: this.props.viewer.proposal.startTravelOnDate
    }), { onFailure, onSuccess: onTripSuccess });
  }

  handleTripEdit(tripKey) {
    const proposalKey = this.props.viewer.proposal._key;
    browserHistory.push(`/trip-planner/${proposalKey}/${tripKey}`);
  }

  handleTripDelete() {
    const idx = this.state.tripModalIdx;
    const trip = this.props.viewer.proposal.trips[idx];
    const relay = this.props.relay;
    Relay.Store.commitUpdate(new DeleteTripMutation({
      tripKey: trip._key
    }), {
      onSuccess: () => {
        relay.forceFetch();
      },
      onFailure: response => console.log('trip delete failed', response) // eslint-disable-line no-console
    });
    this.setState({ isDeleteTripModalOpened: false });
  }

  handleTripClone(idx) {
    const trip = this.props.viewer.proposal.trips[idx];
    const relay = this.props.relay;
    Relay.Store.commitUpdate(new CloneTripMutation({
      tripKey: trip._key
    }), {
      onSuccess: () => {
        relay.forceFetch();
      },
      onFailure: response => console.log('trip clone failed', response) // eslint-disable-line no-console
    });
  }

  renderTripCard = (trip, idx) => {
    this.initTripData(trip); // eslint-disable-line no-param-reassign
    const paxs = groupPaxsByAgeGroup(this.props.viewer.proposal.paxs, trip.startDate);
    const totalPaxsNum = this.props.viewer.proposal.paxs.length;
    const travellerDetails = Object.keys(paxs)
      .map(groupName => `${paxs[groupName].length} ${groupName}`)
      .join(' + ');

    const budgetBoxs = ['hotels', 'tours', 'transfers'].map(name => ProposalTripsCard.renderBudgetBox(trip.budget, name));
    const start = moment(trip.startDate, 'YYYY-MM-DD');
    const startDate = start.format('MMMM, DD YYYY');
    const endDate = trip.endDate ? moment(trip.endDate, 'YYYY-MM-DD').format('MMMM, DD YYYY') : start.add(trip.durationDays, 'days').format('MMMM, DD YYYY');
    return (
      <div key={trip._key} className='pt-20 pb-30'>
        <div className='valign-wrapper'>
          <div>
            <i className='mdi mdi-wallet-travel mr-10 fs-26 pt-5' />
          </div>
          <div className='row mt-0' style={{ width: '100%' }}>
            <div className='col s4'>
              <span className={STYLE_DATA_TITLE}>Trips</span>
              <span className='exo-colors-text text-base1 fs-20 fw-700 ml-20'>{trip._key}</span>
            </div>
            <div className='col s8 right-align'>
              <a className='pr-20 cursor' onClick={() => this.handleTripClone(idx)}>
                <i className='mdi-content-content-copy small mr-5' />
                <span className={STYLE_BUTTON_DATA}>CLONE</span>
              </a>
              { trip.status === 'Booked' ? (
                <a className={`pr-20 cursor ${STYLE_BUTTON_DISABLE}`}>
                  <i className='mdi-content-remove small mr-5' />
                  <span style={{ cursor: 'not-allowed' }}>REMOVE</span>
                </a>
              ) : (
                <a className='pr-20 cursor' onClick={() => this.changeDeleteTripModalState(true, idx)}>
                  <i className='mdi-content-remove small mr-5' />
                  <span className={STYLE_BUTTON_DATA}>REMOVE</span>
                </a>
                )
              }
              <a className='pr-10 cursor' onClick={() => this.handleTripEdit(trip._key)}>
                <i className='mdi-editor-mode-edit small mr-5' />
                <span className={STYLE_BUTTON_DATA}>EDIT</span>
              </a>
            </div>
          </div>
        </div>
        <div className='pl-35'>
          <div className='row'>
            <div className='col s12 light-green-text fs-20 fw-700'>
              {TRIP_STATUS_ICONS[trip.status]}
              <span className='mr-20'>{trip.status}</span>
            </div>
          </div>
          <div className='row pt-10'>
            <div className='col s3'>
              <label htmlFor='travellers'>Travellers</label>
              <div id='travellers' className={STYLE_DATA_BOLD}>{`${totalPaxsNum} people`}</div>
              <div className={STYLE_DATA}>{travellerDetails}</div>
            </div>
            <div className='col s3'>
              <label htmlFor='duration'>Duration</label>
              <div id='duration' className={STYLE_DATA_BOLD}>{`${trip.durationDays} days`}</div>
              <div className={STYLE_DATA}>{`${startDate} - ${endDate}`}</div>
            </div>
          </div>
          <div className='row pt-10'>
            <div className='col s12'>
              <span className={STYLE_DATA_TITLE}>{`Budget $ ${trip.budget.total.actual}`}</span>
            </div>
            {budgetBoxs}
          </div>
          <div className='row pt-10'>
            <div className='col s12'>
              <span className={STYLE_DATA_TITLE}>Travel Itinerary</span>
            </div>
            <div id='itinerary' className='col s12'>
              <label htmlFor='itinerary'>{'Country / city'}</label>
              {trip.itinerary.map(itinerary => (
                <div key={`${itinerary.country}  ${itinerary.cities.join(' / ')}`}>
                  <span className={STYLE_DATA_BOLD}>{itinerary.country}</span>
                  <span className={`${STYLE_DATA} pl-20`}>{itinerary.cities.join(' / ')}</span>
                </div>))
              }
            </div>
          </div>
          <div className='row pt-20'>
            <div className='divider' />
          </div>
        </div>
      </div>
    );
  }

  render() {
    const trips = this.props.viewer.proposal.trips;
    const { isDeleteTripModalOpened } = this.state;
    const title = [<span key='trips' style={{ float: 'left' }}>Trips</span>, <div key='tripsNum' style={{ float: 'left' }} className='chip mt-5 ml-30 exo-colors base1'><span className='exo-colors-text text-accent-1 fs-24 fw-700'>{trips.length}</span></div>];
    return (
      <Card title={title} titleClassName={`exo-colors modal-bgr1 pt-10 pb-10 ${STYLE_TITLE}`} titleBackColor='white' minimized doFullCardTitleExpand>
        <div className='pt-10'>
          {trips.map((trip, idx) => this.renderTripCard(trip, idx))}
          <div className='row pb-20 pl-30 exo-colors-text text-base1'>
            <a className='exo-colors-text text-data-1 cursor' onClick={() => this.addBlankTrip()}>
              <i className='mdi-content-add small mr-5 exo-colors-text text-base1' />
              <span className={STYLE_BUTTON_DATA}>ADD TRIP</span>
            </a>
          </div>
        </div>
        <DeleteTripModal
          toggle={this.changeDeleteTripModalState}
          isOpened={isDeleteTripModalOpened}
          deleteTrip={() => this.handleTripDelete()}
          isModalCloseOnSave
        />
      </Card>

    );
  }
}
