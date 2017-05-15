import React, { Component, PropTypes } from 'react';
import Relay from 'react-relay';
import _ from 'lodash';
import moment from 'moment';
import PubSub from 'pubsub-js';
import { Select } from '../../Utils/components';
import Detail from './Detail';
import BookServiceMutation from '../../ServiceBooking/mutations/BookService';
import CancelBookingMutation from '../../ServiceBooking/mutations/CancelBooking';
import ServiceAvailabilityMutation from '../../ServiceBooking/mutations/ServiceAvailability';
import ChangeServiceDayMutation from '../mutations/ChangeServiceDay';
import TourConfigure from './TourConfigure';
import TourInfo from './TourInfo';
import { getUserRole } from '../../../services/user';
import styles from '../style.module.scss';
import UpdateServiceMutation from '../../ServiceBooking/mutations/UpdateService';

export default class TourInfobox extends Component {
  static propTypes = {
    viewer: PropTypes.object.isRequired,
    paxs: PropTypes.array,
    relay: PropTypes.object,
    cityBookingId: PropTypes.string,
    cityDayKey: PropTypes.string,
    tripKey: PropTypes.string,
    days: PropTypes.array
  };

  state = {
    dayValue: `${this.props.cityDayKey}${this.props.viewer.serviceBooking.startSlot}`,
    serviceStatus: this.props.viewer.serviceBooking.status ? this.props.viewer.serviceBooking.status.state : '',
    serviceState: this.props.viewer.serviceBooking.status ? this.props.viewer.serviceBooking.status.state : '',
    tpBookingStatus: (this.props.viewer.serviceBooking.status && this.props.viewer.serviceBooking.status.tpBookingStatus) ? this.props.viewer.serviceBooking.status.tpBookingStatus : '',
    tpAvailabilityStatus: (this.props.viewer.serviceBooking.status && this.props.viewer.serviceBooking.status.tpAvailabilityStatus) ? this.props.viewer.serviceBooking.status.tpAvailabilityStatus : '',
    userRole: getUserRole(),
    hasPaxErrors: 0,
    isBooked: false
  };

  componentWillReceiveProps(nextProps) {
    let paxErrorsCount = 0;
    const setting = {
      // dayValue: `${nextProps.viewer.serviceBooking._key}${nextProps.viewer.serviceBooking.startSlot}`, //2049 Fix tour time slot field solved by commenting this line
      serviceStatus: '',
      availability: {},
      tpAvailabilityStatus: '',
      tpBookingStatus: '',
      serviceState: '',
      isBooked: false
    };

    // if (this.props.viewer.serviceBooking !== nextProps.viewer.serviceBooking) {
    //   setting.availability = {};
    // } else {
    //   setting.availability = nextProps.viewer.tourAvailability;
    // }

    // if (nextProps.viewer.tourAvailability && nextProps.viewer.tourAvailability.availability) setting.serviceStatus = nextProps.viewer.tourAvailability.availability;

    // if (nextProps.viewer.serviceBooking.status && nextProps.viewer.serviceBooking.status.state !== '') {
    //   setting.serviceStatus = nextProps.viewer.serviceBooking.status.state;
    // }

    if (this.props.viewer.serviceBooking !== nextProps.viewer.serviceBooking) {
      setting.tpAvailabilityStatus = '';
    } else {
      setting.tpAvailabilityStatus = (nextProps.viewer.serviceBooking.status && nextProps.viewer.serviceBooking.status.tpAvailabilityStatus) ? nextProps.viewer.serviceBooking.status.tpAvailabilityStatus : '';// nextProps.viewer.tpAvailabilityStatus;
    }

    // if (nextProps.viewer.serviceBooking.status && nextProps.viewer.serviceBooking.status.state !== '') {
    //   setting.tpBookingStatus = nextProps.viewer.serviceBooking.status.tpBookingStatus;
    // }

    // start identify pax error or not
    if (nextProps.viewer.serviceBooking.roomConfigs && nextProps.viewer.serviceBooking.roomConfigs.length > 0) {
      _.map(nextProps.viewer.serviceBooking.roomConfigs, (roomConfig) => { // eslint-disable-line no-loop-func
        if (roomConfig.paxs && roomConfig.paxs.length === 0) {
          paxErrorsCount++;
        }
      });
    }
    setting.hasPaxErrors = paxErrorsCount;
    // end identify pax error or not
    setting.serviceState = nextProps.viewer.serviceBooking.status ? nextProps.viewer.serviceBooking.status.state : '';
    if (nextProps.viewer.serviceBooking.status && nextProps.viewer.serviceBooking.status.state && nextProps.viewer.serviceBooking.status.state === 'Booked') {
      setting.isBooked = true;
    }
    this.setState(setting);
  }

  modifiedServiceBooking = (serviceBooking) => {
    if (serviceBooking && serviceBooking.tour && serviceBooking.tour.title) {
      serviceBooking.title = serviceBooking.tour.title; // eslint-disable-line no-param-reassign
    }
  };

  handleCheckTourAvailability = () => {
    Relay.Store.commitUpdate(new ServiceAvailabilityMutation({
      serviceBooking: this.props.viewer.serviceBooking
    }), {
      onSuccess: (res) => {
        PubSub.publish('TripForceFetch');
      }
    });
  };

  changeDay = (e) => {
    const daySlot = e.target.value;
    Relay.Store.commitUpdate(new ChangeServiceDayMutation({
      cityDayKey: daySlot.slice(0, daySlot.length - 1),
      startSlot: daySlot.slice(daySlot.length - 1),
      serviceBookingKey: this.props.viewer.serviceBooking._key,
      cityBookingID: this.props.viewer.cityBooking.id
    }), {
      onSuccess: (data) => {
        // PubSub.publish('Infobox', { type: 'clear' });
        // so that infobox remains open
        // PubSub.publish('TripForceFetch');
        PubSub.publish('Infobox', {
          cityBookingKey: this.props.cityBookingKey,
          cityDayKey: this.props.cityDayKey,
          serviceBookingKey: this.props.serviceBookingKey,
          tpBookingRef: '',
          type: 'tour'
        });
      }
    });
  };

  cancelBooking = () => {
    Relay.Store.commitUpdate(new CancelBookingMutation({
      serviceBookings: this.props.viewer.serviceBooking
    }), {
      onSuccess: () => {
        PubSub.publish('TripForceFetch');
      }
    });
  };

  handleUpdateStatus = (val) => {
    const name = 'status';
    const value = val;

    Relay.Store.commitUpdate(new UpdateServiceMutation({
      serviceBookingId: this.props.viewer.serviceBooking.id,
      serviceBookingKey: this.props.viewer.serviceBooking._key,
      patchData: {
        [name]: {
          tpBookingStatus: value,
          state: value
        }
      }
    }));
    // this.handleChange(e);
  };

  bookService = () => {
    Relay.Store.commitUpdate(new BookServiceMutation({
      serviceBookings: this.props.viewer.serviceBooking
    }), {
      onSuccess: () => {
        // PubSub.publish('TripForceFetch');
        this.props.relay.forceFetch();
      }
    });
    // this.handleUpdateStatus('Booked');
  };

  render() {
    const { viewer, paxs, cityDayKey, tripKey } = this.props;
    this.modifiedServiceBooking(viewer.serviceBooking);
    let cityFirstDay;
    if (viewer.cityBooking && viewer.cityBooking.cityDays && viewer.cityBooking.cityDays.length > 0) {
      cityFirstDay = viewer.cityBooking.cityDays[0].startDay;
    }
    const timeSlot = () => {
      let arr = _.values(viewer.serviceBooking.tour.timeSlots);
      const keys = _.keys(viewer.serviceBooking.tour.timeSlots);
      arr.shift();
      keys.shift();
      for (let k = 0; k < keys.length; k++) {
        arr[k].timeName = keys[k];
      }
      arr = _.sortBy(arr, 'pickupTime');
      const options = [];

      // Create options including all available days and time slots
      for (let day = 1; day <= viewer.cityBooking.cityDays.length; day++) {
        options.push(arr.map((slot, idx) => { // eslint-disable-line no-loop-func
          if (slot.available) {
            return <option key={`${viewer.cityBooking.cityDays[day - 1]._key}${idx + 1}`} value={`${viewer.cityBooking.cityDays[day - 1]._key}${idx + 1}`} >Day {cityFirstDay} {moment(this.props.viewer.cityBooking.cityDays[day - 1].startDate).format('MMM D')},{slot.timeName}</option>;
          }
          return undefined;
        }));
        cityFirstDay++;
      }
      return options;
    };

    const showDayValue = this.props.cityDayKey + this.props.viewer.serviceBooking.startSlot;

    // disabled slot time select when in 'Booked' status state
    let isBooked = false;
    if (this.props.viewer.serviceBooking && this.props.viewer.serviceBooking.status && this.props.viewer.serviceBooking.status.state && this.props.viewer.serviceBooking.status.state === 'Booked') {
      isBooked = true;
    }
    const timeSlotRenderer =
      (<div style={{ paddingTop: '19px', pointerEvents: `${this.state.isBooked ? 'none' : ''}` }} >
        <span style={{ color: '#bfbfbf', fontWeight: '700' }}>Time slot</span>
        <div className='row m-0'>
          <div className='col s1 p-0'>
            <i style={{ fontSize: '16px', color: '#bfbfbf' }} className='mdi-action-event' />
          </div>
          <div className='col s11 p-0'>
            <div className={styles.select}>
              <Select value={showDayValue} onChange={this.changeDay} disabled={this.state.userRole === 'TA' || isBooked}>
                <option disabled>Choose your option</option>
                {timeSlot()}
              </Select>
            </div>
          </div>
        </div>
      </div>);

    let tpBookingRef = '';
    if (this.props.infoBoxData && this.props.infoBoxData.tpBookingRef) {
      tpBookingRef = this.props.infoBoxData.tpBookingRef;
    }

    // only enable BOOK button if the product is in Available state.
    let disableBook = true;
    if (this.state.serviceState === 'Available') {
      disableBook = false;
    }
    const configureRenderer = () =>
      <TourConfigure
        tpBookingRef={tpBookingRef}
        viewer={viewer}
        relay={this.props.relay}
        paxs={paxs}
        cityDayKey={cityDayKey}
        tripKey={tripKey}
        serviceStatus={this.state.serviceStatus}
        serviceState={this.state.serviceState}
        availability={this.state.availability}
        tpAvailabilityStatus={this.state.tpAvailabilityStatus}
        tpBookingStatus={this.state.tpBookingStatus}
        isBooked={this.state.isBooked}
        currency={this.props.infoBoxData.currency}
      />;
    const infoRenderer = () => <TourInfo viewer={viewer} />;

    return (
      <Detail
        viewer={viewer}
        handleCheckButton={this.handleCheckTourAvailability}
        handleBookService={this.bookService}
        handleCancelBooking={this.cancelBooking}
        serviceStatus={this.state.serviceStatus}
        serviceState={this.state.serviceState}
        tpAvailabilityStatus={this.state.tpAvailabilityStatus}
        tpBookingStatus={this.state.tpBookingStatus}
        cityDayKey={cityDayKey}
        renderTimeslot={timeSlotRenderer}
        renderConfigure={configureRenderer()}
        renderInfo={infoRenderer()}
        type='tour'
        hasPaxErrors={this.state.hasPaxErrors}
        disableBook={disableBook}
      />
    );
  }
}
