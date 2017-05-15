import React, { Component, PropTypes } from 'react';
import Relay from 'react-relay';
import cx from 'classnames';
import moment from 'moment';
import { FaCalendarCheckO, FaCalendarTimesO, FaDollar } from 'react-icons/lib/fa';
import _ from 'lodash';
import shortId from 'shortid';
import { Card, Modal, Select } from '../../Utils/components';
import UpdateServiceMutation from '../../ServiceBooking/mutations/UpdateService';
import UpdateTourPaxsMutation from '../mutations/UpdateTourPaxs';
import Pax from './Pax';
import ConfirmAvailabilityMutation from '../../ServiceBooking/mutations/ConfirmAvailability';
import ServiceBookingPaxStatus from '../renderers/ServiceBookingPaxStatusRenderer';
import { getUserRole } from '../../../services/user';
import styles from '../style.module.scss';
import SERVICES from '../../../services';
// import {materializeClockpicker} from 'materialize-clockpicker';
// import "materialize-clockpicker/src/js/materialize.clockpicker.js";
// import "materialize-clockpicker/dist/css/materialize.clockpicker.css";

export default class TourConfigure extends Component {
  static propTypes = {
    viewer: PropTypes.object.isRequired,
    serviceStatus: PropTypes.string,
    cityDayKey: PropTypes.string,
    tripKey: PropTypes.string,
    availability: PropTypes.object,
    paxs: PropTypes.array,
    relay: PropTypes.object,
    serviceState: PropTypes.string,
    tpAvailabilityStatus: PropTypes.string,
    tpBookingStatus: PropTypes.string,
    currency: PropTypes.string
  };

  static defaultProps = {
    serviceStatus: '',
  };

  state = {
    remarks: '',
    pickupNotes: '',
    dropoffNotes: '',
    patchData: '',
    pickupLocation: '',
    dropoffLocation: '',
    isCancellationModalOpen: false,
    paxStatusKey: shortId.generate(),
    isChildModalOpen: false,
    userRole: getUserRole(),
    isBooked: false,
    pickUpTime: '1100',
    dropOffTime: '1800'
  };
  // componentDidMount() {
  //  this.initMaterialComponent();
  // }
  //
  // initMaterialComponent() {
  //   // Datepicker
  //   $('.timepicker').pickatime({
  //   default: 'now',
  //   twelvehour: false, // change to 12 hour AM/PM clock from 24 hour
  //   donetext: 'OK',
  //   autoclose: false,
  //   vibrate: true // vibrate the device when dragging clock hand
  //   });
  // }

  componentWillReceiveProps(nextProps) {
    let patchData = {};
    const pickupNotes = '';
    const dropoffNotes = '';
    const remarks = '';
    if (nextProps.viewer.serviceBooking.startSlot === 1) {
      patchData = nextProps.viewer.serviceBooking.tour.timeSlots.Morning;
    } else if (nextProps.viewer.serviceBooking.startSlot === 2) {
      patchData = nextProps.viewer.serviceBooking.tour.timeSlots.Afternoon;
    } else {
      patchData = nextProps.viewer.serviceBooking.tour.timeSlots.Evening;
    }
    this.setState({
      patchData,
      pickUpTime: nextProps.viewer.serviceBooking.pickUp.time,
      dropOffTime: nextProps.viewer.serviceBooking.dropOff.time,
      pickupNotes: nextProps.viewer.serviceBooking.pickUp.remarks,
      dropoffNotes: nextProps.viewer.serviceBooking.dropOff.remarks,
      pickupLocation: nextProps.viewer.serviceBooking.pickUp.location || '',
      dropoffLocation: nextProps.viewer.serviceBooking.dropOff.location || '',
      remarks: nextProps.viewer.serviceBooking.remarks,
      isBooked: nextProps.isBooked ? nextProps.isBooked : false
    });
  }

  // when availability status is 'On Request',  the agent connect the hotel provider to ensure.
  // and if the hotel is available, the agent can click 'Confirm Availability' and make the hotel bookable.
  handleConfirmAvalability = () => {
    Relay.Store.commitUpdate(new ConfirmAvailabilityMutation({
      serviceBookingId: this.props.viewer.serviceBooking.id,
      serviceBookingKey: this.props.viewer.serviceBooking._key,
    }), {
      onSuccess: (res) => {
        this.props.relay.forceFetch();
      }
    });
  }

  handleUpdateService = (e) => {
    const name = e.target.name;
    const value = (e.target.type === 'checkbox' ? e.target.checked : e.target.value);

    const patchData = {};
    _.set(patchData, name, value);

    Relay.Store.commitUpdate(new UpdateServiceMutation({
      serviceBookingId: this.props.viewer.serviceBooking.id,
      serviceBookingKey: this.props.viewer.serviceBooking._key,
      patchData
    }));

    this.handleChange(e);
  };

  changeRemoveCancellationModal = (isOpen) => {
    this.setState({ isCancellationModalOpen: isOpen });
  };

  changeChildPolicyModal = (isOpen) => {
    this.setState({ isChildModalOpen: isOpen });
  };

  handleChange = (e) => {
    const name = e.target.name;
    const value = (e.target.type === 'checkbox' ? e.target.checked : e.target.value);

    if (name === 'pickUp.remarks') {
      this.setState({ pickupNotes: value });
    }
    if (name === 'dropOff.remarks') {
      this.setState({ dropoffNotes: value });
    }
    if (name === 'remarks') {
      this.setState({ remarks: value });
    }

    const patchData = { ...this.state.patchData };
    _.set(patchData, name, value);

    this.setState({ patchData });
  };

  handleOnChangePaxs = (paxKeys) => {
    const { viewer } = this.props;

    Relay.Store.commitUpdate(new UpdateTourPaxsMutation({
      paxKeys,
      serviceBookingId: viewer.serviceBooking.id,
      serviceBookingKey: viewer.serviceBooking._key
    }), {
      onSuccess: () => {
        this.setState({
          paxStatusKey: shortId.generate()
        });
      }
    });
  };

  availabilityInfo() {
    const switchCheck = this.props.serviceState;

    switch (switchCheck) {
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
    const { viewer, paxs, cityDayKey, tripKey } = this.props;
    const noteTitle = <h5 style={{ fontWeight: 'bold' }}>Note</h5>;
    const pdTitle = <h5 style={{ fontWeight: 'bold' }}>Pickup / Drop-off</h5>;
    const travellerTitle = <h5 style={{ fontWeight: 'bold' }}> Travellers</h5>;
    const extraTitle = <h5 className='exo-colors-text text-data-1'><i className='mdi-image-style' />Extra Options</h5>;
    let extras;
    let price;
    const spanHead = styles.configHead;

    const showDayValue = this.props.cityDayKey + this.props.viewer.serviceBooking.startSlot;


    // Add : to time
    if (this.state.patchData.pickUp && this.state.patchData.pickUp.time && this.state.patchData.pickUp.time.indexOf(':') === -1) {
      this.state.patchData.pickUp.time = `${this.state.patchData.pickUp.time.slice(0, 2)}:${this.state.patchData.pickUp.time.slice(2)}`;
    }

    if (this.state.patchData.dropOff && this.state.patchData.dropOff.time && this.state.patchData.dropOff.time.indexOf(':') === -1) {
      this.state.patchData.dropOff.time = `${this.state.patchData.dropOff.time.slice(0, 2)}:${this.state.patchData.dropOff.time.slice(2)}`;
    }

    // Put dot to separate the last two zero
    if (this.props.viewer.tourAvailability && this.props.viewer.tourAvailability.totalPrice) {
      price = this.props.viewer.tourAvailability.totalPrice.toString();
      price = `${price.slice(0, price.length - 2)}.${price.slice(price.length - 2)}`;
    } else price = null;

    if (viewer.serviceBooking.tour.extras) {
      extras = viewer.serviceBooking.tour.extras.map((extra, idx) =>
        <div className='col s12' key={idx}>
          <div className='col s2'>
            <input type='text' placeholder='Qty' />
          </div>
          <div className='col s10'>
            <div className='exo-colors-text text-data-1'>{extra.description}</div>
          </div>
        </div>
      );
    }

    let tpBookingRef = '';
    if (this.props.tpBookingRef && this.props.serviceState === 'Booked') {
      tpBookingRef = this.props.tpBookingRef;
    }

    const selectedPaxs = viewer.serviceBooking.roomConfigs.length ? viewer.serviceBooking.roomConfigs[0].paxs : [];


    let showPrice = '';
    if (this.props.viewer.serviceBooking.price && this.props.viewer.serviceBooking.price.amount) {
      showPrice = this.props.viewer.serviceBooking.price.amount;
    }
    if (showPrice === '' || showPrice === null || showPrice === 0) {
      showPrice = '--';
    } else {
      showPrice = SERVICES.currency[this.props.currency || 'USD'] + this._priceFormat(showPrice);
    }

    const btnMakeRoomAvailable = this.state.userRole !== 'TA' && this.props.serviceState === 'On Request'
        ? <div className='availabilityInfo' style={{ color: '#7fc7ae' }} onClick={() => { this.handleConfirmAvalability(); }}><FaCalendarCheckO size={18} /> <div style={{ fontSize: '11px', cursor: 'pointer', color: '#7fc7ae' }}>CONFIRM AVAILABILITY</div></div>
        : null;

    return (
      <div className='configure'>
        <div className='general'>
          <div className={cx(spanHead, 'row m-0 fw-700', { 'fs-13': !SERVICES.isSideNavOpen }, { 'fs-10': SERVICES.isSideNavOpen })}>
            <div className='col s4 p-0'>
              <span>Status</span>
              {this.availabilityInfo()}
            </div>
            <div className='col s5 p-0 pl-15 align-left'>
              <span>Booking Reference</span>
              <div style={{ marginTop: '9px', fontWeight: 'bold' }}>{tpBookingRef}</div>
            </div>
            <div className='col s3 p-0 pl-30'>
              <span>Price</span>
              <div style={{ marginTop: '9px', fontWeight: 'bold' }}>{showPrice}</div>
            </div>
          </div>


          <div className={cx(spanHead, 'row m-0 fw-700', { 'fs-13': !SERVICES.isSideNavOpen }, { 'fs-10': SERVICES.isSideNavOpen })}>
            <div className='col s12'>
              <span>Comment</span>
              <div style={{ marginTop: '20px', fontWeight: 'bold', fontSize: '15px' }}>{viewer.serviceBooking.tour.comment || '-'}</div>
            </div>
          </div>

          <div className={cx(spanHead, 'row m-0 pt-10 fw-700', { 'fs-13': !SERVICES.isSideNavOpen }, { 'fs-10': SERVICES.isSideNavOpen })}>
            <div className='col s6 p-0'>
              <span>*This Tour can be cancelled up to {(this.props.viewer.serviceBooking && (this.props.viewer.serviceBooking.cancelHours / 24)) || '-'} day before pick-up time.</span>
            </div>
            <div className='col s6 align-right'>
              {
              viewer.serviceBooking.tour.cancellationPolicy ?
                <div className='exo-colors-text text-data-1 cursor' onClick={this.changeRemoveCancellationModal.bind(null, true)}>
                  <span>Cancellation Policy <i className='mdi mdi-alert-circle-outline' /></span>
                </div>
              : null
            }
            </div>
          </div>

          <div className='row m-0 fw-700'>
            <div className='col s12 p-0'>
              { btnMakeRoomAvailable }
            </div>
          </div>

        </div>

        {/* Travellers */}
        <div style={{ borderTop: '2px solid #e0e0e0', fontWeight: 'bold' }}>
          <Card title={travellerTitle} titleBackColor='white' noBoxShadow doFullCardTitleExpand >
            <div className='row m-0' style={{ pointerEvents: `${this.state.isBooked ? 'none' : ''}` }}>
              <p style={{ color: '#bfbfbf', fontWeight: '700' }}>Traveller</p>
              <div className='col s1 p-0 mt-18'>
                <i style={{ fontSize: '16px', color: '#bfbfbf' }} className='mdi mdi-account' />
              </div>
              <div className='col s11 p-0' style={{ overflow: 'hidden', width: '85%' }}>
                <Pax key={shortId.generate()} availablePaxs={paxs} selectedPaxs={selectedPaxs} handleOnChange={this.handleOnChangePaxs} />
              </div>
            </div>
            <span style={{ marginLeft: '26px', fontSize: '11px', color: '#bfbfbf' }}>
              { (selectedPaxs && selectedPaxs.length) || 0 } people selected
              {/* <br />
              <br />
              */}
            </span>

            <div className='row m-0'>
              <div className='col s8 p-0 '>
                <ServiceBookingPaxStatus theKey={this.state.paxStatusKey} serviceBookingKey={viewer.serviceBooking._key} cityDayKey={cityDayKey} tripKey={tripKey} />
              </div>
              <div className='col s4 p-0 mt-14'>
                { viewer.serviceBooking.tour.childPolicy ?
                  <div className='exo-colors-text text-data-1 align-right' style={{ cursor: 'Pointer' }} onClick={this.changeChildPolicyModal.bind(null, true)}>Child Policy <i className='mdi mdi-alert-circle-outline' /></div>
                : null
                }
              </div>
            </div>
          </Card>
        </div>

        {/* Pickup / Drop-off */}
        <div style={{ borderTop: '1px solid #e0e0e0', fontWeight: 'bold' }}>
          <Card title={pdTitle} titleBackColor='white' noBoxShadow doFullCardTitleExpand>
            <div className='row m-0 mt-20'>
              <div className='col s12 fs-15'> Pick up</div>
            </div>
            {/* <div >
                        <label htmlFor="timepicker">Time </label>
                        <input id="timepicker" className="timepicker" type="time"/>
                    </div> */}
            <div className='row m-0'>
              <div className='col s6 p-0'>
                <span style={{ color: '#bfbfbf', fontWeight: '700', fontSize: '10px' }}>Pick up time</span>
                <div className='row m-0'>
                  <div className='col s2 p-0'>
                    <i style={{ fontSize: '16px', color: '#bfbfbf' }} className='mdi mdi-clock' />
                  </div>
                  <div className='col s9 p-0'>
                    <div className={styles.select} style={{ width: '95%' }}>
                      <Select value={showDayValue} onChange={this.changeDay} disabled={this.state.userRole === 'TA'}>
                        <option disabled>{ moment(this.state.pickUpTime, ['HHmm']).format('h:mm A') || '8:30'}</option>
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
                      {/* <Select value={showDayValue} onChange={this.changeDay} disabled={this.state.userRole === 'TA'}>
                        <option disabled>{this.props.viewer.serviceBooking.pickUp.location || 'Bangkok Hotel'}</option>
                      </Select> */}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* <div className='input-field col s3'>
              <input type='text' name='pickUp.time' onBlur={this.handleUpdateService} onChange={this.handleChange} value={(this.state.patchData.available && this.state.patchData.pickupTime) || ''} disabled={this.state.userRole === 'TA'} />
            </div> */}
            {/* <div className='input-field col s9'>
              <input type='text' placeholder='Pick-up location' id='pickup-location' name='pickUp.location' onBlur={this.handleUpdateService} onChange={this.handleChange} value={(this.state.patchData.pickUp && this.state.patchData.pickUp.location) || ''} disabled={this.state.userRole === 'TA'} />
            </div> */}
            <div className='row m-0 p-0'>
              <div className='col s12 p-0'>
                <span style={{ color: '#bfbfbf', fontWeight: '700', fontSize: '10px' }}>Note</span>
                <div className='row m-0'>
                  <div className='col s1 p-0'>
                    <i style={{ fontSize: '16px', color: '#bfbfbf', marginTop: '10px' }} className='mdi mdi-message' />
                  </div>
                  <div className='col s11 p-0 pr-18'>
                    <textarea
                      type='text'
                      style={{ resize: 'none', border: 'none', borderBottom: '1px solid #bfbfbf', height: '2rem' }}
                      value={this.state.pickupNotes || ''}
                      id='pickup-notes'
                      name='pickUp.remarks'
                      onBlur={this.handleUpdateService}
                      onChange={this.handleChange}
                    />

                  </div>
                </div>
              </div>
            </div>

            {/* <div className='row'>
            <div className='col s12'><i className='mdi-navigation-arrow-forward fs-20' /> Drop-off</div>
            <div className='input-field col s3'>

                <input type='time' name='dropOff.time' onBlur={this.handleUpdateService} onChange={this.handleChange} value={(this.state.patchData.dropOff && this.state.patchData.dropOff.time) || ''} />

              <input type='text' name='dropOff.time' onBlur={this.handleUpdateService} onChange={this.handleChange} value={(this.state.patchData.available && this.state.patchData.dropoffTime) || ''} disabled={this.state.userRole === 'TA'} />
            </div>
            <div className='input-field col s9'>
              <input type='text' placeholder='Drop-off location' id='dropoff-location' name='dropOff.location' onBlur={this.handleUpdateService} onChange={this.handleChange} value={(this.state.patchData.dropOff && this.state.patchData.dropOff.location) || ''} disabled={this.state.userRole === 'TA'} />
            </div>
            <div className='input-field col s12'>
              <textarea placeholder='Drop-off notes' type='text' id='dropoff-notes' className='materialize-textarea' name='dropOff.remarks' onBlur={this.handleUpdateService} onChange={this.handleChange} value={(this.state.patchData.dropOff && this.state.patchData.dropOff.remarks) || ''} disabled={this.state.userRole === 'TA'} />
            </div> */}
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
                      <Select value={showDayValue} onChange={this.changeDay} disabled={this.state.userRole === 'TA'}>
                        <option disabled>{moment(this.state.dropOffTime, ['HHmm']).format('h:mm A') || '8:30'}</option>
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

                      {/* <Select value={showDayValue} onChange={this.changeDay} disabled={this.state.userRole === 'TA'}>
                        <option disabled>{this.props.viewer.serviceBooking.dropOff.location || 'Bangkok Hotel'}</option>
                      </Select> */}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* <div className='input-field col s3'>
                <input type='text' name='pickUp.time' onBlur={this.handleUpdateService} onChange={this.handleChange} value={(this.state.patchData.available && this.state.patchData.pickupTime) || ''} disabled={this.state.userRole === 'TA'} />
              </div> */}
            {/* <div className='input-field col s9'>
                <input type='text' placeholder='Pick-up location' id='pickup-location' name='pickUp.location' onBlur={this.handleUpdateService} onChange={this.handleChange} value={(this.state.patchData.pickUp && this.state.patchData.pickUp.location) || ''} disabled={this.state.userRole === 'TA'} />
              </div> */}
            <div className='row m-0 p-0'>
              <div className='col s12 p-0'>
                <span style={{ color: '#bfbfbf', fontWeight: '700', fontSize: '10px' }}>Note</span>
                <div className='row m-0'>
                  <div className='col s1 p-0'>
                    <i style={{ fontSize: '16px', color: '#bfbfbf', marginTop: '10px' }} className='mdi mdi-message' />
                  </div>
                  <div className='col s11 p-0 pr-18'>
                    <textarea
                      type='text'
                      style={{ resize: 'none', border: 'none', borderBottom: '1px solid #bfbfbf', height: '2rem' }}
                      value={this.state.dropoffNotes || ''}
                      name='dropOff.remarks'
                      id='dropoff-notes'
                      onBlur={this.handleUpdateService}
                      onChange={this.handleChange}
                    />
                  </div>
                </div>
              </div>
            </div>
            <input name='longDistanceOption' type='checkbox' id='checkbox1' checked={viewer.serviceBooking.longDistanceOption} onChange={this.handleUpdateService} disabled={this.state.userRole === 'TA'} />
            <label htmlFor='checkbox1' style={{ fontWeight: 'bold', fontSize: '13px', color: 'black' }} >Request long distance service ( > 10km )</label>
          </Card>
        </div>

        {/* Notes */}
        <div style={{ borderTop: '1px solid #e0e0e0', fontWeight: 'bold' }}>
          <Card title={noteTitle} titleBackColor='white' noBoxShadow minimized doFullCardTitleExpand>
            <div className='row m-0 p-0'>
              <div className='col s12 p-0'>
                <span style={{ color: '#bfbfbf', fontWeight: '700', fontSize: '10px' }}>Note</span>
                <div className='row m-0'>
                  <div className='col s1 p-0'>
                    <i style={{ fontSize: '16px', color: '#bfbfbf', marginTop: '10px' }} className='mdi mdi-message' />
                  </div>
                  <div className='col s11 p-0 pr-18'>
                    <textarea
                      type='text'
                      style={{ resize: 'none', border: 'none', borderBottom: '1px solid #bfbfbf', height: '2rem' }}
                      value={this.state.remarks || ''}
                      name='remarks'
                      id='remarks'
                      onBlur={this.handleUpdateService}
                      onChange={this.handleChange}
                    />
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Extra Options */}
        {
          extras ?
            <Card title={extraTitle} minimized doFullCardTitleExpand>
              <div className='row mt-0 extra'>
                {extras}
              </div>
            </Card>
          : null
        }

        {
          this.state.isCancellationModalOpen ?
            <Modal showCancelButton={false} isModalOpened={this.state.isCancellationModalOpen} changeModalState={this.changeRemoveCancellationModal}>
              <h2>Cancellation Policy</h2>
              <p>{this.props.viewer.serviceBooking.tour.cancellationPolicy}</p>
            </Modal>
          : null
        }

        {
          this.state.isChildModalOpen ?
            <Modal showCancelButton={false} isModalOpened={this.state.isChildModalOpen} changeModalState={this.changeChildPolicyModal} closeOnOutsideClick>
              <h2>Child Policy</h2>
              <p>{this.props.viewer.serviceBooking.tour.childPolicy} </p>
            </Modal>
          : null
        }
      </div>
    );
  }
}
