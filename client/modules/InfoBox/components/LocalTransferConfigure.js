import React, { Component, PropTypes } from 'react';
import Relay from 'react-relay';
import _ from 'lodash';
import cx from 'classnames';
import { FaCalendarCheckO, FaCalendarTimesO, FaDollar } from 'react-icons/lib/fa';
import { Card, Modal, Select2, Select } from '../../Utils/components';
import UpdateServiceMutation from '../../ServiceBooking/mutations/UpdateService';
import styles from '../style.module.scss';
import SERVICES from '../../../services';

export default class LocalTransferConfigure extends Component {
  static propTypes = {
    viewer: PropTypes.object.isRequired,
    activeDetail: PropTypes.number.isRequired,
    serviceState: PropTypes.string,
    availability: PropTypes.object
  };

  static defaultProps = {
    serviceState: '',
    availability: {}
  };

  state = {
    patchData: this.props.viewer.serviceBookings[this.props.activeDetail],
    isCancellationModalOpen: false,
    isChildModalOpen: false,
    pickupLocation: '',
    dropoffLocation: '',
    state_travelTimeStartSlot: this.props.viewer.serviceBookings[this.props.activeDetail].startSlot
  };

  componentWillReceiveProps(nextProps) {
    this.setState({ patchData: nextProps.viewer.serviceBookings[nextProps.activeDetail],
      pickupLocation: (nextProps.viewer.serviceBookings[nextProps.activeDetail] && nextProps.viewer.serviceBookings[nextProps.activeDetail].pickUp && nextProps.viewer.serviceBookings[nextProps.activeDetail].pickUp.location) || '',
      dropoffLocation: (nextProps.viewer.serviceBookings[nextProps.activeDetail] && nextProps.viewer.serviceBookings[nextProps.activeDetail].dropOff && nextProps.viewer.serviceBookings[nextProps.activeDetail].dropOff.location) || '' });
  }

  handle_startSlot = (e) => {
    const old_val = this.props.viewer.serviceBookings[this.props.activeDetail].startSlot;
    const new_val = e.target.value;

    if (old_val * 1 !== new_val * 1) {
      this.handleUpdateService(e);
    }
  }

  handleUpdateService = (e) => {
    let name = e.target.name; // eslint-disable-line prefer-const
    const value = (e.target.type === 'checkbox' ? e.target.checked : e.target.value);
    const patchData = {};
    // if (name.indexOf('extras') !== 0) {
    //   const idx = name.substring(5);
    //   patchData.extras[idx] = value;
    //   name = 'extras';
    // }
    _.set(patchData, name, value);

    // if (e.target.type !== 'select-one') {
    Relay.Store.commitUpdate(new UpdateServiceMutation({
      serviceBookingId: this.props.viewer.serviceBookings[this.props.activeDetail].id,
      serviceBookingKey: this.props.viewer.serviceBookings[this.props.activeDetail]._key,
      patchData
    }));
    // }
    this.handleChange(e);
  };

  handleChange = (e) => {
    let name = e.target.name; // eslint-disable-line prefer-const
    const value = (e.target.type === 'checkbox' ? e.target.checked : e.target.value);
    const patchData = { ...this.state.patchData };
    // if (name.indexOf('extras') !== 0) {
    //   const idx = name.substring(5);
    //   patchData.extras[idx] = value;
    //   name = 'extras';
    // }
    _.set(patchData, name, value);
    this.setState({ patchData });
    // for timeslot
    if (name === 'startSlot') {
      this.setState({
        state_travelTimeStartSlot: value
      });
    }
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

  availabilityInfo() {
    switch (this.props.serviceState) {
      case 'Unavailable':
        return (<div className='exo-colors-text text-error-front availabilityInfo'>
          <FaCalendarTimesO size={18} /> <div>Unavailable</div>
        </div>);
      case 'Booked':
        return (<div className='availabilityInfo'>
          <i className='mdi mdi-cash-usd fs-25' /> <div>Booked</div>
        </div>);
      case 'Available':
        return (<div className='exo-colors-text text-darken-2 availabilityInfo'>
          <FaCalendarCheckO size={18} /> <div>Available</div>
        </div>);
      case 'On Request':
        return (<div className='exo-colors-text text-accent-4 availabilityInfo' style={{ padding: '6px 0' }}>
          <i className='mdi mdi-calendar-blank' /> <div>On Request</div>
        </div>);
      default:
        return (<div className='availabilityInfo'>
          --
        </div>);
    }
  }

  changeRemoveCancellationModal = (isOpen) => {
    this.setState({ isCancellationModalOpen: isOpen });
  };

  changeRemoveChildModal = (isOpen) => {
    this.setState({ isChildModalOpen: isOpen });
  };

  render() {
    const spanHead = styles.configHead;
    const { viewer } = this.props;
    const noteTitle = <h5 style={{ fontWeight: 'bold' }}>Note</h5>;
    const extraTitle = <h5 style={{ fontWeight: 'bold' }}>Extra Options</h5>;
    const travellersTitle = <h5 style={{ fontWeight: 'bold' }}>Travellers</h5>;
    const pdTitle = <h5 style={{ fontWeight: 'bold' }}>Pickup / Drop-off</h5>;
    const routeTitle = <h5 style={{ fontWeight: 'bold' }}>Route</h5>;
    let extras;  // eslint-disable-line no-unused-vars

    if (viewer.serviceBookings[this.props.activeDetail].localtransfer.extras) {
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

    const data = this.props.viewer.serviceBookings[this.props.activeDetail].localtransfer;
    let fromCityName = (data.route.from.place || data.route.from.localityName || data.route.from.cityName);
    let toCityName = (data.route.to.place || data.route.to.localityName || data.route.to.cityName);
    if (this.state.patchData.route && this.state.patchData.route.from) {
      fromCityName = this.state.patchData.route.from;
    }
    if (this.state.patchData.route && this.state.patchData.route.to) {
      toCityName = this.state.patchData.route.to;
    }

    // added on 4th nove
    // const travelTimeStartSlot = this.props.viewer.serviceBookings[this.props.activeDetail].startSlot;
    const travelTimeStartSlot = this.state.state_travelTimeStartSlot;
    const t_refNo = (this.props.viewer.serviceBookings[this.props.activeDetail].route
      && this.props.viewer.serviceBookings[this.props.activeDetail].route.refNo)
    || '';
    const t_withGuide = (this.props.viewer.serviceBookings[this.props.activeDetail].route
      && this.props.viewer.serviceBookings[this.props.activeDetail].route.withGuide)
    || '';


    const sb_currency = (this.props.viewer.serviceBookings[this.props.activeDetail].price && this.props.viewer.serviceBookings[this.props.activeDetail].price.currency || 'USD'); // eslint-disable-line no-mixed-operators
    const showCurrencyIcon = SERVICES.currency[sb_currency];

    let price = (this.props.viewer.serviceBookings[this.props.activeDetail].price && this.props.viewer.serviceBookings[this.props.activeDetail].price.amount) || '';

    if (price === '' || price === null) {
      price = '';
    } else {
      price = this._priceFormat(price);
    }


    return (
      <div className='configure'>
        <div className='general'>
          {/* <div className='row mt-0'>
            <div className='col s8'>
              {this.availabilityInfo()}
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

            <div className='col s6 p-0 pl-30'>
              <span>Price</span>
              <div>
                <div style={{ float: 'left', paddingTop: '3px' }}>
                  {showCurrencyIcon}
                </div>
                <div style={{ float: 'right', width: '85%' }}>
                  <input style={{ marginTop: '9px', fontWeight: 'bold', height: '2rem' }} type='text' placeholder='Price' name='price.amount' onBlur={this.handleUpdateService} onChange={this.handleChange} value={price} />
                </div>
                <div style={{ clear: 'both' }} />
              </div>
              {/* <div style={{ marginTop: '9px', fontWeight: 'bold' }}>  ${(this.props.viewer.serviceBookings[this.props.activeDetail].price && this.props.viewer.serviceBookings[this.props.activeDetail].price.amount) || ''}</div> */}
            </div>
          </div>

          <div className='row'>
            <div className='col s12'>
              <div className='exo-colors-text text-label-1'>{t_withGuide}</div>
            </div>
          </div>
          <div className={cx(spanHead, 'row m-0 pt-10 fw-700', { 'fs-13': !SERVICES.isSideNavOpen }, { 'fs-10': SERVICES.isSideNavOpen })}>
            <div className='col s6 p-0'>
              <span>* This Booking can be cancelled up to 1 day before checkin.</span>
            </div>
            <div className='col s6 align-right'>
              {
              serviceBooking.cancellationPolicy ?
                <div className='cursor' style={{ color: '#bfbfbf', fontSize: '12px' }} onClick={this.changeRemoveCancellationModal.bind(null, true)}>
                  Cancellation Policy <i className='mdi mdi-alert-circle-outline' />
                </div>
              : null
            }
            </div>
          </div>
          <div className='row m-0'>
            <div className='col s12 p-0'>
              <div style={{ paddingTop: '15px', fontSize: '11px', color: '#00c498', fontWeight: '700', textAlign: 'right' }}>
                <a href='#!'> <i className='mdi mdi-cash-usd' />  BOOK TRANSFER SEGMENT</a>
              </div>
            </div>
          </div>

          {/* <div className='row'>
            <div className='col s6'>
              This booking can be cancelled up to 1 day before checkin.
            </div>
            <div className={cx('col s6', styles.textRight)}>
              {
                serviceBooking.cancellationPolicy ?
                  <div className='exo-colors-text text-data-1 cursor' onClick={this.changeRemoveCancellationModal.bind(null, true)}>
                    Cancellation Policy <i className='mdi mdi-alert-circle-outline' />
                  </div>
                : null
              }
              <div className='exo-colors-text text-data-1' style={{ paddingTop: '15px' }}><i className='mdi mdi-cash-usd' /> BOOK TRANSFER SEGMENT</div>
            </div>
          </div> */}
        </div>


        {/* Route */}
        <div style={{ borderTop: '2px solid #eaeaea', fontWeight: 'bold' }}>
          <Card title={routeTitle} titleBackColor='white' noBoxShadow doFullCardTitleExpand>
            <div className='row m-0 mt-22'>
              <div className='col s6 p-0'>
                <span style={{ color: '#bfbfbf', fontWeight: '700', fontSize: '10px' }}>From</span>
                <div className='row m-0'>
                  <div className='col s2 p-0'>
                    <i style={{ fontSize: '16px', color: '#bfbfbf' }} className='mdi mdi-map' />
                  </div>
                  <div className='col s9 p-0'>
                    <div className={styles.select} style={{ width: '95%' }}>
                      <input disabled type='text' placeholder='From' name='route.from' onBlur={this.handleUpdateService} onChange={this.handleChange} value={fromCityName} />
                      {/* <Select onChange={this.handleChange} disabled={this.state.userRole === 'TA'}>
                        <option disabled>{(this.props.viewer.serviceBookings[this.props.activeDetail].route && this.props.viewer.serviceBookings[this.props.activeDetail].route.from) || ''}</option>
                      </Select> */}
                    </div>
                  </div>
                </div>
              </div>
              <div className='col s6 p-0'>
                <span style={{ color: '#bfbfbf', fontWeight: '700', fontSize: '10px' }}>To</span>
                <div className='row m-0'>
                  <div className='col s2 p-0'>
                    <i style={{ fontSize: '16px', color: '#bfbfbf' }} className='mdi mdi-map' />
                  </div>
                  <div className='col s9 p-0'>
                    <div className={styles.select} style={{ width: '95%' }}>
                      <input disabled type='text' placeholder='To' name='route.to' onBlur={this.handleUpdateService} onChange={this.handleChange} value={toCityName} />
                      {/* <Select onChange={this.handleChange} disabled={this.state.userRole === 'TA'}>
                        <option disabled>{(this.props.viewer.serviceBookings[this.props.activeDetail].route && this.props.viewer.serviceBookings[this.props.activeDetail].route.to) || ''}</option>
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
              <div className='col s12 p-0'>
                <span style={{ color: '#bfbfbf', fontWeight: '700', fontSize: '10px' }}>Departure time</span>
                <div className='row m-0'>
                  <div className='col s1 p-0'>
                    <i style={{ fontSize: '16px', color: '#bfbfbf' }} className='mdi mdi-clock' />
                  </div>
                  <div className='col s11 p-0'>
                    <div className={styles.select} style={{ width: '95%' }}>
                      <Select2
                        data={[
                          { id: '', text: '--Select Travel Time--' },
                          { id: 1, text: 'Morning' },
                          { id: 2, text: 'Afternoon' },
                          { id: 3, text: 'Evening' }
                        ]}
                        value={travelTimeStartSlot}
                        // onChange={this.handleChange, this.handleUpdateService} // eslint-disable-line no-sequences
                        onChange={this.handle_startSlot} // eslint-disable-line no-sequences
                        name='startSlot'
                      />
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
                      <input style={{ height: '20px' }} disabled placeholder='' type='text' name='route.refNo' onBlur={this.handleUpdateService} onChange={this.handleChange} value={t_refNo} />
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
                      {/* <input style={{ height: '20px' }} type='text' name='route.refNo' onBlur={this.handleUpdateService} onChange={this.handleChange} /> */}
                      <input style={{ height: '20px' }} type='text' disabled placeholder='' name='route.withGuide' onBlur={this.handleUpdateService} onChange={this.handleChange} value={t_withGuide} />

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
        {/* <Card title={routeTitle} doFullCardTitleExpand>
          <div className='row  mb-20'>
            <div className='input-field col s6'>
              <input disabled type='text' placeholder='From' name='route.from' onBlur={this.handleUpdateService} onChange={this.handleChange} value={fromCityName} />
            </div>
            <div className='input-field col s6'>
              <input disabled type='text' placeholder='To' name='route.to' onBlur={this.handleUpdateService} onChange={this.handleChange} value={toCityName} />
            </div>
          </div>
          <div className='row  mb-20'>
            <div className='input-field col s12'>
              <Select2
                data={[
                  { id: '', text: '--Select Travel Time--' },
                  { id: 1, text: 'Morning' },
                  { id: 2, text: 'Afternoon' },
                  { id: 3, text: 'Evening' }
                ]}
                value={travelTimeStartSlot}
                onChange={this.handleChange, this.handleUpdateService} // eslint-disable-line no-sequences
                name='startSlot'
              />
            </div>
          </div>
          <div className='row mb-20'>
            <div className='input-field col s6'>
              <input type='text' placeholder='Reference #' name='route.refNo' onBlur={this.handleUpdateService} onChange={this.handleChange} value={t_refNo} />
            </div>
            <div className='input-field col s6'>
              <input type='text' placeholder='With guide' name='route.withGuide' onBlur={this.handleUpdateService} onChange={this.handleChange} value={t_withGuide} />
            </div>
          </div>
          <div className='row'>
            <div className='col s12 align-right'>
              <span>All times are local</span>
            </div>
          </div>
        </Card> */}

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
                      this.props.viewer.serviceBookings[this.props.activeDetail].localtransfer
                      && this.props.viewer.serviceBookings[this.props.activeDetail].localtransfer.vehicle
                      && this.props.viewer.serviceBookings[this.props.activeDetail].localtransfer.vehicle.maxPax) || 0 }</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {
            serviceBooking.childPolicy ?
              <div className='exo-colors-text text-data-1 cursor right' onClick={this.changeRemoveChildModal.bind(null, true)}>
                Child Policy <i className='mdi mdi-alert-circle-outline' />
              </div>
              : null
          }
          </Card>
        </div>

        {/* Pickup / Drop-off */}
        {/* <Card title={pdTitle} minimized doFullCardTitleExpand>
          <div className='row mb-20'>
            <div className='col s12'><i className='mdi-navigation-arrow-back fs-20' /> Pick-up</div>
            <div className='input-field col s3'>
              <input type='text' name='pickUp.time' onBlur={this.handleUpdateService} onChange={this.handleChange} value={(this.state.patchData.pickUp && this.state.patchData.pickUp.time) || ''} />
            </div>
            <div className='input-field col s9'>
              <input type='text' placeholder='Pick-up location' id='pickup-location' name='pickUp.location' onBlur={this.handleUpdateService} onChange={this.handleChange} value={(this.state.patchData.pickUp && this.state.patchData.pickUp.location) || ''} />
            </div>
            <div className='input-field col s12'>
              <textarea placeholder='Pick-up notes' type='text' id='pickup-notes' className='materialize-textarea' name='pickUp.remarks' onBlur={this.handleUpdateService} onChange={this.handleChange} value={(this.state.patchData.pickUp && this.state.patchData.pickUp.remarks) || ''} />
            </div>
          </div>

          <div className='row'>
            <div className='col s12'><i className='mdi-navigation-arrow-forward fs-20' /> Drop-off</div>
            <div className='input-field col s3'>
              <input type='text' name='dropOff.time' onBlur={this.handleUpdateService} onChange={this.handleChange} value={(this.state.patchData.dropOff && this.state.patchData.dropOff.time) || ''} />
            </div>
            <div className='input-field col s9'>
              <input type='text' placeholder='Drop-off location' id='dropoff-location' name='dropOff.location' onBlur={this.handleUpdateService} onChange={this.handleChange} value={(this.state.patchData.dropOff && this.state.patchData.dropOff.location) || ''} />
            </div>
            <div className='input-field col s12'>
              <textarea placeholder='Drop-off notes' type='text' id='dropoff-notes' className='materialize-textarea' name='dropOff.remarks' onBlur={this.handleUpdateService} onChange={this.handleChange} value={(this.state.patchData.dropOff && this.state.patchData.dropOff.remarks) || ''} />
            </div>

            <div className='col s12'>
              <input name='longDistanceOption' type='checkbox' id='checkbox1' checked={this.props.viewer.serviceBookings[this.props.activeDetail].longDistanceOption} onChange={this.handleUpdateService} />
              <label htmlFor='checkbox1'>Request long distance service ( > 10km )</label>
            </div>
            <div className='col s12'>
              <input name='afterHoursTransferOption' type='checkbox' id='checkbox2' checked={this.props.viewer.serviceBookings[this.props.activeDetail].afterHoursTransferOption} onChange={this.handleUpdateService} />
              <label htmlFor='checkbox2'>Request after-hours service</label>
            </div>
          </div>
        </Card> */}
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
                        <option disabled>{(this.state.patchData.pickUp && this.state.patchData.pickUp.time) || '8:30 AM'}</option>
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
                        <option disabled>{(this.state.patchData.dropOff && this.state.patchData.dropOff.time) || '8:30 PM'}</option>
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
            <input name='longDistanceOption' type='checkbox' id='checkbox1' checked={this.props.viewer.serviceBookings[this.props.activeDetail].longDistanceOption} onChange={this.handleUpdateService} />
            <label htmlFor='checkbox1' style={{ fontWeight: 'bold', fontSize: '10px', color: 'black' }} >Request long distance service ( > 10km )</label>
            <br />
            <input name='afterHoursTransferOption' type='checkbox' id='checkbox2' checked={this.props.viewer.serviceBookings[this.props.activeDetail].afterHoursTransferOption} onChange={this.handleUpdateService} />
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
              <p>{serviceBooking.cancellationPolicy}</p>
            </Modal>
          : null
        }

        {
          this.state.isChildModalOpen ?
            <Modal showCancelButton={false} isModalOpened={this.state.isChildModalOpen} changeModalState={this.changeRemoveChildModal}>
              <h2>Child Policy</h2>
              <p>{serviceBooking.childPolicy}</p>
            </Modal>
          : null
        }
      </div>
    );
  }
}
