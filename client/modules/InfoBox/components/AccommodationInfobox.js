import React, { Component, PropTypes } from 'react';
import Relay from 'react-relay';
import { FaCalendarTimesO } from 'react-icons/lib/fa';
import PubSub from 'pubsub-js';
import moment from 'moment';
import cx from 'classnames';
import { Select, Tab, Modal, DateRangePicker } from '../../Utils/components';
import Detail from './Detail';
import BookServiceMutation from '../../ServiceBooking/mutations/BookServices';
import ServiceAvailabilityMutation from '../../ServiceBooking/mutations/ServiceAvailability';
import CancelBookingMutation from '../../ServiceBooking/mutations/CancelBookings';
import ChangeServiceDayMutation from '../mutations/ChangeServiceDay';
import AccommodationConfigure from './AccommodationConfigure';
import AccommodationInfo from './AccommodationInfo';
import styles from '../style.module.scss';
import Map from './Map';
import { getUserRole } from '../../../services/user';
import UpdateAccommodationPlacementMutation from '../../Accommodation/mutations/Update';
import AddCityDayMutation from '../../City/mutations/AddCityDay';
import SERVICES from '../../../services';
import UpdateServiceMutation from '../../ServiceBooking/mutations/UpdateService';


export default class AccommodationInfobox extends Component {
  static propTypes = {
    viewer: PropTypes.object.isRequired,
    relay: PropTypes.object,
    handleOpenDetailModal: PropTypes.func,
    tripKey: PropTypes.string,
    paxs: PropTypes.array,
    cityBookingKey: PropTypes.string
  };

  state = {
    startDate: '',
    endDate: '',
    durationNights: '',
    serviceBookingDetail: this.props.viewer.accommodationPlacement.serviceBookings[0],
    roomCategoryNumber: 0,
    serviceStatus: this.props.viewer.accommodationPlacement.serviceBookings[0].status ? this.props.viewer.accommodationPlacement.serviceBookings[0].status.state : '',
    userRole: getUserRole(),
    isChangeDateModalOpended: false,
    hasPaxErrors: 0,
    isHotelBooked: false,
    disableCheck: false,
    disableBook: false,
    totalCityDays: ''
  };

  componentWillReceiveProps(nextProps) {
    // PubSub.subscribe('totalCityDays', (msg, data) => {
    //   this.setState({ totalCityDays: data });
    // });
    let flagdisableCheck = false;
    let flagdisableBook = false;
    let flagIsHotelBooked = true;
    let paxErrorsCount = 0;
    const setting = {
      serviceBookingDetail: this.props.viewer.accommodationPlacement.serviceBookings[0],
      serviceStatus: '',
      startDate: '',
      durationNights: '',
      endDate: '',
      isHotelBooked: false
    };
    if (nextProps.viewer.accommodationPlacement._key !== this.props.viewer.accommodationPlacement._key) {
      setting.serviceBookingDetail = nextProps.viewer.accommodationPlacement.serviceBookings[0];
      setting.roomCategoryNumber = 0;
    } else {
      setting.serviceBookingDetail = nextProps.viewer.accommodationPlacement.serviceBookings[this.state.roomCategoryNumber];
    }

    let booked = false;
    for (let i = 0; i < nextProps.viewer.accommodationPlacement.serviceBookings.length; i++) {
      const seviceBooking = nextProps.viewer.accommodationPlacement.serviceBookings[i];
      if (seviceBooking.status && seviceBooking.status.state && seviceBooking.status.state === 'Booked') { // eslint-disable-line no-empty

      } else {
        flagIsHotelBooked = false;
      }
      if (nextProps.viewer.accommodationPlacement.serviceBookings[i].status && booked) {
        booked = nextProps.viewer.accommodationPlacement.serviceBookings[i].status.state === 'Booked';
      }
      // start identify pax error or not
      if (nextProps.viewer.accommodationPlacement.serviceBookings[i].roomConfigs && nextProps.viewer.accommodationPlacement.serviceBookings[i].roomConfigs.length > 0) {
        _.map(nextProps.viewer.accommodationPlacement.serviceBookings[i].roomConfigs, (roomConfig) => { // eslint-disable-line no-loop-func
          if (roomConfig.paxs && roomConfig.paxs.length === 0) {
            paxErrorsCount++;
          }
        });
      } else {
        flagdisableCheck = true;
        flagdisableBook = true;
      }

      // for hotels Book should be enable if hotel is in available status and if at least one room exists with pax assigned to it
      if (!nextProps.viewer.accommodationPlacement.serviceBookings[i].status || nextProps.viewer.accommodationPlacement.serviceBookings[i].status.state !== 'Available') {
        flagdisableBook = true;
      }

      // end  identify pax error or not
    }
    setting.serviceStatus = booked ? 'Booked' : '';
    setting.isHotelBooked = flagIsHotelBooked;
    setting.disableCheck = flagdisableCheck;
    setting.disableBook = flagdisableBook;


    if (nextProps.viewer.accommodationPlacement && nextProps.viewer.accommodationPlacement.startDate) {
      if (nextProps.viewer.accommodationPlacement.startDate) {
        setting.startDate = nextProps.viewer.accommodationPlacement.startDate;
      }
      if (nextProps.viewer.accommodationPlacement.durationNights) {
        setting.durationNights = nextProps.viewer.accommodationPlacement.durationNights;
        setting.endDate = moment(setting.startDate, 'YYYY-MM-DD').add(setting.durationNights, 'days').format('YYYY-MM-DD');
      }
    }
    setting.hasPaxErrors = paxErrorsCount;
    this.setState(setting);
  }

  handleCheckHotelAvailability = () => {
    // const name = 'status';
    // const value = 'Available';
    for (let i = 0; i < this.props.viewer.accommodationPlacement.serviceBookings.length; i++) {
      const serviceBookingId = this.props.viewer.accommodationPlacement.serviceBookings[i].id;
      const serviceBookingKey = this.props.viewer.accommodationPlacement.serviceBookings[i]._key;
      // Relay.Store.commitUpdate(new UpdateServiceMutation({
      //   serviceBookingId,
      //   serviceBookingKey,
      //   patchData: {
      //     [name]: {
      //       tpBookingStatus: value,
      //       state: value
      //     }
      //   }
      // }));

      Relay.Store.commitUpdate(new ServiceAvailabilityMutation({
        serviceBooking: this.props.viewer.accommodationPlacement.serviceBookings[i]
      }), {
        onSuccess: (res) => {
          PubSub.publish('TripForceFetch');
        }
      });
    }


    // const service = this.props.viewer.accommodationPlacement;
    // this.props.relay.setVariables({
    //   country: 'thailand',
    //   productId: service.tour.productId.toString(),
    //   date: '2016-08-25',
    //   nrOfAdults: this.props.nrPaxs.nrOfAdults,
    //   nrOfChildren: this.props.nrPaxs.nrOfChildren,
    //   nrOfInfants: this.props.nrPaxs.nrOfInfants,
    //   hasQuery: true
    // });
  };

  changeDay = (e) => {
    const daySlot = e.target.value;
    Relay.Store.commitUpdate(new ChangeServiceDayMutation({
      serviceBookingKey: this.props.viewer.accommodationPlacement._key,
      cityDayKey: this.props.viewer.accommodationPlacement.cityDayKey,
      cityBookingID: this.props.viewer.accommodationPlacement.cityBookingId,
      startSlot: daySlot,
      cityBooking: null
    }));
  };

  cancelBookings = () => {
    Relay.Store.commitUpdate(new CancelBookingMutation({
      serviceBookings: this.props.viewer.accommodationPlacement.serviceBookings
    }), {
      onSuccess: () => {
        PubSub.publish('TripForceFetch');
      }
    });
  };

  bookServices = () => {
    Relay.Store.commitUpdate(new BookServiceMutation({
      serviceBookings: this.props.viewer.accommodationPlacement.serviceBookings
    }), {
      onSuccess: () => {
        PubSub.publish('TripForceFetch');
      }
    });
  };

  _priceFormat = (showPrice) => { // eslint-disable-line consistent-return
    let finalPrice = '';
    const arr = showPrice.toString().split('');
    _.times(arr.length, (i) => {
      finalPrice += arr[i];
      if ((arr.length - i - 1) % 3 === 0 && i < arr.length - 1) finalPrice += ',';
    });
    return finalPrice;
  }

  _getRoomCategoryStatus = (obj) => { // eslint-disable-line consistent-return
    if (obj.status && obj.status.state) {
      switch (obj.status.state) {
        case 'Available' :
          return (<i className='mdi mdi-calendar-check' />);
        case 'Unavailable' :
          return (<i className='mdi mdi-calendar-remove exo-colors-text text-error-front' />);
        case 'On Request' :
          return (<i className='mdi mdi-calendar-blank exo-colors-text text-accent-4' />);
        case 'Booked' :
          return (<i className='mdi mdi-cash-usd' />);
        default:
          return (<span>--</span>);
      }
    } else {
      return (
        <span />
      );
    }
  }

  _getPaxStatus = (accommodationPlacement) => {
    let hasPaxErrors = false;
    if (accommodationPlacement.roomConfigs.length > 0) {
      accommodationPlacement.roomConfigs.map((roomConfigs) => { // eslint-disable-line array-callback-return
        // roomConfigs.paxs.map((paxs) => { // eslint-disable-line array-callback-return
        //   if (paxs.paxError && paxs.paxError.length > 0) {
        //     hasPaxErrors = true;
        //   }
        // });
        if (roomConfigs.paxs && roomConfigs.paxs.length === 0) {
          hasPaxErrors = true;
        }
      });
    }

    if (hasPaxErrors === true) {
      return <i className='mdi mdi-account-alert' style={{ color: '#ffb340' }} />;
    }
    return '';
    // if (accommodationPlacement.paxStatuses && accommodationPlacement.paxStatuses.length > 0) {
    //   return <i className='mdi mdi-account' style={{ color: '#d51224' }} />;
    // }
    // return '';
  }


  changeDateChangeModalState = (isOpen, addedIndex, addedOrder) => {
    this.setState({ isChangeDateModalOpended: isOpen });
  };

  onDateChange = (startDate, endDate) => {
    const { viewer, cityBookingKey } = this.props;
    const previousStartDate = this.props.viewer.accommodationPlacement.startDate;
    const previousNumNights = this.props.viewer.accommodationPlacement.durationNights;
    let newDaysToAddCount = 0;
    const lastDayOfCity = (this.props.cityDays && this.props.cityDays.length > 0) ? this.props.cityDays[this.props.cityDays.length - 1].startDate : null;
    let finalSaveStartDay = this.props.viewer.accommodationPlacement.startDay;
    let new_start_date = moment(startDate).format('YYYY-MM-DD');
    if (previousStartDate !== new_start_date) {
      // change startDay if dates are not same
      const diff_in_dates_in_days = moment(new_start_date).diff(moment(previousStartDate), 'days');
      if (diff_in_dates_in_days > 0) {
        finalSaveStartDay += diff_in_dates_in_days;
      } else if (diff_in_dates_in_days < 0) {
        const testDay = moment(previousStartDate).diff(moment(new_start_date), 'days');
        finalSaveStartDay -= testDay;
      }
    }
    const previousEndDate = moment(previousStartDate, 'YYYY-MM-DD').add(previousNumNights, 'days').format('YYYY-MM-DD');
    let newEndDate = moment(endDate).format('YYYY-MM-DD');
    let diffInPreviousNewEndDate = moment(newEndDate).diff(moment(previousEndDate), 'days');
    // console.log(previousStartDate,previousNumNights,finalSaveStartDay,new_start_date,previousEndDate,newEndDate,diffInPreviousNewEndDate);
    const dd_infoboxData = {
      // accommodationPlacementKey: this.props.accommodationPlacementKey,
      // cityBookingKey: this.props.cityBookingKey,
      // serviceBookingKey: this.props.infoBoxData.serviceBookingKey,
      // tpBookingRef: '',
      type: 'clear'
    };
    if (this.props.cityDays && this.props.cityDays.length > 0) {
      if (finalSaveStartDay < (this.props.cityDays && this.props.cityDays[0].startDay)) {
        finalSaveStartDay = this.props.cityDays && this.props.cityDays[0].startDay;
        new_start_date = this.props.cityDays && this.props.cityDays[0].startDate;
        newEndDate = moment(startDate, 'YYYY-MM-DD').add(1, 'days').format('YYYY-MM-DD');
      }
    }

    const diffInAccStartCityEndDates = moment(lastDayOfCity).diff(moment(startDate), 'days');
    const d_infoboxData = {
      accommodationPlacementKey: this.props.accommodationPlacementKey,
      cityBookingKey: this.props.cityBookingKey,
      serviceBookingKey: this.props.infoBoxData.serviceBookingKey,
      tpBookingRef: '',
      type: 'accommodation'
    };
    const durationNights = moment(endDate).diff(moment(startDate), 'days');
    diffInPreviousNewEndDate = 0;
    if (diffInAccStartCityEndDates < durationNights) {
      diffInPreviousNewEndDate = durationNights - diffInAccStartCityEndDates;
    } else {
      diffInPreviousNewEndDate = 0;
    }

    if (diffInPreviousNewEndDate > 0) {
      newDaysToAddCount = diffInPreviousNewEndDate;
      _.times(newDaysToAddCount, () => {
        Relay.Store.commitUpdate(new AddCityDayMutation({
          cityBookingKey,
          dayIndex: viewer.accommodationPlacement.startDay,
          cityBooking: null
        }));
      });
    }

    Relay.Store.commitUpdate(new UpdateAccommodationPlacementMutation({
      cityBookingKey: this.props.cityBookingKey,
      durationNights,
      startDay: finalSaveStartDay,
      startDate: new_start_date,
      selectedAccommodationKeys: null,
      preselectedAccommodationKeys: null,
      placeholders: null,
      accommodationPlacementKey: this.props.accommodationPlacementKey,
      action: 'Update'
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

    this.setState({ isChangeDateModalOpended: false });
  }

  componentDidUpdate() {
    $('#dateRangePickerOpenClick').trigger('click');
  }

  render() {
    let alertPax = false;

    const { viewer, handleOpenDetailModal, tripKey, relay, paxs, cityBookingKey } = this.props;
    const { serviceBookingDetail, roomCategoryNumber } = this.state;
    const modifiedServiceBookingDetail = { ...serviceBookingDetail };
    modifiedServiceBookingDetail.images = viewer.accommodationPlacement.images;

    let tpBookingRef = '';
    if (this.props.infoBoxData && this.props.infoBoxData.tpBookingRef) {
      tpBookingRef = this.props.infoBoxData.tpBookingRef;
    }

    let fontSize = '11px';
    if (SERVICES.isSideNavOpen) {
      fontSize = '9px';
    }
    const configureRenderer = <AccommodationConfigure paxs={paxs} disableBook={this.state.disableBook} infoBoxData={this.props.infoBoxData} relay={relay} tripKey={tripKey} cityBookingKey={cityBookingKey} viewer={this.props.viewer} activeDetail={roomCategoryNumber} handleOpenDetailModal={handleOpenDetailModal} supplier={viewer.accommodationPlacement.supplier} serviceStatus={this.state.serviceStatus} availability={this.state.availability} accommodationPlacement={viewer.accommodationPlacement} tpBookingRef={tpBookingRef} />;
    const infoRenderer = <AccommodationInfo activeDetail={modifiedServiceBookingDetail} supplier={viewer.accommodationPlacement.supplier} />;
    const beforeTabsRenderer = (
      <div className={styles.accommodationTabs}>
        <span style={{ color: '#bfbfbf', fontWeight: '700', marginLeft: '25px', fontSize: '10px' }}>Room categories</span>
        <ul className='collection cursor' style={{ fontWeight: 'bold', fontSize, border: 'none' }}>
          {
            viewer.accommodationPlacement.serviceBookings.filter(serviceBooking => serviceBooking.inactive !== true).map((obj, i) => {
              let border;
              let backgroundColor;
              const count = 1;
              let duplicatePax = false;
              const allPax = [];
              viewer.accommodationPlacement.serviceBookings.filter(serviceBooking => serviceBooking.inactive !== true).map((obj, k) => { // eslint-disable-line array-callback-return
                if (obj.roomConfigs && obj.roomConfigs.length > 0) {
                  obj.roomConfigs.map((roomConfigs) => { // eslint-disable-line array-callback-return
                    if (roomConfigs.paxs && roomConfigs.paxs.length > 0) {
                      roomConfigs.paxs.map((pax) => { // eslint-disable-line array-callback-return
                        if (SERVICES.pax && SERVICES.pax.length > 0) {
                          SERVICES.pax.map((checkPax, p) => { // eslint-disable-line array-callback-return
                            if (checkPax._key === pax._key) {
                              allPax.push(checkPax._key);
                            }
                          });
                        }
                      });
                    }
                  });
                }
              });
              const b = allPax.sort();
              // for (var l = 0; l < b.length - 1; l++) {
              //     if (b[l + 1] === b[l]) {
              //         duplicatePax = true
              //       }
              //     }

              _.times(b.length - 1, (l) => {
                if (b[l + 1] === b[l]) {
                  duplicatePax = true;
                }
              });

              // let totalPax = [];
              // if (SERVICES.pax && SERVICES.pax.length > 0) {
              //     SERVICES.pax.map((checkPax , p) => { // eslint-disable-line array-callback-return
              //        totalPax = allPax.filter(data => data === checkPax._key)
              //       console.log(totalPax);
              //     })
              // }
              // if(totalPax.length > 1){
              //   duplicatePax = true ;
              // }
              // console.log(count);
            //   if(viewer.accommodationPlacement.serviceBookings.filter(serviceBooking => serviceBooking.inactive !== true).length > 2){
            //     if(count > 2){
            //       alertPax = true;
            //     }
            //   }else {
            //   if (count > 2 * SERVICES.pax.length) {
            //     alertPax = true;
            //   }
            // }
              if (duplicatePax) {
                alertPax = true;
              } else {
                alertPax = false;
              }
              if (obj.roomConfigs && obj.roomConfigs.length === 0) {
                alertPax = false;
              }
              let availabilityStatus = null;
              if (obj.status && obj.status.tpAvailabilityStatus) {
                availabilityStatus = obj.status.tpAvailabilityStatus;
              }
              let showPrice = '';

              if (availabilityStatus === null || availabilityStatus === '') {
                showPrice = '--';
              } else if (obj.price.amount && obj.price.amount) {
                showPrice = obj.price.amount;
                if (showPrice === '' || showPrice === null || showPrice === 0) {
                  showPrice = '--';
                } else {
                  showPrice = SERVICES.currency[this.props.infoBoxData.currency] + this._priceFormat(showPrice);
                }
              }

              if (obj._key === serviceBookingDetail._key) {
                border = '4px solid #6abda0';
                backgroundColor = '#eaeaea';
              } else {
                border = '4px solid white';
                backgroundColor = 'white';
              }
              return (<a
                key={i} onClick={() => this.setState({ roomCategoryNumber: i, serviceBookingDetail: viewer.accommodationPlacement.serviceBookings[i] })} className={cx('collection-item', styles.collectionItem, { active: obj._key === serviceBookingDetail._key })}
                style={{ border: 'none', padding: '15px 22px', color: '#383838', backgroundColor, borderLeft: border, transition: '1sec', }}
              > <div className='row m-0'>
                <div className='col s8 p-0'>
                  <div className={styles.roomTitle}>{obj.accommodation.title}<br />{obj.rate.name}</div>
                </div>
                <div className='col s4 p-0'>
                  <div className={styles.floatRight}>
                    <span>{showPrice}</span>

                    {this._getPaxStatus(obj)}
                    {alertPax ? <i className='mdi mdi-account-alert' style={{ color: '#d51224' }} /> : null}
                    {this._getRoomCategoryStatus(obj)}
                  </div>
                </div>
              </div>
              </a>);
            }
            )
          }
        </ul>
      </div>
    );


    // start date change button
    const datePickerButton = <span id='dateRangePickerOpenClick' className='exo-colors-text cursor' style={{ float: 'right', display: 'none' }}>CLICK TO CHANGE HOTEL DATES</span>;
    const date_range = moment.range(moment(this.state.startDate, 'YYYY-MM-DD'), moment(this.state.endDate, 'YYYY-MM-DD'));
    const contentDateChangeCalendar = (<DateRangePicker
      triggerButton={datePickerButton}
      onDateChange={this.onDateChange}
      // minimumDate={moment(this.props.date).toDate()}
      value={date_range}
    />);
    // end date change button
    // const timeSlot = () => {
    //   let arr = _.values(viewer.serviceBooking.tour.timeSlots);
    //   const keys = _.keys(viewer.serviceBooking.tour.timeSlots);
    //   arr.shift();
    //   keys.shift();
    //   for (let k = 0; k < keys.length; k++) {
    //     arr[k].timeName = keys[k];
    //   }
    //   arr = _.sortBy(arr, 'pickupTime');
    //   const options = [];
    //
    //   // Create options including all available days and time slots
    //   for (let day = 1; day <= viewer.cityBooking.cityDays.length; day++) {
    //     options.push(arr.map((slot, idx) => {
    //       if (slot.available) {
    //         return <option key={`${viewer.cityBooking.cityDays[day - 1]._key}${idx + 1}`} value={`${viewer.cityBooking.cityDays[day - 1]._key}${idx + 1}`} >Day {day} {moment(this.props.viewer.cityBooking.cityDays[day - 1].startDate).format('MMM D')},{slot.timeName}</option>;
    //       }
    //       return undefined;
    //     }));
    //   }
    //   return options;
    // };

    const showDayValue = this.props.cityDayKey;

    let displayChangeDate = '';
    if (this.state.isHotelBooked === true) {
      displayChangeDate = 'none';
    }

    const timeslotRenderer =
      (<div style={{ paddingTop: '19px' }}>
        <span style={{ color: '#9a9698', fontWeight: '700', fontSize: '10px' }}>Travel date</span>
        <div className='row m-0'>
          <div className='col s1 p-0'>
            <i style={{ fontSize: '16px', color: '#bfbfbf' }} className='mdi-action-event' />
          </div>
          <div className='col s11 p-0'>
            {/* {
              <div className={styles.select}>
                <Select value={showDayValue} onChange={this.changeDay} disabled={this.state.userRole === 'TA'}>
                  <option disabled>{this.props.viewer.accommodationPlacement.startDate}, {this.props.viewer.accommodationPlacement.durationNights} Nights</option>
                </Select>
              </div>

            } */}
            <div className={styles.select} disabled={this.state.userRole === 'TA'}>
              {this.props.viewer.accommodationPlacement.startDate}, {this.props.viewer.accommodationPlacement.durationNights} Nights
            </div>
          </div>
          <div style={{ display: displayChangeDate }}>
            { this.state.userRole === 'TA' ? null : <a className={cx('cursor', styles.changeDate)} onClick={this.changeDateChangeModalState.bind(null, true, 0, 0)}><i className='mdi-action-event' />CHANGE DATES </a> }
          </div>
        </div>
      </div>);

    // const timeslotRenderer = (
    //   <div>
    //     <div className={styles.timeslot}>{this.props.viewer.accommodationPlacement.startDate}, {this.props.viewer.accommodationPlacement.durationNights} Nights</div>
    //     { this.state.userRole === 'TA' ? null : <a className={cx('cursor', styles.changeDate)} onClick={this.changeDateChangeModalState.bind(null, true, 0, 0)}><i className='mdi-action-event' />CHANGE DATES</a> }
    //   </div>
    // );

    const extraTabsRenderer = (
      <Tab id='map' title='MAP' ><Map supplier={viewer.accommodationPlacement.supplier} /></Tab>
    );

    const modifiedDataForDetail = {
      serviceBooking: viewer.accommodationPlacement.supplier
    };
    return (
      <div>
        <Detail
          viewer={modifiedDataForDetail}
          handleCheckButton={this.handleCheckHotelAvailability}
          handleBookService={this.bookServices}
          handleCancelBooking={this.cancelBookings}
          serviceStatus={this.state.serviceStatus}
          renderTimeslot={timeslotRenderer}
          renderConfigure={configureRenderer}
          renderInfo={infoRenderer}
          renderBeforeTabs={beforeTabsRenderer}
          renderExtraTabs={extraTabsRenderer}
          placementKey={viewer.accommodationPlacement._key}
          type='accommodation'
          alertPax={alertPax}
          hasPaxErrors={this.state.hasPaxErrors}
          serviceState={this.state.isHotelBooked ? 'Booked' : ''}  // this will show cancel button if hotel is booked
          disableCheck={this.state.disableCheck}
          disableBook={this.state.disableBook}
        />


        {
          this.state.isChangeDateModalOpended ?
            <Modal style={{ width: '60%', overflowY: 'visible' }} isModalOpened={this.state.isChangeDateModalOpended} changeModalState={this.changeDateChangeModalState}>
              {contentDateChangeCalendar}
            </Modal>
            : null
        }
      </div>


    );
  }
}
