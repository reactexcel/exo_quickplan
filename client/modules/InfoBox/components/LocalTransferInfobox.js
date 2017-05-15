import React, { Component } from 'react';
import Relay from 'react-relay';
import PubSub from 'pubsub-js';
import cx from 'classnames';
import _ from 'lodash';
import moment from 'moment';
import { FaCalendarCheckO, FaCalendarTimesO, FaDollar } from 'react-icons/lib/fa';
import Detail from './Detail';
import { Select } from '../../Utils/components';
import BookServicesMutation from '../../ServiceBooking/mutations/BookServices';
import CancelBookingsMutation from '../../ServiceBooking/mutations/CancelBookings';
import LocalTransferConfigure from './LocalTransferConfigure';
import LocalTransferInfo from './LocalTransferInfo';
import TransferIcon from '../../Transfer/components/TransferIcon';
import styles from '../style.module.scss';
import SERVICES from '../../../services';
import ServiceAvailabilityMutation from '../../ServiceBooking/mutations/ServiceAvailability';
import RemoveLocalTransfer from '../../Transfer/mutations/RemoveLocalTransfer';

export default class LocalTransferInfobox extends Component {

  state = {
    cityDayIndexOfLocalTransfer: 0,
    roomCategoryNumber: 0,
    serviceBookingDetail: '',
    serviceStatus: '',
    serviceState: '',
    nrPaxs: {
      nrOfAdults: 0,
      nrOfChildren: 0,
      nrOfInfants: 0,
      nrTotalPax: 0
    }
  };

  componentWillMount() {
    // PubSub.publish('TripForceFetch', {});
  }

  componentWillReceiveProps(nextProps) {
    // start paxes count
    let cityDayIndexOfLocalTransfer = 0;
    let nrOfAdults = 0;
    const nrOfChildren = 0;
    const nrOfInfants = 0;
    let opted_transferPlacementId = nextProps.transferPlacementId;
    let opted_local_transfer_key = 0;

    // start get latest inserted transferplacement id so that to show transfer infobox when insert new
    let checkLatestInsert = 0;
    if (this.props.infoBoxData && !this.props.infoBoxData.clickedTransferKey) {
      // get latest inserted local transfer
      _.map(nextProps.viewer.cityBooking.cityDays, (cityDay, cityDayIndexKey) => {
        _.map(cityDay.serviceBookings, (citySB, k) => {
          if (citySB._key > checkLatestInsert) {
            checkLatestInsert = citySB._key;
            opted_transferPlacementId = citySB.id;
          }
        });
      });
    }
    // end get latest inserted transferplacement id so that to show transfer infobox when insert new

    // -start--calculation of city key for which transfer is clicked
    _.map(nextProps.viewer.cityBooking.cityDays, (cityDay, cityDayIndexKey) => {
      _.map(cityDay.serviceBookings, (citySB, k) => {
        if (citySB.id === opted_transferPlacementId) {
          cityDayIndexOfLocalTransfer = cityDayIndexKey;
        }
      });
    });
    // -start--calculation of city key for which transfer is clicked
    _.map(nextProps.viewer.cityBooking.cityDays[cityDayIndexOfLocalTransfer].serviceBookings, (v, k) => {
      if (v.id === opted_transferPlacementId) {
        opted_local_transfer_key = k;
        // paxes count
        if (v.roomConfigs && v.roomConfigs.length > 0 && v.roomConfigs[0].paxs && v.roomConfigs[0].paxs.length > 0) {
          v.roomConfigs[0].paxs.map((px) => { // eslint-disable-line array-callback-return
            nrOfAdults = nrOfAdults + 1; // eslint-disable-line operator-assignment
          });
        }
        // paxes count
      }
    });

    const nrPaxs = {
      nrOfAdults,
      nrOfChildren,
      nrOfInfants,
      nrTotalPax: nrOfAdults + nrOfChildren + nrOfInfants
    };

    this.setState({
      cityDayIndexOfLocalTransfer,
      roomCategoryNumber: opted_local_transfer_key,
      serviceBookingDetail: nextProps.viewer.cityBooking.cityDays[cityDayIndexOfLocalTransfer].serviceBookings[opted_local_transfer_key],
      serviceStatus: nextProps.viewer.cityBooking.cityDays[cityDayIndexOfLocalTransfer].serviceBookings[opted_local_transfer_key] && nextProps.viewer.cityBooking.cityDays[cityDayIndexOfLocalTransfer].serviceBookings[opted_local_transfer_key].status ? nextProps.viewer.cityBooking.cityDays[cityDayIndexOfLocalTransfer].serviceBookings[opted_local_transfer_key].status.tpAvailabilityStatus : '',
      serviceState: nextProps.viewer.cityBooking.cityDays[cityDayIndexOfLocalTransfer].serviceBookings[opted_local_transfer_key] && nextProps.viewer.cityBooking.cityDays[cityDayIndexOfLocalTransfer].serviceBookings[opted_local_transfer_key].status ? nextProps.viewer.cityBooking.cityDays[cityDayIndexOfLocalTransfer].serviceBookings[opted_local_transfer_key].status.state : '',
      nrPaxs
    });
  }

  handleCheckTransferAvailability = () => {
    // this.props.relay.setVariables({
    //   country: 'thailand',
    //   productIds: this.props.viewer.serviceBookings.map(s => s.transfer._key),
    //   serviceBookingKeys: this.props.viewer.serviceBookings.map(s => s._key),
    //   date: '2016-10-10',
    //   nrOfAdults: 2,
    //   nrOfChildren: 0,
    //   nrOfInfants: 0,
    //   hasQuery: true
    // });

    let transferPlacementId = '';
    if (this.props.transferPlacementId && this.props.transferPlacementId !== '') {
      transferPlacementId = this.props.transferPlacementId;
    }

    if (transferPlacementId !== '' && this.props.viewer.cityBooking && this.props.viewer.cityBooking.cityDays && this.props.viewer.cityBooking.cityDays.length > 0) {
      this.props.viewer.cityBooking.cityDays.map((cityDay, i) => { // eslint-disable-line array-callback-return
        if (cityDay.serviceBookings && cityDay.serviceBookings.length > 0) {
          cityDay.serviceBookings.map((serviceBooking, j) => { // eslint-disable-line array-callback-return
            if (serviceBooking.id === transferPlacementId) {
              Relay.Store.commitUpdate(new ServiceAvailabilityMutation({
                serviceBooking
              }), {
                onSuccess: (res) => {
                  // const reqVariables = {
                  //   transferPlacementId: this.props.transferPlacementId,
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
                  this.props.relay.forceFetch();
                },
                onError: (res) => {
                  this.props.relay.forceFetch();
                }
              });
            }
          });
        }
      });
    }
  };

  removeService = () => {
    Relay.Store.commitUpdate(new RemoveLocalTransfer({
      transferPlacementKey: this.state.serviceBookingDetail._key
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
      serviceBookings: [this.state.serviceBookingDetail] // this.props.viewer.serviceBookings
    }), {
      onSuccess: () => {
        PubSub.publish('TripForceFetch');
      }
    });
  };

  bookServices = () => {
    Relay.Store.commitUpdate(new BookServicesMutation({
      serviceBookings: [this.state.serviceBookingDetail] // this.props.viewer.serviceBookings
    }), {
      onSuccess: () => {
        PubSub.publish('TripForceFetch');
      }
    });
  };

  renderCalendar = () => {
    const durationDays = this.props.viewer.durationDays || 0;
    let show_durationDays = '';
    if (durationDays > 0) {
      show_durationDays = `, ${durationDays} Days`;
    }
    const isBooked = this.state.serviceState === 'Booked';

    let travel_date_label = '';
    const travel_start_date = (this.props.viewer.cityBooking && this.props.viewer.cityBooking.cityDays && this.props.viewer.cityBooking.cityDays[this.state.cityDayIndexOfLocalTransfer].startDate) || '';
    if (travel_start_date !== '') {
      travel_date_label = moment(travel_start_date, 'YYYY-MM-DD').format('DD MMM, YYYY');
    }
    return (<div style={{ paddingTop: '19px' }}>
      <span style={{ color: '#9a9698', fontWeight: '700', fontSize: '10px' }}>Travel date</span>
      <div className='row m-0'>
        <div className='col s1 p-0'>
          <i style={{ fontSize: '16px', color: '#bfbfbf' }} className='mdi-action-event' />
        </div>
        <div className='col s11 p-0'>
          <div className={styles.select} disabled={this.state.userRole === 'TA' || isBooked}>
            {travel_date_label}
          </div>
        </div>
      </div>
    </div>
    // <div>
    //   <div className={styles.timeslot}>{this.props.viewer.cityBooking.cityDays[0].startDate}</div>
    // </div>
  );
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


  availabilityInfo(statusCheck) {
    switch (statusCheck) {
      case 'Booked':
        return (<i className='mdi mdi-cash-usd' />);
      case 'Available':
        return (<i className='mdi mdi-calendar-check exo-colors-text text-darken-2' />);
      case 'Unavailable':
        return (<i className='mdi mdi-calendar-remove exo-colors-text text-error-front' />);
      case 'On Request':
        return (<i className='mdi mdi-calendar-blank exo-colors-text text-accent-4' />);
      default:
        return (<span>--</span>);
    }
  }

  renderServiceBookingTabs = () => {
    // const { viewer } = this.props;
    let fontSize = '11px';
    let fontTitle = 13;
    if (SERVICES.isSideNavOpen) {
      fontSize = '9px';
      fontTitle = 11;
    }
    const border = '4px solid #6abda0';
    const backgroundColor = '#eaeaea';
    const { serviceBookingDetail } = this.state;
    let showData = '';
    if (serviceBookingDetail && serviceBookingDetail.localtransfer) {
      const l = serviceBookingDetail.localtransfer;
      let paxWarningStatus = '';
      if (serviceBookingDetail.paxStatuses && serviceBookingDetail.paxStatuses.length > 0) {
        paxWarningStatus = <i className='mdi mdi-account' style={{ color: '#eea400' }} />;
      }

      let sbStatusCheck = '';
      if (serviceBookingDetail.status && serviceBookingDetail.status.state) {
        sbStatusCheck = serviceBookingDetail.status.state;
      }
      const statusIcon = this.availabilityInfo(sbStatusCheck);

      const sb_currency = (serviceBookingDetail.price && serviceBookingDetail.price.currency || 'USD'); // eslint-disable-line no-mixed-operators
      const showCurrencyIcon = SERVICES.currency[sb_currency];

      showData =
      (<div className={styles.accommodationTabs}>
        <span style={{ color: '#9a9698', fontWeight: '700', marginLeft: '25px', fontSize: '10px' }}>Transfer segments</span>
        <ul className='collection cursor' style={{ fontWeight: 'bold', fontSize, border: 'none' }}>
          <a
            className={cx('collection-item', styles.collectionItem, 'active')}
            style={{ border: 'none', padding: '15px 22px', color: '#383838', backgroundColor, borderLeft: border, transition: '1sec', }}
          >
            <span className={cx(styles.transferIcon)}>
              <TransferIcon typeDescription={(l.type && l.type.description) || ''} />
            </span>
            <div className={styles.roomTitle} style={{ marginLeft: '5%' }}>
              <div style={{ fontSize: `${fontTitle}px` }}>{(l.vehicle && l.vehicle.model) || ''}</div>
              <div className={styles.routes} style={{ fontSize: `${fontTitle - 3}px` }}>From {(l.route && l.route.from && l.route.from.localityName) || (l.route.from.place) || (l.route.from.cityName)}</div>
              <div className={styles.routes} style={{ fontSize: `${fontTitle - 3}px` }}>To {(l.route && l.route.to && l.route.to.localityName) || (l.route.to.place) || (l.route.to.cityName)}</div>
            </div>
            <div className={styles.floatRight}>
              <span>{showCurrencyIcon}{(this._priceFormat(serviceBookingDetail.price && serviceBookingDetail.price.amount)) || ''}</span>
              {paxWarningStatus}
              {/* <i className='mdi mdi-account-alert' style={{ color: '#d51224' }} /> */}
              {statusIcon}
            </div>
          </a>
          {/* <div className='row m-0'>
            <div className='col s8 p-0'>
              <a className={cx('collection-item', styles.collectionItem)}>
                <div>
                  <div>{ (l.route.from.localityName) || (l.route.from.place) || l.route.from.cityName}</div>
                  <hr className='m-0' />
                  <div>{ (l.route.to.localityName) || (l.route.to.place) || l.route.to.cityName}</div>
                  <div style={{ fontSize: '11px', marginTop: '10px' }}>{ (l.vehicle.category) || '' } { (l.vehicle.model) || '' }</div>
                </div>
              </a>
            </div>
            <div className='col s4 p-0'>
              <div className={styles.floatRight}>
                <span>${(serviceBookingDetail.price && serviceBookingDetail.price.amount) || ''}</span>
                {paxWarningStatus}
                <i className='mdi mdi-calendar-check' />
              </div>
              <span className={cx(styles.transferIcon)}>
                <TransferIcon typeDescription={(l.type.description) || ''} />
              </span>
            </div>
          </div> */}
        </ul>
      </div>);
    }
    return (<div> {showData} </div>);
  };

  renderConfigure = () => {
    // const { viewer } = this.props;
    const { roomCategoryNumber, serviceState, availability } = this.state;

    return (<LocalTransferConfigure
      viewer={this.props.viewer.cityBooking.cityDays[this.state.cityDayIndexOfLocalTransfer]}
      activeDetail={roomCategoryNumber}
      serviceState={serviceState}
      availability={availability}
      nrPaxs={this.state.nrPaxs}
    />);
  };

  renderInfo = () => {
    const { serviceBookingDetail } = this.state;
    return <LocalTransferInfo transfer={serviceBookingDetail && serviceBookingDetail.localtransfer ? serviceBookingDetail.localtransfer : {}} />;
  };


  render() {
    const { viewer } = this.props;
    const { serviceBookingDetail } = this.state;
    let ret = null;
    if (serviceBookingDetail && serviceBookingDetail.localtransfer) {
      const stateState = serviceBookingDetail && serviceBookingDetail.status ? serviceBookingDetail.status.state : '';
      ret = (<Detail
        viewer={{ serviceBooking: serviceBookingDetail && serviceBookingDetail.localtransfer ? serviceBookingDetail.localtransfer : {} }}
        handleCheckButton={this.handleCheckTransferAvailability}
        handleBookService={this.bookServices}
        handleCancelBooking={this.cancelBookings}
        serviceStatus={this.state.serviceStatus}
        serviceState={this.state.serviceState}
        renderBeforeTabs={this.renderServiceBookingTabs()}
        renderConfigure={this.renderConfigure()}
        renderTimeslot={this.renderCalendar()}
        renderInfo={this.renderInfo()}
        placementKey={viewer.cityBooking.cityDays[this.state.cityDayIndexOfLocalTransfer]._key}
        type='localtransfer'
        handleRemoveService={this.removeService.bind()}
        transferPlacementId={serviceBookingDetail._key ? serviceBookingDetail._key : ''}
        disableBook={stateState !== 'Available'}
      />);
    }


    return (
      ret
    );
  }
}
