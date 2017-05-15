import React from 'react';
import Relay from 'react-relay';
import classNames from 'classnames/bind';
import moment from 'moment';
import PubSub from 'pubsub-js';
import ReactTooltip from 'react-tooltip';
import _ from 'lodash';
import Slot from './Slot';
import { Dropdown, Modal } from '../../Utils/components';
import TourModal from '../../Tour/renderers/TourModalRenderer';
import TATourModal from '../../Tour/renderers/TATourModalRenderer';
import AccommodationModal from '../../Accommodation/renderers/AccommodationModalRenderer';
import TAAccommodationModal from '../../Accommodation/renderers/TAAccommodationModalRenderer';
import UpdateServicesMutation from '../../ServiceBooking/mutations/UpdateServices';
import AddMealMutation from '../../Meal/mutations/AddMeal';
import SelectServiceBookings from '../mutations/SelectServiceBookings';
import styles from '../city.module.scss';
import UpdateDay from '../mutations/UpdateDay';

import UpdateTourPaxsMutation from '../../InfoBox/mutations/UpdateTourPaxs';


export default class Day extends React.Component {
  static propTypes = {
    day: React.PropTypes.object.isRequired,
    cityBooking: React.PropTypes.object.isRequired,
    countryBooking: React.PropTypes.object.isRequired,
    handleRemoveDay: React.PropTypes.func.isRequired,
    countryIndex: React.PropTypes.number.isRequired,
    cityIndex: React.PropTypes.number.isRequired,
    activeDetail: React.PropTypes.object,
    handleAddDay: React.PropTypes.func.isRequired,
    dayIndex: React.PropTypes.number.isRequired,
    days: React.PropTypes.array,
    viewer: React.PropTypes.object,
    activeServiceBookingKey: React.PropTypes.string,
    isTaView: React.PropTypes.bool
  };

  /**
   * Setup height and width of a rendered activity
   */
  static configuration = {
    HEIGHT: 110
  };

  state = {
    services: this.props.day.serviceBookings,
    isTourModalOpened: false,
    isAccommodationModalOpened: false,
    isRemoveModalOpened: false,
    isLocalTransferModalOpened: false,
    isAmDisabled: false,
    isPmDisabled: false,
    isEveDisabled: false,
    unavailableSlots: [],
    hideAmMarkOption: false,
    hidePmMarkOption: false,
    hideEveMarkOption: false,
    hideRemoveDay: false
  };

  componentDidMount() {
    $('.dropdown-button2').dropdown({
      inDuration: 300,
      outDuration: 225,
      constrain_width: false, // Does not change width of dropdown to that of the activator
      hover: true, // Activate on hover
      gutter: ($('.dropdown-content').width() * 3) / 2.5 + 5, // eslint-disable-line no-mixed-operators
      belowOrigin: false, // Displays dropdown below the button
      alignment: 'left' // Displays dropdown with edge aligned to the left of button
    });
  }

  componentWillMount() {
    this.token = PubSub.subscribe(`Day_${this.props.day._key}`, (msg, data) => {
      if (data.type === 'change') {
        this.changeTourModalState(data.isOpen, data.service);
      } else {
        this.changeRemoveModalState(data.isOpen, data.service);
      }
    });
  }
  componentWillReceiveProps(nextProps) {
    this.setState({ hideRemoveDay: false });
    nextProps.accommodationDates.map((acc) => { // eslint-disable-line array-callback-return
      if (acc === nextProps.day.startDate) {
        this.setState({ hideRemoveDay: true });
      }
    });
    const unavailableSlots = [];
    let isAmDisabled = false;
    let isPmDisabled = false;
    let isEveDisabled = false;
    if (nextProps.day.unavailableSlots && nextProps.day.unavailableSlots.length > 0) {
      if (nextProps.day.unavailableSlots.indexOf('am') !== -1) {
        isAmDisabled = true;
        unavailableSlots.push('am');
      }
      if (nextProps.day.unavailableSlots.indexOf('pm') !== -1) {
        isPmDisabled = true;
        unavailableSlots.push('pm');
      }
      if (nextProps.day.unavailableSlots.indexOf('eve') !== -1) {
        isEveDisabled = true;
        unavailableSlots.push('eve');
      }
    }

    // start hide mark options check
    let hideAmMarkOption = false;
    let hidePmMarkOption = false;
    let hideEveMarkOption = false;
    if (nextProps.days && nextProps.day.serviceBookings && nextProps.day.serviceBookings.length > 0) {
      nextProps.day.serviceBookings.map((service) => {  // eslint-disable-line array-callback-return
        if (service.startSlot && service.startSlot !== '') {
          const s_slot = service.startSlot;
          if (s_slot === 1) {
            hideAmMarkOption = true;
          }
          if (s_slot === 2) {
            hidePmMarkOption = true;
          }
          if (s_slot === 3) {
            hideEveMarkOption = true;
          }
        }
      });
    }

    // end  hide mark options check


    // start added on 27 march update local transfer null issue
    const finalCheckServices = [];
    const recheckServcies = nextProps.day.serviceBookings;
    _.map(recheckServcies, (rsb) => {
      if (rsb.serviceBookingType === 'localtransfer' && rsb.localtransfer === null && rsb.transfer) {
        rsb.localtransfer = rsb.transfer; // eslint-disable-line no-param-reassign
        finalCheckServices.push(rsb);
      } else {
        finalCheckServices.push(rsb);
      }
    });
    // end added on 27 march update local transfer null issue


    this.setState({
      // services: nextProps.day.serviceBookings,
      services: finalCheckServices,
      isAmDisabled,
      isPmDisabled,
      isEveDisabled,
      unavailableSlots,
      hideAmMarkOption,
      hidePmMarkOption,
      hideEveMarkOption
    });
  }

  componentWillUnmount() {
    PubSub.unsubscribe(this.token);
  }

  changeTourModalState = (isOpen, service) => {
    this.changedTour = service;
    this.setState({ isTourModalOpened: isOpen });
  };

  changeAccommodationModalState = (isOpen) => {
    this.setState({ isAccommodationModalOpened: isOpen });
  };

  changeRemoveModalState = (isOpen, removedTour) => {
    this.removedTour = removedTour;
    this.setState({ isRemoveModalOpened: isOpen });
  };

  /**
   * Save or Remove a service bookings
   * If tours is Object, delete the tour,
   * Otherwise, update the tours
   *
   * @param services [Array | Object]
   */
  handleSaveAndRemoveTours = (services) => {
    // Remove a service booking if the tours is an Object
    if (!Array.isArray(services)) {
      services = this.state.services.filter(service => service._key !== services._key); // eslint-disable-line no-param-reassign
    }
    const tourKeys = services.filter(service => !service.placeholder).map((service) => { // eslint-disable-line consistent-return
      if (service.tour) {
        return {
          tourKey: service.tour._key,
          startSlot: service.startSlot
        };
      }
      return null;
    });
    const placeholders = [];
    services.filter(service => service.placeholder).map((service) => {
      if (service.placeholder) {
        if (service._key.substring(0, 11) !== 'placeholder') {
          placeholders.push({
            serviceBookingKey: service._key
          });
        } else {
          const obj = service.placeholder;
          obj.durationSlots = service.durationSlots;
          obj.startSlot = service.startSlot;
          delete obj._key;
          delete obj.duration;
          placeholders.push(obj);
        }
      }
      return null;
    });

    Relay.Store.commitUpdate(new UpdateServicesMutation({
      cityDayKey: this.props.day._key,
      id: this.props.day.id,
      tourKeys,
      placeholders
    }), {
      onSuccess: (res) => {
        PubSub.publish('Infobox', { type: 'clear' });

        // add PAX to the service booking - added on 9th nov
        let n_servicekey = '';
        let n_serviceid = '';
        if (res.updateToursByCityDayKey && res.updateToursByCityDayKey.cityDays && res.updateToursByCityDayKey.cityDays.serviceBookings[0] && res.updateToursByCityDayKey.cityDays.serviceBookings[0].tour && res.updateToursByCityDayKey.cityDays.serviceBookings[0].tour !== null) {
          n_servicekey = res.updateToursByCityDayKey.cityDays.serviceBookings[0]._key;
          n_serviceid = res.updateToursByCityDayKey.cityDays.serviceBookings[0].id;
        }

        if (n_servicekey !== '') {
          let paxsArray = [];

          if (this.props.viewer.paxs && this.props.viewer.paxs.length > 0) {
            paxsArray = _.map(this.props.viewer.paxs, v =>
               v._key
            );
          }
          if (paxsArray.length > 0) {
            Relay.Store.commitUpdate(new UpdateTourPaxsMutation({
              paxKeys: paxsArray,
              serviceBookingId: n_serviceid,
              serviceBookingKey: n_servicekey
            }), {
              onSuccess: () => {
                // PubSub.publish('Infobox', { type: 'clear' });
              }
            });
          }

          // start open tour infobox when tour added
          const d_forInfobox = {
            cityBookingKey: this.props.cityBooking._key,
            cityDayKey: this.props.day._key,
            serviceBookingKey: n_servicekey,
            tpBookingRef: '',
            type: 'tour'
          };
          PubSub.publish('Infobox', d_forInfobox);
          // end open tour infobox when tour added
        } else {
          PubSub.publish('TripForceFetch', {});
        }
      }
    });
    this.setState({ services });
    PubSub.publish('TripForceFetch', {});
  };

  handleTASelectTour({ selectedServiceBookingKeys, tourKeys }) {
    Relay.Store.commitUpdate(new SelectServiceBookings({
      id: this.props.day.id,
      cityDayKey: this.props.day._key,
      tourKeys,
      selectedServiceBookingKeys
    }), {
      onSuccess: () => {
        // TODO we need to update, new Service, filter inactive edges.
        PubSub.publish('TripForceFetch', {});
      }
    });
  }


  changeDaySlotAvailability(dayKey, slot) {  // by defaut slot will be treat as avaialble and if slot found in day it means its is unavailable
    const unavailableSlots = this.state.unavailableSlots;
    if (unavailableSlots.indexOf(slot) === -1) {
      unavailableSlots.push(slot);
    } else {
      _.pull(unavailableSlots, slot);
    }
    Relay.Store.commitUpdate(new UpdateDay({
      dayKey,
      unavailableSlots
    }), {
      onSuccess: () => {
        PubSub.publish('TripForceFetch', {});
      }
    });
  }

  handleSaveMeal(mealOrder, mealType, mealNote) {
    const cityDayKey = this.props.day._key;
    Relay.Store.commitUpdate(new AddMealMutation({ cityDayKey, mealOrder, mealType, mealNote }), {
      onSuccess: () => {
        // TODO updated the meals info in slot and country/city title
        PubSub.publish('TripForceFetch', {});
      }
    });
  }

  // start-addTrip Arrival Block
  // addTripArrivalBlock = () => {
  //   PubSub.publish('AddTripArrival', {  });
  // }
  // end-addTrip Arrival Block

  getTriggerButtonA(triggerButton, id) {
    return React.cloneElement(triggerButton, {
      className: 'dropdown-button',
      href: '#',
      'data-activates': id,
      'data-beloworigin': 'true'
    });
  }

  getTriggerButtonB(triggerButton, id) {
    return React.cloneElement(triggerButton, {
      className: 'dropdown-button2 d',
      href: '#',
      'data-activates': id,
      'data-hover': 'hover',
      'data-alignment': 'left'
    });
  }

  render() {
    const dayId = this.props.day._key;
    const countryName = this.props.countryBooking.location.name;
    const cityCode = this.props.cityBooking.location.tpCode;
    const verticalButton = <a style={{ fontSize: '1.4em', color: 'black' }}><i className='mdi-hardware-keyboard-control' /></a>;
    const addButton = <a style={{ fontSize: '2.5em' }}><i className='mdi-content-add' /></a>;
    const removeButton = <a className='modal-action modal-close waves-effect waves-green btn' onClick={this.handleSaveAndRemoveTours.bind(null, this.removedTour)}><i className='mdi-action-delete left' />Remove</a>;
    const cx = classNames.bind(styles);
    const officeKey = this.props.viewer.proposal[this.props.isTaView ? 'TA' : 'TC'].office._key;
    let tourModal = null;
    if (this.state.isTourModalOpened) {
      tourModal = this.props.isTaView ? <TATourModal countryName={countryName} cityCode={cityCode} cityDayKey={this.props.day._key} date={(new Date()).toISOString().slice(0, 10)} services={_.filter(this.state.services, booking => booking.tour || booking.placeholder)} handleSaveAndRemoveTours={this.handleSaveAndRemoveTours} isModalOpened={this.state.isTourModalOpened} changeModalState={this.changeTourModalState} handleTASelectTour={servicesKeys => this.handleTASelectTour(servicesKeys)} service={this.changedTour} defaultTours={this.props.cityBooking.defaultTours} />
        : <TourModal countryName={countryName} cityCode={cityCode} cityDayKey={this.props.day._key} date={this.props.day.startDate} day={this.props.day.startDay} services={_.filter(this.state.services, booking => booking.tour && booking.inactive !== true)} handleSaveAndRemoveTours={this.handleSaveAndRemoveTours} isModalOpened={this.state.isTourModalOpened} changeModalState={this.changeTourModalState} officeKey={officeKey} unavailableSlots={this.state.unavailableSlots} />;
    }
    let accommodationModal = null;
    if (this.state.isAccommodationModalOpened) {
      accommodationModal = this.props.isTaView ? <TAAccommodationModal countryName={countryName} cityCode={cityCode} date={this.props.day.startDate} startDay={this.props.day.startDay} duration={1} accommodationPlacementKey={null} cityBookingId={this.props.cityBooking.id} cityBookingKey={this.props.cityBooking._key} isModalOpened={this.state.isAccommodationModalOpened} changeModalState={this.changeAccommodationModalState} />
        : <AccommodationModal country={this.props.countryBooking} cityDays={this.props.days} countryName={countryName} cityCode={cityCode} date={this.props.day.startDate} startDay={this.props.day.startDay} duration={1} accommodationPlacementKey={null} cityBookingId={this.props.cityBooking.id} cityBookingKey={this.props.cityBooking._key} isModalOpened={this.state.isAccommodationModalOpened} changeModalState={this.changeAccommodationModalState} />;
    }

    const floatClearHtml = <div style={{ clear: 'both' }} />;

    let am_dayAvailability = <a style={{ color: `${this.state.hideAmMarkOption ? '#dee1ec' : ''}` }} onClick={this.changeDaySlotAvailability.bind(this, dayId, 'am')} ><div style={{ float: 'left' }} /><div style={{ float: 'right', textAlign: 'left', width: '60px' }}>Morning</div>{floatClearHtml}</a>;
    if (this.state.isAmDisabled) {
      am_dayAvailability = <a style={{ color: `${this.state.hideAmMarkOption ? '#dee1ec' : ''}` }} onClick={this.changeDaySlotAvailability.bind(this, dayId, 'am')} ><div style={{ float: 'left' }}><i className='mdi mdi-check' style={{ fontSize: '20px' }} /></div> <div style={{ float: 'right', textAlign: 'left', width: '60px' }}>Morning</div>{floatClearHtml}</a>;
    }
    let pm_dayAvailability = <a style={{ color: `${this.state.hidePmMarkOption ? '#dee1ec' : ''}` }} onClick={this.changeDaySlotAvailability.bind(this, dayId, 'pm')} ><div style={{ float: 'left' }} /><div style={{ float: 'right', textAlign: 'left', width: '60px' }}>Afternoon</div>{floatClearHtml}</a>;
    if (this.state.isPmDisabled) {
      pm_dayAvailability = <a style={{ color: `${this.state.hidePmMarkOption ? '#dee1ec' : ''}` }} onClick={this.changeDaySlotAvailability.bind(this, dayId, 'pm')} ><div style={{ float: 'left' }}><i className='mdi mdi-check' style={{ fontSize: '20px' }} /></div> <div style={{ float: 'right', textAlign: 'left', width: '60px' }}> Afternoon</div>{floatClearHtml}</a>;
    }
    let eve_dayAvailability = <a style={{ color: `${this.state.hideEveMarkOption ? '#dee1ec' : ''}` }} onClick={this.changeDaySlotAvailability.bind(this, dayId, 'eve')} ><div style={{ float: 'left' }} /><div style={{ float: 'right', textAlign: 'left', width: '60px' }}>Evening</div>{floatClearHtml}</a>;
    if (this.state.isEveDisabled) {
      eve_dayAvailability = <a style={{ color: `${this.state.hideEveMarkOption ? '#dee1ec' : ''}` }} onClick={this.changeDaySlotAvailability.bind(this, dayId, 'eve')} ><div style={{ float: 'left' }}><i className='mdi mdi-check' style={{ fontSize: '20px' }} /></div> <div style={{ float: 'right', textAlign: 'left', width: '60px' }}> Evening</div>{floatClearHtml}</a>;
    }

    const slot_upper_div_height = '330px';
    let day_label_height;
    let dropDown_bottom;
    let none;
    if (this.props.cityIndex > 0 && this.props.dayIndex === 0) {
      if (this.props.dayLabelHide) {
        none = 'none';
      }
    }
    if (this.props.dayIndex === 0) {
      dropDown_bottom = '20%';
      if (this.props.index === 0) {
        day_label_height = '380px';
      } else if (this.props.index > 0) {
        day_label_height = '325px';
      } else {
        day_label_height = '';
        dropDown_bottom = '';
      }
    }
    const buttonA = <a style={{ fontSize: '1.4em', color: 'black' }}><i className='mdi-hardware-keyboard-control' /> </a>;
    const buttonB = <a>Mark Unavailable <i className='mdi mdi-menu-right' style={{ fontSize: '1.4em', color: 'black' }} /></a>;

    const dropDownAID = `${dayId}_1`;
    const dropDownBID = `${dayId}_2`;

    const triggerButtonA = this.getTriggerButtonA(buttonA, dropDownAID);
    const triggerButtonB = this.getTriggerButtonB(buttonB, dropDownBID);
    const toolTip = 'Action unavailable before active product booking.';

    let dateBelowDay = moment(this.props.day.startDate, 'YYYY-MM-DD').format('D MMM');
    if (this.props.dayIndex === 0) {
      if (this.props.cityBooking && this.props.cityBooking.transferPlacements) {
        if (this.props.cityBooking.transferPlacements.durationDays && this.props.cityBooking.transferPlacements.durationDays > 1) {
          const transferDurationDays = this.props.cityBooking.transferPlacements.durationDays;
          dateBelowDay = (<div>
            <div>{ moment(this.props.cityBooking.transferPlacements.startDate, 'YYYY-MM-DD').format('D MMM')}</div>
            <div>-</div>
            <div>{moment(this.props.cityBooking.transferPlacements.startDate, 'YYYY-MM-DD').add(transferDurationDays - 1, 'days').format('D MMM')}</div>
          </div>);
        }
      }
    }

    return (
      <div className='row m-0'>
        <div id='test' className='col s2 valign-wrapper p-0' style={{ height: Day.configuration.HEIGHT * 3, justifyContent: 'center', position: 'absolute' }}>
          <div className='valign center-align' style={{ height: '100%' }}>
            <div style={{ position: 'relative', bottom: day_label_height, display: none }}>
              {
                (this.props.dayIndex === 0 && this.props.cityBooking.transferPlacements && this.props.cityBooking.transferPlacements.durationDays > 1) ?
                  <div style={{ fontWeight: '600' }}>Day <br /><span style={{ fontWeight: '600', fontSize: '24px' }}>{ this.props.cityBooking.transferPlacements.startDay } - {(this.props.cityBooking.transferPlacements.startDay + this.props.cityBooking.transferPlacements.durationDays) - 1}</span> </div>
                : <div style={{ fontWeight: '600' }}>Day <br /><span style={{ fontWeight: '600', fontSize: '24px' }}>{ this.props.day.startDay }</span> </div>
              }
              <div style={{ color: '#7fc7ae' }}>{ dateBelowDay }</div>
            </div>
            { this.props.isTaView ? null : (
              <div style={{ position: 'relative', bottom: dropDown_bottom }}>
                {triggerButtonA}
                <ul id={dropDownAID} className='dropdown-content' style={{ overflow: 'visible' }}>
                  {
                  this.state.hideRemoveDay ? <li><a data-tip={toolTip} style={{ color: '#8c8c8c' }}>Add Day Before</a><ReactTooltip /></li>
                  : <li><a onClick={this.props.handleAddDay.bind(this, this.props.dayIndex, this.props.day.startDate)}>Add Day Before</a><ReactTooltip /></li>
                }
                  {this.state.hideRemoveDay ? <li><a data-tip={toolTip} style={{ color: '#8c8c8c' }}>Remove Day</a><ReactTooltip /></li>
                  : <li><a onClick={this.props.handleRemoveDay.bind(this, this.props)}>Remove Day</a><ReactTooltip /></li>
                }
                  {this.state.hideRemoveDay ? <li><a data-tip={toolTip} style={{ color: '#8c8c8c' }}>Add Day After</a><ReactTooltip /></li>
                  : <li><a onClick={this.props.handleAddDay.bind(this, this.props.dayIndex + 1, moment(this.props.day.startDate).add(1, 'days').format('YYYY-MM-DD'))}>Add Day After</a><ReactTooltip /></li>
                }
                  {this.state.hideRemoveDay ? null :
                  <li>
                    {triggerButtonB}
                  </li>
                }
                </ul>


                <ul id={dropDownBID} className='dropdown-content' style={{ overflow: 'visible' }} style={{ width: '120px' }}>
                  <li style={{ pointerEvents: `${this.state.hideAmMarkOption ? 'none' : ''}` }} >{am_dayAvailability}</li>
                  <li style={{ pointerEvents: `${this.state.hidePmMarkOption ? 'none' : ''}` }} >{pm_dayAvailability}</li>
                  <li style={{ pointerEvents: `${this.state.hideEveMarkOption ? 'none' : ''}` }} >{eve_dayAvailability}</li>
                </ul>
              </div>)
            }
            { this.props.isTaView ? null : (
              <div style={{ position: 'relative', bottom: dropDown_bottom }}>
                <Dropdown triggerButton={addButton}>
                  <li><a onClick={this.changeAccommodationModalState.bind(null, true)} style={{ padding: '0.5rem 1rem' }}>Add hotel</a></li>
                  <li><a onClick={this.changeTourModalState.bind(null, true)} style={{ padding: '0.5rem 1rem' }}>Add tour</a></li>
                  <li><a onClick={() => { this.props.openLocalTransferModal({ cityCode, dayId }); }} style={{ padding: '0.5rem 1rem' }}>Add local transfer</a></li>
                  {/* <li><a onClick={ this.addTripArrivalBlock }>Add Trip Arrival</a></li>*/}
                </Dropdown>
              </div>)
            }
          </div>
        </div>
        <div className={cx('col', 's10')} style={{ position: 'relative', height: `${slot_upper_div_height}`, left: '5px', borderBottom: '1px solid rgb(212, 212, 212)', width: '156%' }} >
          <Slot
            // width={200}
            height={105}
            isInPlacement
            preSelectionActionTour={this.changeTourModalState.bind(null, true)}
            activeServiceBookingKey={this.props.activeServiceBookingKey}
            tripKey={this.props.viewer.trips._key}
            cityDayKey={this.props.day._key}
            cityBookingKey={this.props.cityBooking._key}
            services={this.state.services}
            unavailableSlots={this.state.unavailableSlots}
            meals={this.props.day.timeSlots}
            activeDetail={this.props.activeDetail}
            changeRemoveModalState={this.changeRemoveModalState}
            changeModalState={this.changeTourModalState}
            type='placement'
            days={this.props.days}
            transfer_serviceBookings={this.props.transfer_serviceBookings}
            updateLocalTransfer={(data) => {
              this.props.openLocalTransferModal({
                cityCode,
                dayId,
                remove_transferPlacementKey: data.transferPlacementKey,
                change_opted_transfer_key: data.transfer_key
              });
            }}
            countryBooking={this.props.countryBooking}
            cityCode={cityCode}
            isTaView={this.props.isTaView}
            handleSaveMeal={(mealOrder, mealType, mealNote) => this.handleSaveMeal(mealOrder, mealType, mealNote)}
            preselections={this.props.day.preselections}
            defaultTours={this.props.cityBooking.defaultTours}
          />
        </div>

        {tourModal}
        {accommodationModal}
        {
          this.state.isRemoveModalOpened ?
            <Modal actionButton={removeButton} isModalOpened={this.state.isRemoveModalOpened} changeModalState={this.changeRemoveModalState}>
              <h3>Remove { this.removedTour.placeholder ? 'placeholder' : 'tour'}</h3>
              <span>This action will remove this { this.removedTour.placeholder ? 'placeholder' : 'tour'} and cannot be undone. Do you wish to continue?</span>
            </Modal>
            : null
        }
      </div>
    );
  }
}
