import React, { Component, PropTypes } from 'react';
import Relay from 'react-relay';
import cx from 'classnames';
import PubSub from 'pubsub-js';
import _ from 'lodash';
import moment from 'moment';
import ReactTooltip from 'react-tooltip';
import Day from '../containers/Day';
import { Modal, Card, Dropdown, Select, Select2 } from '../../Utils/components';
import AddCityDayMutation from '../mutations/AddCityDay';
import RemoveCityDayMutation from '../mutations/RemoveCityDay';
import AccommodationCanvas from '../../Accommodation/containers/AccommodationCanvas';
import Transfer from '../../Transfer/renderers/TransferRenderer';
import BookServicesMutation from '../mutations/BookServices';
import CancelServiceMutation from '../mutations/CancelServices';
import ServicesAvailabilityCheckingMutation from '../../ServiceBooking/mutations/ServicesAvailability';
// added for transfer modal
import TransferModal from '../../Transfer/renderers/TransferModalRenderer';
import RemoveLocalTransfer from '../../Transfer/mutations/RemoveLocalTransfer';
import UpdateAccommodationPlacementMutation from '../../Accommodation/mutations/Update';
import SERVICES from '../../../services';
import styles from '../city.module.scss';

export default class City extends Component {
  /**
   * Setup height and width of a rendered hotel
   */
  static configuration = {
    HEIGHT: 300
  };

  static propTypes = {
    viewer: PropTypes.object.isRequired,
    countryIndex: PropTypes.number.isRequired,
    index: PropTypes.number.isRequired,
    country: PropTypes.object.isRequired,
    city: PropTypes.object.isRequired,
    handleAddCity: PropTypes.func.isRequired,
    handleRemoveCity: PropTypes.func.isRequired,
    handleUpdateCity: PropTypes.func.isRequired,
    cities: PropTypes.array.isRequired,
    activeDetail: PropTypes.object,
    activeServiceBookingKey: PropTypes.string,
    relay: PropTypes.object,
    isTaView: React.PropTypes.bool
  };

  state = {
    optedDayIdForLocalTransfer: false,
    optedCityForLocalTransfer: false,
    isLocalTransferModalOpened: false,
    isModalOpened: false,
    transfer_serviceBookings: false, // added for kepp data comes after saving transfer
    remove_local_transferPlacementKey: false, // whenever a local transfer will be change, thi will have the existing local transfer key which will be removed
    localtransfer_change_opted_transfer_key: false, // whenever a local tranfer is change need show the existing local transfer in green div, this have the key of transfer
    isBookModalOpened: false,
    isCancelBookModalOpened: false,
    isAvailabilityModalOpened: false,
    isTest: false,
    count_total_booked_services: 0,
    count_total_on_request_services: 0,
    totalMissingMeals: 0,
    accommodationDates: [],
    proposalKey: ''
  };

  componentWillMount() {
    this.init();
  }

  componentWillUpdate(nextProps) {
    this.props = nextProps;
    this.init();
  }

  componentWillReceiveProps(nextProps) {
    // start city status/count of services
    const accommodationDates = [];
    this.props.city.accommodationPlacements.map((acc) => { // eslint-disable-line array-callback-return
      acc.serviceBookings.map((cc) => { // eslint-disable-line array-callback-return
        if (cc.status && cc.status.state === 'Booked') {
          accommodationDates.push(acc.startDate);
          _.times(acc.durationNights, (i) => {
            accommodationDates.push(moment(acc.startDate).add((i + 1), 'day').format('YYYY-MM-DD'));
          });
        }
      });
    });
    this.setState({ accommodationDates });
    let total_booked_services = 0;
    let total_on_request_services = 0;
    let hotel_booked = 0;
    let hotel_on_request = 0;
    if (nextProps.city && nextProps.city.accommodationPlacements) {
      nextProps.city.accommodationPlacements.map((h, hi) => { // eslint-disable-line array-callback-return
        if (h.serviceBookings) {
          h.serviceBookings.map((hh, hhi) => { // eslint-disable-line array-callback-return
            let check_status = '';
            if (hh.status && hh.status.state) {
              check_status = hh.status.state;
            } else {
              check_status = hh.status;
            }
            if (check_status === 'Booked') {
              hotel_booked += 1;
            } else if (check_status === 'On Request') {
              hotel_on_request += 1;
            }
          });
        }
      });
    }
    // counts of transfers and tours which are booked and on requests
    if (nextProps.city.cityDays && nextProps.city.cityDays.length > 0) {
      nextProps.city.cityDays.map((day, idx) => { // eslint-disable-line array-callback-return
        if (day.serviceBookings && day.serviceBookings.length > 0) {
          day.serviceBookings.map((v, k) => { // eslint-disable-line array-callback-return
            if (v.status && v.status.state) {
              if (v.status.state === 'Booked') {
                total_booked_services += 1;
              } else if (v.status.state === 'On Request') {
                total_on_request_services += 1;
              }
            }
          });
        }
      });
    }
    total_booked_services += hotel_booked;
    total_on_request_services += hotel_on_request;

    const totalMissingMeals = !nextProps.city.cityDays ? 0
      : _.sumBy(nextProps.city.cityDays, cityDay => _.sumBy(cityDay.timeSlots, timeSlot => timeSlot.meal.type === 'No meal arranged' ? 1 : 0)); // eslint-disable-line no-confusing-arrow
    // end city status/count of services
    this.setState({
      count_total_booked_services: total_booked_services,
      count_total_on_request_services: total_on_request_services,
      totalMissingMeals,
      proposalKey: nextProps.viewer.proposal._key
    });
  }


  accUpdate = (cityKey, duration, date, day, accKey) => {
    Relay.Store.commitUpdate(new UpdateAccommodationPlacementMutation({
      cityBookingKey: cityKey,
      durationNights: duration,
      startDay: day,
      startDate: date,
      accommodationPlacementKey: accKey,
      action: 'update'
    }), {
      onSuccess: () => {
            // PubSub.publish('Infobox', dd_infoboxData);
        this.props.relay.forceFetch();
        PubSub.publish('TripForceFetch', {});
            // PubSub.publish('Infobox', d_infoboxData);
      },
      onFailure: () => {
            // PubSub.publish('Infobox', dd_infoboxData);
        this.props.relay.forceFetch();
        PubSub.publish('TripForceFetch', {});
            // PubSub.publish('Infobox', d_infoboxData);
      }
    }
    );
  }

  addDay = (index, date) => {
    let test = false;
    let cityKey;
    let duration;
    let startDate;
    let day;
    let accKey;
    this.props.city.accommodationPlacements.map((acc) => { // eslint-disable-line array-callback-return
      _.times(acc.durationNights + 1, (i) => {
        if (moment(acc.startDate).add((i), 'day').format('YYYY-MM-DD') === date) {
          Relay.Store.commitUpdate(new AddCityDayMutation({
            cityBookingKey: this.props.city._key,
            dayIndex: index,
            id: this.props.city.id,
            cityBooking: null
          }), {
            onSuccess: () => {
              PubSub.publish('TripForceFetch', {});
            }
          });

          cityKey = this.props.city._key;
          duration = acc.durationNights + 1;
          startDate = acc.startDate;
          day = acc.startDay;
          accKey = acc._key;
            // this.accUpdate(this.props.city._key,(acc.durationNights + 1),acc.startDate,acc.startDay,acc._key);

          test = true;
        }
      });
    });
    if (!test) {
      Relay.Store.commitUpdate(new AddCityDayMutation({
        cityBookingKey: this.props.city._key,
        dayIndex: index,
        id: this.props.city.id,
        cityBooking: null
      }), {
        onSuccess: () => {
          PubSub.publish('TripForceFetch', {});
        }
      });
    } else {
      this.accUpdate(cityKey, duration, startDate, day, accKey);
    }
  };

  addedCityIndex = undefined;

  addedCityOrder = undefined;

  changeLocalTransferModalState = (isOpen) => {
    this.setState({ isLocalTransferModalOpened: isOpen });
  };

  changeModalState = (isOpen, addedIndex, addedOrder) => {
    this.setState({ isModalOpened: isOpen });

    // Specify whether index from order
    if (addedOrder === 'after') {
      this.addedCityIndex = addedIndex + 1;
    } else if (addedOrder === 'before') {
      this.addedCityIndex = addedIndex;
    }

    this.addedCityOrder = addedOrder;
  };

  filterHotel() {
    this.data.hotels = _.filter(this.props.city.serviceBookings, service => service.type === 'hotel');
  }

  handleAddCity = () => {
    this.props.handleAddCity(this.props.countryIndex, this.selectedCities, this.addedCityOrder, this.addedCityIndex, this.props.country._key);
    this.selectedCities = [];
  };

  handleOnChangeCity = (e) => {
    this.selectedCities = [...e.target.options].filter(city => city.selected).map(city => city.value);
  };

  init() {
    // Save number of rendered hotels in a city
    this.numberOfExistingHotelsInCity = 0;

    // Cities
    this.selectedCities = [];

    this.data = {
      days: {},
      hotels: []
    };
    // this.groupActivitiesByDay();
    this.filterHotel();
  }

  removeDay = (props) => {
    let test = false;
    this.props.city.accommodationPlacements.map((acc) => { // eslint-disable-line array-callback-return
      _.times(acc.durationNights + 1, (i) => {
        if (moment(acc.startDate).add((i), 'day').format('YYYY-MM-DD') === props.day.startDate) {
          if (acc.durationNights > 1) {
            Relay.Store.commitUpdate(new UpdateAccommodationPlacementMutation({
              cityBookingKey: props.cityBooking._key,
              durationNights: acc.durationNights - 1,
              startDay: acc.startDay,
              startDate: acc.startDate,
              accommodationPlacementKey: acc._key,
              action: 'update'
            })
                , {
                  onSuccess: () => {
                    // PubSub.publish('Infobox', dd_infoboxData);
                    this.props.relay.forceFetch();
                    PubSub.publish('TripForceFetch', {});
                    // PubSub.publish('Infobox', d_infoboxData);
                  },
                  onFailure: () => {
                    // PubSub.publish('Infobox', dd_infoboxData);
                    this.props.relay.forceFetch();
                    PubSub.publish('TripForceFetch', {});
                    // PubSub.publish('Infobox', d_infoboxData);
                  }
                }
                );

            Relay.Store.commitUpdate(new RemoveCityDayMutation({
              cityDayKey: props.day._key,
              id: this.props.city.id,
              cityBooking: null
            }), {
              onSuccess: () => {
                PubSub.publish('TripForceFetch', {});
              }
            });
            test = true;
          } else {
            test = true;
            this.setState({ isTest: true });
          }
        }
      });
    });
    if (!test) {
      Relay.Store.commitUpdate(new RemoveCityDayMutation({
        cityDayKey: props.day._key,
        id: this.props.city.id,
        cityBooking: null
      }), {
        onSuccess: () => {
          PubSub.publish('TripForceFetch', {});
        }
      });
    }
  };

  handleCancelServices = () => {
    Relay.Store.commitUpdate(new CancelServiceMutation({
      cityBookingKey: this.props.city._key
    }), {
      onSuccess: () => {
        PubSub.publish('TripForceFetch');
      }
    });
  };

  handleBookingServices = () => {
    Relay.Store.commitUpdate(new BookServicesMutation({
      cityBookingKey: this.props.city._key
    }), {
      onSuccess: () => {
        PubSub.publish('TripForceFetch');
      }
    });
  };

  handleCheckServicesAvailability = () => {
    Relay.Store.commitUpdate(new ServicesAvailabilityCheckingMutation({
      startNodeId: `cityBookings/${this.props.city._key}`
    }), {
      onSuccess: (res) => {
        PubSub.publish('TripForceFetch', {});
      },
      onFailure: (err) => {
        console.log('CheckServicesAvailability Error:', err);
      }
    });
  };

  changeBookModalState = (isOpen) => {
    this.setState({ isBookModalOpened: isOpen });
  };

  changeCancelBookModalState = (isOpen) => {
    this.setState({ isCancelBookModalOpened: isOpen });
  };

  changeAvailabilityModalState = (isOpen) => {
    this.setState({ isAvailabilityModalOpened: isOpen });
  }
  changeTest = (isOpen) => {
    this.setState({ isTest: isOpen });
  }

  clearCityItinerary = () => {
    // remove tours and transfers
    if (this.props.city.cityDays && this.props.city.cityDays.length > 0) {
      this.props.city.cityDays.map((cityDay, i) => { // eslint-disable-line array-callback-return
        if (cityDay.serviceBookings.length > 0) {
          cityDay.serviceBookings.map((cityDayServiceBookings, j) => { // eslint-disable-line array-callback-return
            if (cityDayServiceBookings.status !== 'Booked') {
              const serviceBookingKey = cityDayServiceBookings._key;
              Relay.Store.commitUpdate(new RemoveLocalTransfer({
                transferPlacementKey: serviceBookingKey
              }), {
                // onSuccess: response => this.props.onSuccessClearTransfer(true, response),
                // onFailure: response => this.props.onFailureClearTransfer(false, response)
              });
            }
          });
        }
      });
    }

    // remove hotel
    if (this.props.city.accommodationPlacements && this.props.city.accommodationPlacements.length > 0) {
      this.props.city.accommodationPlacements.map((accommodationPlacement, i) => { // eslint-disable-line array-callback-return
        Relay.Store.commitUpdate(new UpdateAccommodationPlacementMutation({
          action: 'Delete',
          accommodationPlacementKey: accommodationPlacement._key,
          cityBookingKey: this.props.city._key
        }));
      });
    }
    PubSub.publish('TripForceFetch', {});
  }

  render() {
    let dayLabelHide = false;
    // show/hide day and date label
    // if (this.props.index > 0) {
    if (this.props.city.transferPlacements && this.props.city.transferPlacements.serviceBookings && this.props.city.transferPlacements.serviceBookings.length === 0) {
      dayLabelHide = true;
    }
    if (this.props.city.transferPlacements && this.props.city.transferPlacements.durationDays) {
      if (this.props.city.transferPlacements.durationDays < 2) {
        dayLabelHide = true;
      }
    }
    // }
    // if (!this.props.city.transferPlacements.durationDays || this.props.city.transferPlacements.durationDays) {
    //   dayLabelHide = false;
    // }
    // /////////////////////////////
    const handleBookingServices = this.handleBookingServices;
    const handleCancelServices = this.handleCancelServices;
    const handleCheckServicesAvailability = this.handleCheckServicesAvailability;
    const bookCityButton = <a className='modal-action modal-close waves-effect waves-green btn' onClick={handleBookingServices}><i className='mdi-editor-attach-money left' />Book City</a>;
    const cancelBookButton = <a className='modal-action modal-close waves-effect btn red' onClick={handleCancelServices}><i className='mdi-editor-attach-money left' />Cancel Booking</a>;
    const checkCityButton = <a className='modal-action modal-close waves-effect waves-green btn' onClick={handleCheckServicesAvailability}><i className='mdi-editor-attach-money left' />Check availability</a>;
    const checkTest = <a className='modal-action modal-close waves-effect waves-green btn' >OK</a>;
    // Calculate WIDTH each hotel block
    City.configuration.WIDTH = `100% / ${this.data.hotels.length}`;

    let hasBookedService = false;
    if (this.props.city.cityDays && this.props.city.cityDays.length > 0) {
      this.props.city.cityDays.map((cityDay, i) => { // eslint-disable-line array-callback-return
        if (cityDay.serviceBookings.length > 0) {
          cityDay.serviceBookings.map((cityDayServiceBookings, j) => { // eslint-disable-line array-callback-return
            if (cityDayServiceBookings.status === 'Booked') {
              hasBookedService = true;
            }
          });
        }
      });
    }

    // remove hotel
    if (this.props.city.accommodationPlacements && this.props.city.accommodationPlacements.length > 0) {
      this.props.city.accommodationPlacements.map((accommodationPlacement, i) => { // eslint-disable-line array-callback-return
        if (accommodationPlacement.serviceBookings.length > 0) {
          accommodationPlacement.serviceBookings.map((accommodationServiceBooking, j) => { // eslint-disable-line array-callback-return
            if (accommodationServiceBooking.status === 'Booked') {
              hasBookedService = true;
            }
          });
        }
      });
    }

    const btnClearItinerary = hasBookedService ?
      <a disabled href='#!'>Clear city itinerary not - Crowdbotics</a>
      : <a onClick={this.clearCityItinerary} href='#!'>Clear city itinerary</a>;

    const days = this.props.city.cityDays.map((day, idx) =>
      (<Day
        openLocalTransferModal={(localTransferInfo) => {
          const cityCode = localTransferInfo.cityCode;
          const dayId = localTransferInfo.dayId;
          const remove_transferPlacementKey = localTransferInfo.remove_transferPlacementKey;
          const change_opted_transfer_key = localTransferInfo.change_opted_transfer_key;

          this.setState({
            optedDayIdForLocalTransfer: dayId,
            optedCityForLocalTransfer: cityCode,
            isLocalTransferModalOpened: true,
            remove_local_transferPlacementKey: remove_transferPlacementKey,
            localtransfer_change_opted_transfer_key: change_opted_transfer_key
          });
        }}
        key={day.__dataID__}
        index={this.props.index}
        accommodationDates={this.state.accommodationDates}
        countryIndex={this.props.countryIndex}
        viewer={this.props.viewer}
        activeDetail={this.props.activeDetail}
        day={this.props.city.cityDays[idx]}
        handleRemoveDay={this.removeDay}
        countryIndex={this.props.countryIndex}
        countryBooking={this.props.country}
        cityIndex={this.props.index}
        dayIndex={idx}
        dayLabelHide={dayLabelHide}
        cityBooking={this.props.city}
        handleAddDay={this.addDay}
        serviceBookings={this.props.city.serviceBookings}
        days={this.props.city.cityDays}
        activeServiceBookingKey={this.props.activeServiceBookingKey}
        transfer_serviceBookings={this.state.transfer_serviceBookings}
        isTaView={this.props.isTaView}
      />));

    const actionButton = <a className='modal-action modal-close waves-effect waves-green btn' onClick={this.handleAddCity}><i className='mdi-action-input left' />Add</a>;
    const triggerButton = <a><i className={cx('mdi-navigation-more-vert', styles.actionMenu)} style={{ fontSize: '1.4em' }} /></a>;

    const hotels =
      (<AccommodationCanvas
        viewer={this.props.viewer}
        totalDays={this.props.city.cityDays.length}
        cityDays={this.props.city.cityDays}
        accommodationPlacements={this.props.city.accommodationPlacements}
        activeDetail={this.props.activeDetail}
        cityBookingId={this.props.city.id}
        cityBookingKey={this.props.city._key}
        activeServiceBookingKey={this.props.activeServiceBookingKey}
        country={this.props.country}
        cityCode={this.props.city.location.tpCode}
        isTaView={this.props.isTaView}
        cityStartDay={this.props.city.cityDays[0].startDay}
      />);

    const total_pax_errors = 0;

    let aggregated_total_booked_services = '';
    if (this.state.count_total_booked_services > 0) {
      aggregated_total_booked_services = <span><i className='mdi mdi-cash-usd' style={{ marginLeft: '23px' }} /> {this.state.count_total_booked_services}</span>;
    }

    let aggregated_total_on_request_services = '';
    if (this.state.count_total_on_request_services > 0) {
      aggregated_total_on_request_services = <span><i className='mdi mdi-calendar-blank' style={{ marginLeft: '20px', color: '#f2ac17' }} /> {this.state.count_total_on_request_services}</span>;
    }
    const toolTip = 'Action unavailable before active product booking.';

    const cityTitle = [
      <div className='row m-0' key='1' style={{ width: '100%', float: 'left' }}>
        <div className={cx('col p-0', { s7: !SERVICES.isSideNavOpen }, { s7: SERVICES.isSideNavOpen })}>
          <p key='4' className='left m-0 light' style={{ fontSize: '10px' }}><span style={{ fontSize: '15px', fontWeight: 'bold' }}>{this.props.city.cityCode}</span> <br /> {this.props.city.durationDays} Days {this.props.city.cityDays.length - 1} nights</p>
        </div>
        <div className={cx('col p-0', { s5: !SERVICES.isSideNavOpen }, { s5: SERVICES.isSideNavOpen })}>
          <div className='row m-0' >
            <div className='col s3 p-0' style={{ textAlign: 'center', fontSize: '15px', marginTop: '2px' }}>
              {/* <i className='mdi mdi-account' style={{'color':'#d51224'}}/> {total_pax_errors}*/}
              <span><i className='mdi mdi-silverware-variant' style={{ marginLeft: '10px', color: '#eea400' }} /> {this.state.totalMissingMeals}</span>
            </div>
            <div className='col s3 p-0' style={{ textAlign: 'center', fontSize: '15px', marginTop: '2px' }}>
              {aggregated_total_booked_services}
            </div>
            <div className='col s3 p-0' style={{ textAlign: 'center', marginTop: '2px', fontSize: '15px' }}>
              {aggregated_total_on_request_services}
            </div>
            <div className='col s2 p-0 pl-9' style={{ textAlign: 'center' }} >
              { this.props.isTaView ? null : (
                <Dropdown key='2' triggerButton={triggerButton}>
                  <li><a onClick={this.changeAvailabilityModalState.bind(this, true)}>Check availability</a></li>
                  <li><a onClick={this.changeBookModalState.bind(this, true)}>Book</a></li>
                  <li><a onClick={this.changeCancelBookModalState.bind(this, true)}>Cancel Bookings</a></li>
                  <li className='divider' />
                  <li><a onClick={this.changeModalState.bind(null, true, this.props.index, 'before')}>Add city before</a></li>
                  <li><a onClick={this.changeModalState.bind(null, true, this.props.index, 'after')}>Add city after</a></li>
                  <li className='divider' />
                  <li><a onClick={this.addDay.bind(null, this.props.city.cityDays.length)}>Add day</a></li>

                  {/* {(this.state.count_total_booked_services > 0) ?
                  <li><a data-tip={toolTip} style={{ color: '#8c8c8c' }} >Add city before</a></li>
                  :<li><a onClick={this.changeModalState.bind(null, true, this.props.index, 'before')}>Add city before</a></li>
                  }
                  {(this.state.count_total_booked_services > 0) ?
                  <li><a data-tip={toolTip} style={{ color: '#8c8c8c' }}>Add city after</a></li>
                  :<li><a onClick={this.changeModalState.bind(null, true, this.props.index, 'after')}>Add city after</a></li>
                  }
                  <li className='divider' />
                  {(this.state.count_total_booked_services > 0) ?
                  <li><a data-tip={toolTip} style={{ color: '#8c8c8c' }}>Add day</a></li>
                  :<li><a onClick={this.addDay.bind(null, this.props.city.cityDays.length)}>Add day</a></li>
                  } */}
                  {/*
                <li><a href='#!'>Add from template</a></li>
                <li><a href='#!'>Save as template</a></li>
              */}
                  <li className='divider' />
                  <li>{btnClearItinerary}</li>
                  <li><a onClick={this.props.handleRemoveCity.bind(null, this.props.country._key, this.props.countryIndex, this.props.city._key, this.props.index)}>Delete from itinerary</a></li>
                </Dropdown>)}
              <ReactTooltip />
            </div>
          </div>
        </div>
      </div>,
    ];

    const calculateHR = () => {
      const dayLength = days.length;
      const returnValue = [];
      for (let i = 1; i <= (dayLength * 2); i++) {
        const top = (i * 140) + 100 + (155 * Math.floor((i - 1) / 2));
        returnValue.push(<hr key={`${i}_dashed`} style={{ position: 'absolute', top: `${top}px`, width: '90%', left: '10%', overflow: 'hidden', borderBottom: '1px dashed #ccc', margin: 'auto' }} />);
      }
      for (let x = 1; x <= (dayLength); x++) {
        const top = (x * 435) + 95;
        returnValue.push(<hr key={`${x}_solid`} style={{ position: 'absolute', top: `${top}px`, width: '100%', left: '0%', overflow: 'hidden', borderBottom: '1px solid #ccc', margin: 'auto' }} />);
      }
      return returnValue;
    };

    const isActive = this.props.activeDetail && this.props.activeDetail.__dataID__ === this.props.city.__dataID__;
    if (!this.props.city.serviceBookings) {
      this.props.city.serviceBookings = [];
    }

    // start for transfer date - it will be the last date of the preceding city
    let transfer_start_date = '';
    if (this.props.city) {
      if (this.props.city.startDate) {
        transfer_start_date = this.props.city.startDate;
      } else if (this.props.city.cityDays && this.props.city.cityDays.length > 0) {
        const f_day = this.props.city.cityDays[0];
        if (f_day.startDate) {
          transfer_start_date = f_day.startDate;
        }
      }
      // transfer_start_date = moment(transfer_start_date).add('days', -1).format('YYYY-MM-DD');
      if (transfer_start_date !== '') {
        transfer_start_date = moment(transfer_start_date).add(-1, 'days').format('YYYY-MM-DD');
      }
    }

    const getLocalTransferStartDate = () => {
      let localTransferStartDate = '';
      if (this.state.optedDayIdForLocalTransfer && this.props.city && this.props.city.cityDays) {
        this.props.city.cityDays.map((ccd, ii) => { // eslint-disable-line array-callback-return
          if (ccd._key === this.state.optedDayIdForLocalTransfer) {
            localTransferStartDate = ccd.startDate;
          }
        });
      }
      return localTransferStartDate;
    };


    return (
      <div style={{ padding: '0px 13px 6px 40px' }}>
        {
          this.state.isLocalTransferModalOpened ?
            <TransferModal
              isLocalTransferModal
              proposalKey={this.state.proposalKey}
              isModalOpened={this.state.isLocalTransferModalOpened}
              changeModalState={this.changeLocalTransferModalState}
              transferPlacementId={this.props.city.transferPlacements.id}
              cityBookingId={this.props.city.id}
              selectedTransfers={this.props.city.serviceBookings.map((data) => {
                if (data.isPlaceholder) {
                  const passData = {};
                  passData.isPlaceholder = true;
                  passData.serviceBooking = { ...data };
                  passData._key = `sBK_${data._key}`;
                  return passData;
                }
                return data.transfer;
              })}
              origin={this.state.optedCityForLocalTransfer}
              destination={this.state.optedCityForLocalTransfer}
              dateFrom={getLocalTransferStartDate()}
              onSuccessSave={(response) => {
                PubSub.publish('Infobox', { type: 'clear' });
                PubSub.publish('TripForceFetch', {});
                // start show infoxbox when local transfer is added
                const d_infoboxData = {
                  cityBookingKey: this.props.city._key,
                  tpBookingRef: '',
                  transferPlacementId: response.updateTransferPlacement.transferPlacement._key,
                  type: 'localtransfer'
                };
                PubSub.publish('Infobox', d_infoboxData);
                // PubSub.publish('TripForceFetch', {});
                // end show infoxbox when local transfer is added
              }}
              onFailureSave={() => {
                PubSub.publish('Infobox', { type: 'clear' });
                PubSub.publish('TripForceFetch', {});
              }}
              optedDayIdForLocalTransfer={this.state.optedDayIdForLocalTransfer}
              remove_local_transferPlacementKey={this.state.remove_local_transferPlacementKey}
              localtransfer_change_opted_transfer_key={this.state.localtransfer_change_opted_transfer_key}
            /> : null
        }

        {
          this.props.city.transferPlacements && this.props.index !== 0 ?
            <Transfer
              isCityTransfer
              proposalKey={this.state.proposalKey}
              key={this.props.city.transferPlacements._key}
              cityBookingId={this.props.city.id}
              transferId={this.props.city.transferPlacements.id}
              transferPlacement={this.props.city.transferPlacements}
              isTaView={this.props.isTaView}
              transfer_start_date={transfer_start_date}
            /> : null
        }
        <div style={{ border: '1px solid rgb(212, 212, 212)' }}>
          <Card style={{ backgroundColor: '#f2f2f2' }} cityPanel noBoxShadow title={cityTitle} className='city' titleClassName={cx({ 'active-detail': isActive })} countryStyle >
            <div className='row m-0' style={{ fontSize: '11px', borderTop: '1px solid #d7d7d7', borderBottom: '1px solid #d7d7d7' }}>
              <div className='col s8 p-0 pr-20'>
                {days}
              </div>
              <div className='col s4 p-0 pr-10 pl-5' style={{ position: 'relative' }}>
                {hotels}
              </div>
            </div>
          </Card>
        </div>
        {
          this.state.isModalOpened ?
            <Modal style={{ width: '60%', overflowY: 'visible' }} actionButton={actionButton} isModalOpened={this.state.isModalOpened} changeModalState={this.changeModalState}>
              <h3>Add City</h3>
              <div className={styles.select}>
                {/* <Select value='Choose city' onChange={this.handleOnChangeCity}>
                  <option disabled >Choose city</option>
                  {this.props.cities.filter(c => c.country === this.props.country.location.tpCode).map((city, index) => <option key={index} value={city.name}>{city.name}</option>)}
                </Select> */}
                <Select2
                  value='choose City'
                  onChange={this.handleOnChangeCity.bind(this)}
                  data={this.props.cities.filter(c => c.country === this.props.country.location.tpCode).sort((a, b) => {
                    if (a.name < b.name) return -1;
                    if (a.name > b.name) return 1;
                    return 0;
                  }).map((obj, index) => ({ text: obj.name, id: obj.name }))}
                />
              </div>
            </Modal>
            : null
        }
        { /* BOOK TO TP */ }
        {
          this.state.isBookModalOpened ?
            <Modal actionButton={bookCityButton} isModalOpened={this.state.isBookModalOpened} changeModalState={this.changeBookModalState}>
              <h3>Book city services</h3>
              <span>This will book all services for </span>
              <h5>{this.props.city.cityCode}</h5>
              <span>After booking, cancellation and change fees may apply. Do you want to book all services?</span>
            </Modal>
            : null
        }
        {
          this.state.isCancelBookModalOpened ?
            <Modal actionButton={cancelBookButton} isModalOpened={this.state.isCancelBookModalOpened} changeModalState={this.changeCancelBookModalState}>
              <h3>Cancel city service bookings</h3>
              <span>This will cancel confirmed service bookings for </span>
              <h5>{this.props.city.cityCode}</h5>
              <span>Cancellation and change fees may apply. Do you want to cancel all services?</span>
            </Modal>
            : null
        }
        { /* CHECK AVAILABILITY */ }
        {
          this.state.isAvailabilityModalOpened ?
            <Modal actionButton={checkCityButton} isModalOpened={this.state.isAvailabilityModalOpened} changeModalState={this.changeAvailabilityModalState}>
              <h3>Check availability for city services</h3>
              <span>This will check all services for </span>
              <h5>{this.props.city.cityCode}</h5>
              <span>Do you want to check all services?</span>
            </Modal>
            : null
        }
        {
          this.state.isTest ?
            <Modal isModalOpened={this.state.isTest} changeModalState={this.changeTest}>
              <h5>Can not Remove this day as hotel placement duation night will be less then one...!!!!!</h5>
            </Modal>
            : null
        }
        <ReactTooltip />
      </div>
    );
  }
}
