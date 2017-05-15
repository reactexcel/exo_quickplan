import React, { Component, PropTypes } from 'react';
import Relay from 'react-relay';
import _ from 'lodash';
import cx from 'classnames';
import { FaCalendarCheckO, FaCalendarTimesO, FaDollar } from 'react-icons/lib/fa';
import { Card, Modal, Select } from '../../Utils/components';
import UpdateServiceMutation from '../../ServiceBooking/mutations/UpdateService';
import styles from '../style.module.scss';
import BookServicesMutation from '../../ServiceBooking/mutations/BookServices';
import SERVICES from '../../../services';

export default class TransferConfigure extends Component {
  static propTypes = {
    viewer: PropTypes.object.isRequired,
    activeDetail: PropTypes.number.isRequired,
    serviceStatus: PropTypes.string,
    availability: PropTypes.object,
  };

  static defaultProps = {
    serviceStatus: '',
    availability: {}
  };

  state = {
    patchData: this.props.viewer.serviceBookings[this.props.activeDetail],
    pickupLocation: '',
    dropoffLocation: '',
    isCancellationModalOpen: false,
    isChildModalOpen: false
  };

  componentWillReceiveProps(nextProps) {
    this.setState({ patchData: nextProps.viewer.serviceBookings[nextProps.activeDetail],
      pickupLocation: (nextProps.viewer.serviceBookings && nextProps.viewer.serviceBookings[nextProps.activeDetail] && nextProps.viewer.serviceBookings[nextProps.activeDetail].pickUp.location) || '',
      dropoffLocation: (nextProps.viewer.serviceBookings && nextProps.viewer.serviceBookings[nextProps.activeDetail] && nextProps.viewer.serviceBookings[nextProps.activeDetail].dropOff.location) || ''
    });
  }

  handleUpdateService = (e) => {
    const name = e.target.name;
    const value = (e.target.type === 'checkbox' ? e.target.checked : e.target.value);

    const patchData = {};

    /* if (name.indexOf('extras') !== 0) {
      const idx = name.substring(5);
      patchData.extras[idx] = value;
      name = 'extras';
    }*/
    _.set(patchData, name, value);

    Relay.Store.commitUpdate(new UpdateServiceMutation({
      serviceBookingId: this.props.viewer.serviceBookings[this.props.activeDetail].id,
      serviceBookingKey: this.props.viewer.serviceBookings[this.props.activeDetail]._key,
      patchData
    }));

    this.handleChange(e);
  };

  handleChange = (e) => {
    const name = e.target.name;
    const value = (e.target.type === 'checkbox' ? e.target.checked : e.target.value);

    const patchData = { ...this.state.patchData };

    /* if (name.indexOf('extras') !== 0) {
      const idx = name.substring(5);
      patchData.extras[idx] = value;
      name = 'extras';
    }*/

    _.set(patchData, name, value);

    this.setState({ patchData });
  };

  availabilityInfo() {
    let statusCheck = '';
    if (this.props.serviceStatus && this.props.serviceStatus !== '' && this.props.serviceStatus !== null) {
      statusCheck = this.props.serviceStatus;
    }
    switch (statusCheck) {
      case 'Available':
        return (<div className='availabilityInfo'>
          <i className='mdi mdi-calendar-check' /> <div>Available</div>
        </div>);
      case 'Unavailable':
        return (<div className='exo-colors-text text-error-front availabilityInfo'>
          <FaCalendarTimesO size={18} /> <div>Unavailable</div>
        </div>);
      case 'Booked':
        return (<div className='availabilityInfo'>
          <i className='mdi mdi-cash-usd fs-25' /> <div>Booked</div>
        </div>);
      case 'On Request':
        return (<div className='exo-colors-text text-accent-4 availabilityInfo' style={{ padding: '6px 0' }}>
          <i className='mdi mdi-calendar-blank' /> <div>On Request</div>
        </div>);
      default:
        return (<div>--</div>);
    }
  }

  changeRemoveCancellationModal = (isOpen) => {
    this.setState({ isCancellationModalOpen: isOpen });
  };

  changeRemoveChildModal = (isOpen) => {
    this.setState({ isChildModalOpen: isOpen });
  };

  bookTransferSegment = () => {
    Relay.Store.commitUpdate(new BookServicesMutation({
      serviceBookings: [this.state.patchData]
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

  render() {
    const spanHead = styles.configHead;
    const { viewer } = this.props;
    const noteTitle = <h5 style={{ fontWeight: 'bold' }}>Note</h5>;
    const extraTitle = <h5 style={{ fontWeight: 'bold' }}>Extra Options</h5>;
    const travellersTitle = <h5 style={{ fontWeight: 'bold' }}>Travellers</h5>;
    const pdTitle = <h5 style={{ fontWeight: 'bold' }}>Pickup / Drop-off</h5>;
    const routeTitle = <h5 style={{ fontWeight: 'bold' }}>Route</h5>;
    let extras;

    if (viewer.serviceBookings[this.props.activeDetail] && viewer.serviceBookings[this.props.activeDetail].transfer.extras) {
      extras = viewer.serviceBookings[this.props.activeDetail].transfer.extras.map((extra, idx) =>
        <div className='col s12' key={idx}>
          <div className='col s2'>
            <input name={`extras${idx}`} type='text' placeholder='Qty' onBlur={this.handleUpdateService} onChange={this.handleChange} value={(this.props.viewer.serviceBookings[this.props.activeDetail].extras && this.props.viewer.serviceBookings[this.props.activeDetail].extras[idx]) || 0} />
          </div>
          <div className='col s10'>
            <div className='exo-colors-text text-data-1'>{extra.description}</div>
          </div>
        </div>
      );
    }

    const serviceBooking = viewer.serviceBookings[this.props.activeDetail];

    let tpBookingRef = '';
    if (this.props.tpBookingRef) {
      tpBookingRef = this.props.tpBookingRef;
    }

    const sb_currency = (this.props.viewer.serviceBookings[this.props.activeDetail] && this.props.viewer.serviceBookings[this.props.activeDetail].price && this.props.viewer.serviceBookings[this.props.activeDetail].price.currency) || 'USD';

    const showCurrencyIcon = SERVICES.currency[sb_currency];

    let price = (this.props.viewer.serviceBookings[this.props.activeDetail] && this.props.viewer.serviceBookings[this.props.activeDetail].price && this.props.viewer.serviceBookings[this.props.activeDetail].price.amount) || '';
    if (price === '' || price === null) {
      price = '--';
    } else {
      price = showCurrencyIcon + this._priceFormat(price);
    }

    const guide_opted_value = (this.props.viewer.serviceBookings && this.props.viewer.serviceBookings.length > 0 && this.props.viewer.serviceBookings[this.props.activeDetail].route && this.props.viewer.serviceBookings[this.props.activeDetail].route.withGuide) || '';

    const btnBookTransferSegment = (<div style={{ paddingTop: '15px', fontSize: '10px', color: '#00c498', fontWeight: 'bold', textAlign: 'right' }}>
      <a href='#!' onClick={this.bookTransferSegment}> <i className='mdi mdi-cash-usd fs-18' />  BOOK TRANSFER SEGMENT</a>
    </div>);
    return (
      <div className='configure'>
        <div className='general'>
          {/* <div className='row mt-0'>
            <div className='col s4'>
              {this.availabilityInfo()}
            </div>
            <div className='col s4'>
              <div style={{ fontSize: '11px', color: '#98c1ab' }}>Booking reference #</div>
              <div style={{ fontSize: '11px', color: '#6abda0', fontWeight: 'bold' }}>{tpBookingRef}</div>
            </div>
            <div className={cx('col s4', styles.textRight)}>
              <input type='text' placeholder='Price' name='price.amount' onBlur={this.handleUpdateService} onChange={this.handleChange} value={(this.props.viewer.serviceBookings[this.props.activeDetail].price && this.props.viewer.serviceBookings[this.props.activeDetail].price.amount) || ''} />
            </div>
          </div> */}
          <div className={cx(spanHead, 'row m-0 fw-700', { 'fs-13': !SERVICES.isSideNavOpen }, { 'fs-10': SERVICES.isSideNavOpen })}>
            <div className='col s6 p-0'>
              <span>Status</span>
              {this.availabilityInfo()}
            </div>
            {/* <div className='col s5 p-0 pl-15 align-left'>
              <span>Booking Reference</span>
              <div style={{ marginTop: '9px', fontWeight: 'bold' }}>{tpBookingRef}EC10098DF</div>
            </div> */}
            <div className='col s6 p-0 pl-30'>
              <span>Price</span>
              <div style={{ marginTop: '9px', fontWeight: 'bold' }}>{price}</div>
            </div>
          </div>


          {/* <div className='row'>
            <div className='col s12'>
              <div className='exo-colors-text text-label-1'>Includes guide (English)</div>
            </div>
          </div> */}
          <div className={cx(spanHead, 'row m-0 pt-10 fw-700', { 'fs-13': !SERVICES.isSideNavOpen }, { 'fs-10': SERVICES.isSideNavOpen })}>
            <div className='col s6 p-0'>
              <span>* This Booking can be cancelled up to 1 day before checkin.</span>
            </div>
            <div className='col s6 align-right'>
              {
              serviceBooking && serviceBooking.cancellationPolicy ?
                <div className='cursor' style={{ color: '#bfbfbf', fontSize: '12px' }} onClick={this.changeRemoveCancellationModal.bind(null, true)}>
                  Cancellation Policy <i className='mdi mdi-alert-circle-outline' />
                </div>
              : null
            }
            </div>
          </div>
          <div className='row m-0'>
            <div className='col s12 p-0'>
              {btnBookTransferSegment}
            </div>
          </div>
        </div>
        {/* <div className='row'>
            <div className='col s6'>
              *This booking can be cancelled up to 1 day before checkin.
            </div>
            <div className={cx('col s6', styles.textRight)}>
              {
                serviceBooking.cancellationPolicy ?
                  <div className='exo-colors-text text-data-1 cursor' onClick={this.changeRemoveCancellationModal.bind(null, true)}>
                    Cancellation Policy <i className='mdi mdi-alert-circle-outline' />
                  </div>
                : null
              }
              {btnBookTransferSegment}
            </div>
          </div>
        </div> */}

        {/* Route*/}
        <div style={{ borderTop: '2px solid #eaeaea', fontWeight: 'bold' }}>
          <Card title={routeTitle} titleBackColor='white' noBoxShadow doFullCardTitleExpand>
            <div className='row m-0 mt-22'>
              <div className='col s6 p-0'>
                <span style={{ color: '#bfbfbf', fontWeight: '700', fontSize: '10px' }}>From</span>
                <div className='row m-0'>
                  <div className='col s2 p-0'>
                    <i style={{ fontSize: '16px', color: '#bfbfbf' }} className='mdi mdi-map-marker' />
                  </div>
                  <div className='col s9 p-0'>
                    <div className={styles.select} style={{ width: '95%' }}>
                      <input style={{ height: '20px' }} disabled value={(this.props.viewer.serviceBookings[this.props.activeDetail] && this.props.viewer.serviceBookings[this.props.activeDetail].route && this.props.viewer.serviceBookings[this.props.activeDetail].route.from) || ''} />
                      {/* <Select onChange={this.handleChange} disabled={this.state.userRole === 'TA'}>
                        <option disabled>{(this.props.viewer.serviceBookings[this.props.activeDetail] && this.props.viewer.serviceBookings[this.props.activeDetail].route && this.props.viewer.serviceBookings[this.props.activeDetail].route.from) || ''}</option>
                      </Select> */}
                    </div>
                  </div>
                </div>
              </div>
              <div className='col s6 p-0'>
                <span style={{ color: '#bfbfbf', fontWeight: '700', fontSize: '10px' }}>To</span>
                <div className='row m-0'>
                  <div className='col s2 p-0'>
                    <i style={{ fontSize: '16px', color: '#bfbfbf' }} className='mdi mdi-map-marker' />
                  </div>
                  <div className='col s9 p-0'>
                    <div className={styles.select} style={{ width: '95%' }}>
                      <input style={{ height: '20px' }} disabled value={(this.props.viewer.serviceBookings[this.props.activeDetail] && this.props.viewer.serviceBookings[this.props.activeDetail].route && this.props.viewer.serviceBookings[this.props.activeDetail].route.to) || ''} />
                      {/* <Select onChange={this.handleChange} disabled={this.state.userRole === 'TA'}>
                        <option disabled>{(this.props.viewer.serviceBookings[this.props.activeDetail] && this.props.viewer.serviceBookings[this.props.activeDetail].route && this.props.viewer.serviceBookings[this.props.activeDetail].route.to) || ''}</option>
                      </Select> */}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* <div className='row m-0 mb-20'>
            <div className='input-field col s6'>
              <input disabled type='text' placeholder='From' name='route.from' onBlur={this.handleUpdateService} onChange={this.handleChange} value={(this.props.viewer.serviceBookings[this.props.activeDetail].route && this.props.viewer.serviceBookings[this.props.activeDetail].route.from) || ''} />
            </div>
            <div className='input-field col s6'>
              <input disabled type='text' placeholder='To' name='route.to' onBlur={this.handleUpdateService} onChange={this.handleChange} value={(this.props.viewer.serviceBookings[this.props.activeDetail].route && this.props.viewer.serviceBookings[this.props.activeDetail].route.to) || ''} />
            </div>
          </div> */}
            <div className='row m-0'>
              <div className='col s6 p-0'>
                <span style={{ color: '#bfbfbf', fontWeight: '700', fontSize: '10px' }}>Departure time</span>
                <div className='row m-0'>
                  <div className='col s2 p-0'>
                    <i style={{ fontSize: '16px', color: '#bfbfbf' }} className='mdi mdi-clock' />
                  </div>
                  <div className='col s9 p-0'>
                    <div className={styles.select} style={{ width: '95%' }}>
                      <input style={{ height: '20px' }} disabled value={(this.props.viewer.serviceBookings[this.props.activeDetail] && this.props.viewer.serviceBookings[this.props.activeDetail].route && this.props.viewer.serviceBookings[this.props.activeDetail].route.departureTime) || ''} />
                      {/* <Select onChange={this.handleChange} disabled={this.state.userRole === 'TA'}>
                        <option disabled>{(this.props.viewer.serviceBookings[this.props.activeDetail] && this.props.viewer.serviceBookings[this.props.activeDetail].route && this.props.viewer.serviceBookings[this.props.activeDetail].route.departureTime) || ''}</option>
                      </Select> */}
                    </div>
                  </div>
                </div>
              </div>
              <div className='col s6 p-0'>
                <span style={{ color: '#bfbfbf', fontWeight: '700', fontSize: '10px' }}>Arrival time</span>
                <div className='row m-0'>
                  <div className='col s2 p-0'>
                    <i style={{ fontSize: '16px', color: '#bfbfbf' }} className='mdi mdi-clock' />
                  </div>
                  <div className='col s9 p-0'>
                    <div className={styles.select} style={{ width: '95%' }}>
                      <input style={{ height: '20px' }} disabled value={(this.props.viewer.serviceBookings[this.props.activeDetail] && this.props.viewer.serviceBookings[this.props.activeDetail].route && this.props.viewer.serviceBookings[this.props.activeDetail].route.arrivalTime) || ''} />
                      {/* <Select onChange={this.handleChange} disabled={this.state.userRole === 'TA'}>
                        <option disabled>{(this.props.viewer.serviceBookings[this.props.activeDetail] && this.props.viewer.serviceBookings[this.props.activeDetail].route && this.props.viewer.serviceBookings[this.props.activeDetail].route.arrivalTime) || ''}</option>
                      </Select> */}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className='row m-0'>
              <div className='col s6 p-0'>
                <span style={{ color: '#bfbfbf', fontWeight: '700', fontSize: '10px' }}>Reference</span>
                <div className='row m-0'>
                  <div className='col s2 p-0'>
                    <i style={{ fontSize: '16px', color: '#bfbfbf' }} className='mdi mdi-flag' />
                  </div>
                  <div className='col s9 p-0'>
                    <div className={styles.select} style={{ width: '95%' }}>
                      <input style={{ height: '20px' }} disabled placeholder='' type='text' name='route.refNo' onBlur={this.handleUpdateService} onChange={this.handleChange} value={(this.props.viewer.serviceBookings[this.props.activeDetail] && this.props.viewer.serviceBookings[this.props.activeDetail].route && this.props.viewer.serviceBookings[this.props.activeDetail].route.refNo) || ''} />
                    </div>
                  </div>
                </div>
              </div>
              <div className='col s6 p-0'>
                <span style={{ color: '#bfbfbf', fontWeight: '700', fontSize: '10px' }}>With guide</span>
                <div className='row m-0'>
                  <div className='col s2 p-0'>
                    <i style={{ fontSize: '16px', color: '#bfbfbf' }} className='mdi mdi-account' />
                  </div>
                  <div className='col s9 p-0'>
                    <div className={styles.select} style={{ width: '95%' }}>
                      <input style={{ height: '20px' }} type='text' disabled name='route.refNo' onBlur={this.handleUpdateService} onChange={this.handleChange} value={(this.props.viewer.serviceBookings[this.props.activeDetail] && this.props.viewer.serviceBookings[this.props.activeDetail].route && this.props.viewer.serviceBookings[this.props.activeDetail].route.withGuide) || ''} />
                      {/* <Select onChange={this.handleUpdateService} name='route.withGuide' value={guide_opted_value}>
                      <option key='1' value='English'>English</option>
                      <option key='2' value='French'>French</option>
                      <option key='3' value='Russian'>Russian</option>
                    </Select> */}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className='row m-0'>
              <div className='col s12 align-left'>
                <span style={{ fontSize: '10px', color: '#ababab' }}>* All times are local</span>
              </div>
            </div>
          </Card>
        </div>

        {/* Travellers */}
        <div style={{ borderTop: '2px solid #eaeaea', fontWeight: 'bold' }}>
          <Card title={travellersTitle} titleBackColor='white' noBoxShadow doFullCardTitleExpand>
            <div className='row m-0'>
              <div className='col s6 p-0'>
                <span style={{ color: '#bfbfbf', fontWeight: '700', fontSize: '10px' }}>Travelers</span>
                <div className='row m-0'>
                  <div className='col s2 p-0'>
                    <i style={{ fontSize: '16px', color: '#bfbfbf' }} className='mdi mdi-account' />
                  </div>
                  <div className='col s9 p-0'>
                    <div>
                      <span className='lh-25'>{(this.props.nrPaxs && this.props.nrPaxs.nrTotalPax) || 0 }</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className='col s6 p-0'>
                <span style={{ color: '#bfbfbf', fontWeight: '700', fontSize: '10px' }}>Seats/Vehcile</span>
                <div className='row m-0'>
                  <div className='col s2 p-0'>
                    <i style={{ fontSize: '16px', color: '#bfbfbf' }} className='mdi mdi-seat-recline-normal' />
                  </div>
                  <div className='col s9 p-0'>
                    <div>
                      <span className='lh-25' >{(
                      this.props.viewer.serviceBookings[this.props.activeDetail]
                      && this.props.viewer.serviceBookings[this.props.activeDetail].transfer
                      && this.props.viewer.serviceBookings[this.props.activeDetail].transfer.vehicle
                      && this.props.viewer.serviceBookings[this.props.activeDetail].transfer.vehicle.maxPax) || 0 }</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* <div className='row m-0'>
            <div className='col s6'>
              <span><i className='mdi-social-person fs-24 exo-colors-text text-data-1' /> Total travellers</span>
            </div>
            <div className='col s6'>
              <span className='lh-25'>{(this.props.nrPaxs && this.props.nrPaxs.nrTotalPax) || 0 }</span>
            </div>
          </div>
          <div className='row m-0'>
            <div className='col s6'>
              <span><i className='mdi mdi-seat-recline-normal fs-24 exo-colors-text text-data-1' /> Seats per vehicle</span>
            </div>
            <div className='col s6'>
              <span className='lh-25'>{(
                this.props.viewer.serviceBookings[this.props.activeDetail].transfer
                && this.props.viewer.serviceBookings[this.props.activeDetail].transfer.vehicle
                && this.props.viewer.serviceBookings[this.props.activeDetail].transfer.vehicle.maxPax) || 0 }</span>
            </div>
          </div> */}
            {
            serviceBooking && serviceBooking.childPolicy ?
              <div className={cx('col s12 p-0 cursor fs-10', styles.textRight)} onClick={this.changeRemoveChildModal.bind(null, true)}>
                Child Policy <i className='mdi mdi-alert-circle-outline' />
              </div>
              : null
          }
          </Card>
        </div>

        {/* Pickup / Drop-off */}
        <div style={{ borderTop: '2px solid #eaeaea', fontWeight: 'bold' }}>
          <Card title={pdTitle} titleBackColor='white' noBoxShadow minimized doFullCardTitleExpand>
            <div className='row m-0 mt-20'>
              <div className='col s12 fs-15'> Pick up</div>
            </div>
            <div className='row m-0'>
              <div className='col s6 p-0'>
                <span style={{ color: '#bfbfbf', fontWeight: '700', fontSize: '10px' }}>Pick up time</span>
                <div className='row m-0'>
                  <div className='col s2 p-0'>
                    <i style={{ fontSize: '16px', color: '#bfbfbf' }} className='mdi mdi-clock' />
                  </div>
                  <div className='col s9 p-0'>
                    <div className={styles.select} style={{ width: '95%' }}>
                      <Select onChange={this.changeDay} disabled={this.state.userRole === 'TA'}>
                        <option disabled>{(this.state.patchData && this.state.patchData.pickupTime) || '8:30 AM'}</option>
                      </Select>
                    </div>
                  </div>
                </div>
              </div>
              <div className='col s6 p-0'>
                <span style={{ color: '#bfbfbf', fontWeight: '700', fontSize: '10px' }}>Pick up location</span>
                <div className='row m-0'>
                  <div className='col s2 p-0'>
                    <i style={{ fontSize: '16px', color: '#bfbfbf' }} className='mdi mdi-map-marker' />
                  </div>
                  <div className='col s9 p-0'>
                    <div className={styles.select} style={{ width: '95%' }}>
                      <input type='text' placeholder='Pick-up location' id='pickup-location' name='pickUp.location' onBlur={this.handleUpdateService} onChange={(e) => { this.setState({ pickupLocation: e.target.value }); }} value={this.state.pickupLocation} disabled={this.state.userRole === 'TA'} />

                      {/* <Select onChange={this.changeDay} disabled={this.state.userRole === 'TA'}>
                        <option disabled>{(this.state.patchData.pickUp && this.state.patchData.pickUp.location) || 'Bangkok Hotel'}</option>
                      </Select> */}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className='row m-0 p-0'>
              <div className='col s12 p-0'>
                <span style={{ color: '#bfbfbf', fontWeight: '700', fontSize: '10px' }}>Note</span>
                <div className='row m-0'>
                  <div className='col s1 p-0'>
                    <i style={{ fontSize: '16px', color: '#bfbfbf', marginTop: '10px' }} className='mdi mdi-message' />
                  </div>
                  <div className='col s11 p-0 pr-18'>
                    <textarea type='text' style={{ resize: 'none', border: 'none', borderBottom: '1px solid #bfbfbf', height: '2rem' }} />
                  </div>
                </div>
              </div>
            </div>
            <div className='row m-0'>
              <div className='col s12 fs-15'> Drop off</div>
            </div>
            <div className='row m-0'>
              <div className='col s6 p-0'>
                <span style={{ color: '#bfbfbf', fontWeight: '700', fontSize: '10px' }}>Drop off time</span>
                <div className='row m-0'>
                  <div className='col s2 p-0'>
                    <i style={{ fontSize: '16px', color: '#bfbfbf' }} className='mdi mdi-clock' />
                  </div>
                  <div className='col s9 p-0'>
                    <div className={styles.select} style={{ width: '95%' }}>
                      <Select onChange={this.changeDay} disabled={this.state.userRole === 'TA'}>
                        <option disabled>{(this.state.patchData && this.state.patchData.dropoffTime) || '8:30 PM'}</option>
                      </Select>
                    </div>
                  </div>
                </div>
              </div>
              <div className='col s6 p-0'>
                <span style={{ color: '#bfbfbf', fontWeight: '700', fontSize: '10px' }}>Drop off location</span>
                <div className='row m-0'>
                  <div className='col s2 p-0'>
                    <i style={{ fontSize: '16px', color: '#bfbfbf' }} className='mdi mdi-map-marker' />
                  </div>
                  <div className='col s9 p-0'>
                    <div className={styles.select} style={{ width: '95%' }}>
                      <input type='text' placeholder='Drop-off location' id='dropoff-location' name='dropOff.location' onBlur={this.handleUpdateService} onChange={(e) => { this.setState({ dropoffLocation: e.target.value }); }} value={this.state.dropoffLocation} disabled={this.state.userRole === 'TA'} />
                      {/* <Select onChange={this.changeDay} disabled={this.state.userRole === 'TA'}>
                        <option disabled>{(this.state.patchData.dropOff && this.state.patchData.dropOff.location) || 'Bangkok Hotel'}</option>
                      </Select> */}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className='row m-0 p-0'>
              <div className='col s12 p-0'>
                <span style={{ color: '#bfbfbf', fontWeight: '700', fontSize: '10px' }}>Note</span>
                <div className='row m-0'>
                  <div className='col s1 p-0'>
                    <i style={{ fontSize: '16px', color: '#bfbfbf', marginTop: '10px' }} className='mdi mdi-message' />
                  </div>
                  <div className='col s11 p-0 pr-18'>
                    <textarea type='text' style={{ resize: 'none', border: 'none', borderBottom: '1px solid #bfbfbf', height: '2rem' }} />
                  </div>
                </div>
              </div>
            </div>
            <input name='longDistanceOption' type='checkbox' id='checkbox1' checked={this.props.viewer.serviceBookings[this.props.activeDetail] && this.props.viewer.serviceBookings[this.props.activeDetail].longDistanceOption} onChange={this.handleUpdateService} />
            <label htmlFor='checkbox1' style={{ fontWeight: 'bold', fontSize: '10px', color: 'black' }} >Request long distance service ( > 10km )</label>
            <br />
            <input name='afterHoursTransferOption' type='checkbox' id='checkbox2' checked={this.props.viewer.serviceBookings[this.props.activeDetail] && this.props.viewer.serviceBookings[this.props.activeDetail].afterHoursTransferOption} onChange={this.handleUpdateService} />
            <label htmlFor='checkbox2' style={{ fontWeight: 'bold', fontSize: '10px', color: 'black' }} >Request after-hours service</label>
          </Card>
        </div>

        {/* Notes */}
        <div style={{ borderTop: '2px solid #eaeaea', fontWeight: 'bold' }}>
          <Card title={noteTitle} titleBackColor='white' noBoxShadow minimized doFullCardTitleExpand>
            <div className='row m-0 p-0'>
              <div className='col s12 p-0'>
                <span style={{ color: '#bfbfbf', fontWeight: '700', fontSize: '10px' }}>Note</span>
                <div className='row m-0'>
                  <div className='col s1 p-0'>
                    <i style={{ fontSize: '16px', color: '#bfbfbf', marginTop: '10px' }} className='mdi mdi-message' />
                  </div>
                  <div className='col s11 p-0 pr-18'>
                    <textarea type='text' style={{ resize: 'none', border: 'none', borderBottom: '1px solid #bfbfbf', height: '2rem' }} />
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Extra Options */}
        { extras ?
          <div style={{ fontWeight: 'bold' }}>
            <Card title={extraTitle} titleBackColor='white' noBoxShadow minimized doFullCardTitleExpand>
              <div className='row mt-0 extra'>
                {extras}
              </div>
            </Card>
          </div>
          : null
        }

        {
          this.state.isCancellationModalOpen ?
            <Modal showCancelButton={false} isModalOpened={this.state.isCancellationModalOpen} changeModalState={this.changeRemoveCancellationModal}>
              <h2>Cancellation Policy</h2>
              <p>{serviceBooking && serviceBooking.cancellationPolicy}</p>
            </Modal>
          : null
        }

        {
          this.state.isChildModalOpen ?
            <Modal showCancelButton={false} isModalOpened={this.state.isChildModalOpen} changeModalState={this.changeRemoveChildModal}>
              <h2>Child Policy</h2>
              <p>{serviceBooking && serviceBooking.childPolicy}</p>
            </Modal>
          : null
        }
      </div>
    );
  }
}
