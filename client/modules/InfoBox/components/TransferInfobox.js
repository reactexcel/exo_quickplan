import React, { Component, PropTypes } from 'react';
import Relay from 'react-relay';
import PubSub from 'pubsub-js';
import cx from 'classnames';
import moment from 'moment';
import { FaCalendarCheckO, FaCalendarTimesO, FaDollar } from 'react-icons/lib/fa';
import Detail from './Detail';
import BookServicesMutation from '../../ServiceBooking/mutations/BookServices';
import { Select, DateRangePicker, Modal } from '../../Utils/components';
import CancelBookingsMutation from '../../ServiceBooking/mutations/CancelBookings';
import TransferConfigure from './TransferConfigure';
import TransferInfo from './TransferInfo';
import TransferIcon from '../../Transfer/components/TransferIcon';
import styles from '../style.module.scss';
import SERVICES from '../../../services';
import ServiceAvailabilityMutation from '../../ServiceBooking/mutations/ServiceAvailability';
import ClearTransferPlacementMutation from '../../Transfer/mutations/ClearTransferPlacement';
import UpdateTransferPlacementMutation from '../../Transfer/mutations/Update';

export default class TransferInfobox extends Component {
  static propTypes = {
    viewer: PropTypes.object,
    relay: PropTypes.object
  };

  state = {
    roomCategoryNumber: 0,
    serviceBookingDetail: this.props.viewer.serviceBookings[0],
    serviceStatus: this.props.viewer.serviceBookings[0].status ? this.props.viewer.serviceBookings[0].status.state : '',
    isChangeDateModalOpended: false,
    nrOfAdults: 0,
    nrOfChildren: 0,
    nrOfInfants: 0,
    nrPaxs: {
      nrOfAdults: 0,
      nrOfChildren: 0,
      nrOfInfants: 0,
      nrTotalPax: 0
    }
  };

  componentDidUpdate() {
    $('#dateRangePickerOpenClick').trigger('click');
  }

  componentWillMount() {
    const setting = {
      roomCategoryNumber: 0,
      serviceBookingDetail: this.props.viewer.serviceBookings[0]
    };

    // default selection
    if (this.props.infoBoxData && this.props.infoBoxData.clickedTransferKey) {
      const clickedTransferKey = this.props.infoBoxData.clickedTransferKey;
      let keyToShow = 0;
      this.props.viewer.serviceBookings.map((sb, i) => { // eslint-disable-line array-callback-return
        if (sb._key === clickedTransferKey) {
          keyToShow = i;
        }
      });
      setting.roomCategoryNumber = keyToShow;
      setting.serviceBookingDetail = this.props.viewer.serviceBookings[keyToShow];
    }
    this.setState(setting);
  }

  componentWillReceiveProps(nextProps) {
    const setting = {
      roomCategoryNumber: 0,
      serviceBookingDetail: nextProps.viewer.serviceBookings[0],
      serviceStatus: '',
      nrPaxs: {
        nrOfAdults: 0,
        nrOfChildren: 0,
        nrOfInfants: 0,
        nrTotalPax: 0
      }
    };

    // if (nextProps.viewer.tourAvailability && nextProps.viewer.tourAvailability.availability) setting.serviceStatus = nextProps.viewer.tourAvailability.availability;

    if (nextProps.viewer && nextProps.viewer.serviceBookings.length > 0 && nextProps.viewer.serviceBookings[0].status && nextProps.viewer.serviceBookings[0].status.state !== '') {
      setting.serviceStatus = nextProps.viewer.serviceBookings[0].status.state;
    }

    // start paxes count
    let nrOfAdults = 0;
    const nrOfChildren = 0;
    const nrOfInfants = 0;
    let nrPaxs: {
      nrOfAdults: 0,
      nrOfChildren: 0,
      nrOfInfants: 0,
      nrTotalPax: 0
    };
    if (nextProps.viewer && nextProps.viewer.serviceBookings.length > 0 && nextProps.viewer.serviceBookings[0] && nextProps.viewer.serviceBookings[0].roomConfigs) {
      const roomConfigsA = nextProps.viewer.serviceBookings[0].roomConfigs;
      if (roomConfigsA.length > 0 && roomConfigsA[0].paxs && roomConfigsA[0].paxs.length > 0) {
        roomConfigsA[0].paxs.map((px) => { // eslint-disable-line array-callback-return
          nrOfAdults = nrOfAdults + 1; // eslint-disable-line operator-assignment
        });
      }
    }
    setting.nrPaxs = {
      nrOfAdults,
      nrOfChildren,
      nrOfInfants,
      nrTotalPax: nrOfAdults + nrOfChildren + nrOfInfants
    };
    // end paxes count

    // default selection
    if (nextProps.infoBoxData && nextProps.infoBoxData.clickedTransferKey) {
      const clickedTransferKey = nextProps.infoBoxData.clickedTransferKey;
      let keyToShow = 0;

      nextProps.viewer.serviceBookings.map((sb, i) => { // eslint-disable-line array-callback-return
        if (sb._key === clickedTransferKey) {
          keyToShow = i;
        }
      });

      setting.roomCategoryNumber = keyToShow;
      setting.serviceBookingDetail = nextProps.viewer.serviceBookings[keyToShow];
    }
    this.setState(setting);
  }

  handleCheckTransferAvailability = () => {
    // let transferPlacementId = '';
    // if (this.props.viewer && this.props.viewer._key) {
    //   transferPlacementId = `transferPlacements/${this.props.viewer._key}`;
    // }
    // const reqVariables = {
    //   transferPlacementId,
    //   country: 'thailand',
    //   productIds: this.props.viewer.serviceBookings.map(s => s.transfer._key),
    //   serviceBookingKeys: this.props.viewer.serviceBookings.map(s => s._key),
    //   date: this.props.viewer.startDate,
    //   nrOfAdults: this.props.nrPaxs.nrOfAdults,
    //   nrOfChildren: this.props.nrPaxs.nrOfChildren,
    //   nrOfInfants: this.props.nrPaxs.nrOfInfants,
    //   hasQuery: true
    // };
    // this.props.relay.setVariables(reqVariables);
    // this.props.relay.forceFetch();
    // PubSub.publish('TripForceFetch');

    if (this.props.viewer.serviceBookings && this.props.viewer.serviceBookings.length > 0) {
      this.props.viewer.serviceBookings.map((serviceBooking, i) => { // eslint-disable-line array-callback-return
        Relay.Store.commitUpdate(new ServiceAvailabilityMutation({
          serviceBooking
        }), {
          onSuccess: (res) => {
            const reqVariables = {
              transferPlacementId: this.props.transferPlacementId,
              country: 'thailand',
              productIds: this.props.viewer.serviceBookings.map(s => s.transfer._key),
              serviceBookingKeys: this.props.viewer.serviceBookings.map(s => s._key),
              date: this.props.viewer.startDate,
              nrOfAdults: this.props.nrPaxs.nrOfAdults,
              nrOfChildren: this.props.nrPaxs.nrOfChildren,
              nrOfInfants: this.props.nrPaxs.nrOfInfants,
              hasQuery: true
            };
            this.props.relay.setVariables(reqVariables);
            this.props.relay.forceFetch();
          }
        });
      });
    }
  };

  removeService = () => {
    Relay.Store.commitUpdate(new ClearTransferPlacementMutation({
      transferPlacementKey: this.props.viewer._key,
      transferPlacementId: this.props.viewer.id
    }), {
      onSuccess: () => {
        PubSub.publish('Infobox', { type: 'clear' });
        PubSub.publish('TripForceFetch', {});
      },
      onError: () => {
        PubSub.publish('Infobox', { type: 'clear' });
        PubSub.publish('TripForceFetch', {});
      },
    });
  }

  cancelBookings = () => {
    Relay.Store.commitUpdate(new CancelBookingsMutation({
      serviceBookings: this.props.viewer.serviceBookings
    }), {
      onSuccess: () => {
        // PubSub.publish('TripForceFetch');
        this.props.relay.forceFetch();
      }
    });
  };

  bookServices = () => {
    Relay.Store.commitUpdate(new BookServicesMutation({
      serviceBookings: this.props.viewer.serviceBookings
    }), {
      onSuccess: () => {
        // PubSub.publish('TripForceFetch');
        this.props.relay.forceFetch();
      }
    });
  };

  renderCalendar = () => {
    const durationDays = this.props.viewer.durationDays || 0;
    let show_durationDays = '';
    if (durationDays > 0) {
      show_durationDays = ` ${durationDays} Days`;
    }
    const isBooked = this.state.serviceStatus === 'Booked';

    let travel_date_label = '';
    let travel_start_date = '';
    const travel_end_date = '';
    if (this.props.viewer.startDate && this.props.viewer.startDate !== '') {
      travel_start_date = moment(this.props.viewer.startDate, 'YYYY-MM-DD').format('DD MMM, YYYY');
      travel_date_label = travel_start_date;
    }

    if (durationDays > 1 && travel_start_date !== '') {
      const travel_end_date = moment(this.props.viewer.startDate, 'YYYY-MM-DD').add(durationDays - 1, 'days').format('DD MMM, YYYY');
      travel_date_label = `${travel_start_date} - ${travel_end_date}`;
    }
    travel_date_label = travel_date_label + show_durationDays; // eslint-disable-line  operator-assignment

    return (<div style={{ paddingTop: '19px' }}>
      <span style={{ color: '#9a9698', fontWeight: '700', fontSize: '10px' }}>Travel date</span>
      <div className='row m-0'>
        <div className='col s1 p-0'>
          <i style={{ fontSize: '16px', color: '#bfbfbf' }} className='mdi-action-event' />
        </div>
        <div className='col s11 p-0'>
          <div className={styles.select} disabled={this.state.userRole === 'TA'}>
            {travel_date_label}
          </div>
        </div>
        <div>
          { isBooked ? null : <a className={cx('cursor', styles.changeDate)} onClick={this.changeDateChangeModalState.bind(null, true, 0, 0)}><i className='mdi-action-event' />CHANGE DATES </a> }
        </div>
      </div>
    </div>
      // <div>
      //   <div className={styles.timeslot}>{this.props.viewer.startDate || ''}{show_durationDays}</div>
      //   <a className={cx('cursor', styles.changeDate)}><i className='mdi-action-today tiny' />CHANGE DATES</a>
      // </div>
    );
  };

  availabilityInfo(statusCheck) {
    switch (statusCheck) {
      case 'Available':
        return (<i className='mdi mdi-calendar-check' />);
      case 'Unavailable':
        return (<i className='mdi mdi-calendar-remove exo-colors-text text-error-front' />);
      case 'Booked':
        return (<i className='mdi mdi-cash-usd' />);
      case 'On Request':
        return (<i className='mdi mdi-calendar-blank exo-colors-text text-accent-4 availabilityInfo' />);
      default:
        return (<span>--</span>);
    }
  }

  _priceFormat = (showPrice) => { // eslint-disable-line consistent-return
    let finalPrice = '';
    const arr = showPrice.toString().split('');
    _.times(arr.length, (i) => {
      finalPrice += arr[i];
      if ((arr.length - i - 1) % 3 === 0 && i < arr.length - 1) finalPrice += ',';
    });
    return finalPrice;
  }

  renderServiceBookingTabs = () => {
    const { viewer } = this.props;
    const { serviceBookingDetail } = this.state;
    let fontSize = '11px';
    let fontTitle = 13;
    if (SERVICES.isSideNavOpen) {
      fontSize = '9px';
      fontTitle = 11;
    }
    return (
      <div className={styles.accommodationTabs}>
        <span style={{ color: '#9a9698', fontWeight: '700', marginLeft: '25px', fontSize: '10px' }}>Transfer segments</span>
        <ul className='collection cursor' style={{ fontWeight: 'bold', fontSize, border: 'none' }}>
          {
            viewer.serviceBookings.map((sb, i) => {
              let border;
              let backgroundColor;
              if (sb._key === serviceBookingDetail._key) {
                border = '4px solid #6abda0';
                backgroundColor = '#eaeaea';
              } else {
                border = '4px solid white';
                backgroundColor = 'white';
              }

              let sbStatusCheck = '';
              if (sb.status && sb.status.state) {
                sbStatusCheck = sb.status.state;
              }

              const statusIcon = this.availabilityInfo(sbStatusCheck);

              const sb_currency = (sb.price && sb.price.currency || 'USD'); // eslint-disable-line no-mixed-operators
              const showCurrencyIcon = SERVICES.currency[sb_currency];

              return (

                <a
                  key={i} onClick={() => this.setState({ roomCategoryNumber: i, serviceBookingDetail: viewer.serviceBookings[i] })} className={cx('collection-item', styles.collectionItem, { active: sb._key === serviceBookingDetail._key })}
                  style={{ border: 'none', padding: '15px 22px', color: '#383838', backgroundColor, borderLeft: border, transition: '1sec', }}
                >
                  <span className={cx(styles.transferIcon)}>
                    <TransferIcon typeDescription={(sb.transfer && sb.transfer.type && sb.transfer.type.description) || sb.placeholder.type} />
                  </span>
                  <div className={styles.roomTitle} style={{ marginLeft: '5%' }}>
                    <div style={{ fontSize: `${fontTitle}px` }}>{(sb.transfer && sb.transfer.vehicle && sb.transfer.vehicle.model) || (sb.placeholder && sb.placeholder.vehicleModel)}</div>
                    <div className={styles.routes} style={{ fontSize: `${fontTitle - 3}px` }}>From {(sb.transfer && sb.transfer.route && sb.transfer.route.from.place) || (sb.transfer && sb.transfer.route && sb.transfer.route.from && sb.transfer.route.from.localityName) || (sb.transfer && sb.transfer.route && sb.transfer.route.from && sb.transfer.route.from.cityName) || (sb.route && sb.route.from) || ''}</div>
                    <div className={styles.routes} style={{ fontSize: `${fontTitle - 3}px` }}>To {(sb.transfer && sb.transfer.route && sb.transfer.route.to.place) || (sb.transfer && sb.transfer.route && sb.transfer.route.to && sb.transfer.route.to.localityName) || (sb.transfer && sb.transfer.route && sb.transfer.route.to && sb.transfer.route.to.cityName) || (sb.route && sb.route.to) || ''}</div>
                  </div>
                  <div className={styles.floatRight}>
                    <span>{showCurrencyIcon}{(this._priceFormat(sb.price && sb.price.amount)) || ''}</span>
                    {statusIcon}
                  </div>
                </a>
              );
            }
            )
          }
        </ul>
      </div>
    );
  };

  renderConfigure = () => {
    const { viewer } = this.props;
    const { roomCategoryNumber, serviceStatus, availability } = this.state;

    let tpBookingRef = '';
    if (this.props.infoBoxData && this.props.infoBoxData.tpBookingRef) {
      tpBookingRef = this.props.infoBoxData.tpBookingRef;
    }
    return <TransferConfigure viewer={viewer} activeDetail={roomCategoryNumber} currency={SERVICES.currency[(this.props.infoBoxData && this.props.infoBoxData.currency) || 'USD']} serviceStatus={serviceStatus} availability={availability} tpBookingRef={tpBookingRef} nrPaxs={this.state.nrPaxs} />;
  };

  renderInfo = () => {
    const { serviceBookingDetail } = this.state;
    return <TransferInfo transfer={serviceBookingDetail.transfer} />;
  };

  changeDateChangeModalState = (isOpen, addedIndex, addedOrder) => {
    this.setState({ isChangeDateModalOpended: isOpen });
  };

  onDateChange = (startDate, endDate) => {
    // const new_start_date = moment(startDate).format('YYYY-MM-DD');
    // Don't allow user to change the new start date.
    // TODO for now we ignore the new start date, need to disable changing the start date in UI in future.
    const previousStartDate = moment(this.props.viewer.startDate, 'YYYY-MM-DD');
    const new_end_date = moment(endDate).format('YYYY-MM-DD');
    const diff_in_dates_in_days = moment(new_end_date).diff(moment(previousStartDate), 'days') + 1;
    Relay.Store.commitUpdate(new UpdateTransferPlacementMutation({
      isLocaltransfer: false,
      n_city_key: '',
      n_day_id: '',
      n_remove_local_transferPlacementKey: '',
      // transferPlacementId: this.props.transferPlacementId,
      transferPlacementKey: this.props.viewer._key,
      // selectedTransferKeys: this.state.selectedTransfersArray[0].map(transfer => transfer._key),
      selectedTransferKeys: this.props.viewer.serviceBookings.map(transfer => transfer.transfer._key),
      durationDays: diff_in_dates_in_days,
      //startDate: this.state.transferStartDate
    }), {
      onSuccess: (response) => {
        PubSub.publish('TripForceFetch');
      },
      onError: (response) => {
        PubSub.publish('TripForceFetch');
      }
    });
    this.setState({ isChangeDateModalOpended: false });
  }

  render() {
    const { viewer } = this.props;
    const { serviceBookingDetail } = this.state;


    // start -  change date content
    const datePickerButton = <span id='dateRangePickerOpenClick' className='exo-colors-text cursor' style={{ float: 'right', display: 'none' }}>CLICK TO CHANGE HOTEL DATES</span>;
    let dateRange_durationDays = 1;
    if (this.props.viewer.durationDays && this.props.viewer.durationDays > 0) {
      dateRange_durationDays = this.props.viewer.durationDays;
    }

    const dateRange_end_date = moment(this.props.viewer.startDate, 'YYYY-MM-DD').add(dateRange_durationDays - 1, 'days').format('YYYY-MM-DD');

    const date_range = moment.range(moment(this.props.viewer.startDate, 'YYYY-MM-DD'), dateRange_end_date);

    const contentDateChangeCalendar = (<DateRangePicker
      triggerButton={datePickerButton}
      onDateChange={this.onDateChange}
      minimumDate={moment(this.props.viewer.startDate).toDate()}
      value={date_range}
      singleDateRange
    />);

    // end - change date content

    const stateState = serviceBookingDetail && serviceBookingDetail.status ? serviceBookingDetail.status.state : '';

    return (
      <div>
        <Detail
          viewerComplete={viewer}
          viewer={{ serviceBooking: serviceBookingDetail && serviceBookingDetail.transfer }}
          handleCheckButton={this.handleCheckTransferAvailability}
          handleBookService={this.bookServices}
          handleCancelBooking={this.cancelBookings}
          serviceState={this.state.serviceStatus}
          renderBeforeTabs={this.renderServiceBookingTabs()}
          renderConfigure={this.renderConfigure()}
          renderTimeslot={this.renderCalendar()}
          renderInfo={this.renderInfo()}
          placementKey={viewer._key}
          type='transfer'
          handleRemoveService={this.removeService}
          disableBook={stateState !== 'Available'}
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
