import React, { Component, PropTypes } from 'react';
import Relay from 'react-relay';
import { FaCalendarCheckO, FaCalendarTimesO, FaDollar } from 'react-icons/lib/fa';
import cx from 'classnames';
import PubSub from 'pubsub-js';
import { Card, Modal } from '../../Utils/components';
import UpdateServiceMutation from '../../ServiceBooking/mutations/UpdateService';
import AddRoomConfigMutation from '../mutations/AddRoomConfig';
import RemoveRoomConfigMutation from '../mutations/RemoveRoomConfig';
import styles from '../style.module.scss';
import RoomConfig from './RoomConfig';
import BookServiceMutation from '../../ServiceBooking/mutations/BookServices';
import { getUserRole } from '../../../services/user';
import SERVICES from '../../../services';
import CancelBookingMutation from '../../ServiceBooking/mutations/CancelBookings';
import ConfirmAvailabilityMutation from '../../ServiceBooking/mutations/ConfirmAvailability';

export default class AccommodationConfigure extends Component {
  static propTypes = {
    viewer: PropTypes.object.isRequired,
    activeDetail: PropTypes.number.isRequired,
    serviceStatus: PropTypes.string,
    availability: PropTypes.object,
    supplier: PropTypes.object,
    accommodationPlacement: PropTypes.object,
    cityBookingKey: PropTypes.string,
    tripKey: PropTypes.string,
    relay: PropTypes.object,
    paxs: PropTypes.array
  };

  static defaultProps = {
    serviceStatus: '',
    availability: {}
  };

  state = {
    patchData: this.props.viewer.accommodationPlacement.serviceBookings[this.props.activeDetail],
    isCancellationModalOpen: false,
    isChildModalOpen: false,
    userRole: getUserRole(),
    isBooked: false,
    isEarlyCheckin: false,
    isLateCheckout: false,
    onRequest: false,
    statusCheck: ''
  };

  componentWillReceiveProps(nextProps) {
    let isBooked = false;
    let onRequest = false;
    if (nextProps.viewer.accommodationPlacement.serviceBookings[nextProps.activeDetail]) {
      const activeaAccom = nextProps.viewer.accommodationPlacement.serviceBookings[nextProps.activeDetail];
      if (activeaAccom.status && activeaAccom.status.state && activeaAccom.status.state === 'Booked') {
        isBooked = true;
      } else if (activeaAccom.status && activeaAccom.status.state && activeaAccom.status.state === 'On Request') {
        onRequest = true;
      }
    }
    if (nextProps.viewer.accommodationPlacement.serviceBookings && nextProps.viewer.accommodationPlacement.serviceBookings[nextProps.activeDetail]) {
      this.setState({
        isEarlyCheckin: nextProps.viewer.accommodationPlacement.serviceBookings[nextProps.activeDetail].isEarlyCheckin,
        isLateCheckout: nextProps.viewer.accommodationPlacement.serviceBookings[nextProps.activeDetail].isLateCheckout
      });
    }

    if (nextProps.viewer.accommodationPlacement.serviceBookings[nextProps.activeDetail].status && nextProps.viewer.accommodationPlacement.serviceBookings[nextProps.activeDetail].status.state !== null) {
      const statusCheck = nextProps.viewer.accommodationPlacement.serviceBookings[nextProps.activeDetail].status.state;
      this.setState({ statusCheck });
    }

    this.setState({
      patchData: nextProps.viewer.accommodationPlacement.serviceBookings[nextProps.activeDetail],
      isBooked,
      onRequest
    });
  }

  handleUpdateStatus = (val) => {
    const name = 'status';
    const value = val;

    Relay.Store.commitUpdate(new UpdateServiceMutation({
      serviceBookingId: this.props.viewer.accommodationPlacement.serviceBookings[this.props.activeDetail].id,
      serviceBookingKey: this.props.viewer.accommodationPlacement.serviceBookings[this.props.activeDetail]._key,
      patchData: {
        [name]: {
          tpBookingStatus: value,
          state: value,
          tpAvailabilityStatus: value
        }
      }
    }));
    // this.handleChange(e);
  };

  // when availability status is 'On Request',  the agent connect the hotel provider to ensure.
  // and if the hotel is available, the agent can click 'Confirm Availability' and make the hotel bookable.
  handleConfirmAvalability = () => {
    Relay.Store.commitUpdate(new ConfirmAvailabilityMutation({
      serviceBookingId: this.props.viewer.accommodationPlacement.serviceBookings[this.props.activeDetail].id,
      serviceBookingKey: this.props.viewer.accommodationPlacement.serviceBookings[this.props.activeDetail]._key,
    }), {
      onSuccess: (res) => {
        this.props.relay.forceFetch();
      }
    });
  }

  handleUpdateService = (e) => {
    const name = e.target.name;
    const value = (e.target.type === 'checkbox' ? e.target.checked : e.target.value);

    Relay.Store.commitUpdate(new UpdateServiceMutation({
      serviceBookingId: this.props.viewer.accommodationPlacement.serviceBookings[this.props.activeDetail].id,
      serviceBookingKey: this.props.viewer.accommodationPlacement.serviceBookings[this.props.activeDetail]._key,
      patchData: {
        [name]: value
      }
    }));
    // this.handleChange(e);
  };

  handleChange = (e) => {
    const name = e.target.name;
    const value = (e.target.type === 'checkbox' ? e.target.checked : e.target.value);

    this.setState({
      patchData: {
        ...this.state.patchData,
        [name]: value
      }
    });
  };

  availabilityInfo() {
    // let statusCheck = '';
    // if (this.props.viewer.accommodationPlacement.serviceBookings[this.props.activeDetail].status && this.props.viewer.accommodationPlacement.serviceBookings[this.props.activeDetail].status.tpAvailabilityStatus) {
    //   statusCheck = this.props.viewer.accommodationPlacement.serviceBookings[this.props.activeDetail].status.tpAvailabilityStatus;
    // }
    // if (this.props.viewer.accommodationPlacement.serviceBookings[this.props.activeDetail].status && this.props.viewer.accommodationPlacement.serviceBookings[this.props.activeDetail].status.state) {
    //   statusCheck = this.props.viewer.accommodationPlacement.serviceBookings[this.props.activeDetail].status.state;
    // }
    switch (this.state.statusCheck) {
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
        return (<div className='availabilityInfo'>--</div>);
    }
  }


  changeRemoveCancellationModal = (isOpen) => {
    this.setState({ isCancellationModalOpen: isOpen });
  };

  changeRemoveChildModal = (isOpen) => {
    this.setState({ isChildModalOpen: isOpen });
  };

  handleAddRoom = () => {
    Relay.Store.commitUpdate(new AddRoomConfigMutation({
      serviceBookingKey: this.props.viewer.accommodationPlacement.serviceBookings[this.props.activeDetail]._key,
      roomType: 'Double',
      paxKeys: []
    }), {
      onSuccess: () => {
        this.props.relay.forceFetch();
      }
    });
  };

  handleRemoveRoom = (roomConfigId) => {
    Relay.Store.commitUpdate(new RemoveRoomConfigMutation({
      serviceBookingKey: this.props.viewer.accommodationPlacement.serviceBookings[this.props.activeDetail]._key,
      roomConfigId
    }), {
      onSuccess: () => {
        this.props.relay.forceFetch();
      },
      onError: () => {
        this.props.relay.forceFetch();
      }
    });
  };

  renderRoomConfigs = () => {
    const tripKey = this.props.tripKey;
    const cityBookingKey = this.props.cityBookingKey;
    const totalRoom = this.state.patchData.roomConfigs.length;

    return this.props.viewer.accommodationPlacement.serviceBookings[this.props.activeDetail].roomConfigs.map((room, i) => <RoomConfig key={i} paxs={this.props.paxs} roomNo={i + 1} tripKey={tripKey} cityBookingKey={cityBookingKey} viewer={this.props.viewer} totalRoom={totalRoom} handleRemoveRoom={this.handleRemoveRoom} roomConfig={room} />);
  };

  bookRoomCategory = () => {
    // Relay.Store.commitUpdate(new BookServiceMutation({
    //   serviceBookings: [this.state.patchData]
    // }), {
    //   onSuccess: () => {
    //     PubSub.publish('TripForceFetch');
    //   }
    // });
    this.handleUpdateStatus('Booked');
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
    let showBookingButton = false;
    let showMarkAvailableButton = false;

    const roomConfigs_length = this.state.patchData.roomConfigs.length;
    if (roomConfigs_length === 0) {
      showBookingButton = false;
    }
    if (this.props.viewer.accommodationPlacement.serviceBookings[this.props.activeDetail].status) {
      const status_state = this.props.viewer.accommodationPlacement.serviceBookings[this.props.activeDetail].status.state;
      if (status_state === 'Booked') {
        showBookingButton = false;
      }

      // only show the Confirm availability button when is 'On Request' serviceBooking
      if (status_state === 'On Request') {
        showMarkAvailableButton = true;
      }

      if (this.props.viewer.accommodationPlacement.serviceBookings[this.props.activeDetail].status.tpAvailabilityStatus) {
        const tAStatus = this.props.viewer.accommodationPlacement.serviceBookings[this.props.activeDetail].status.tpAvailabilityStatus;
        if (tAStatus === 'RQ') {
          showBookingButton = false;
        }
      }
      if (status_state === 'Available') {
        showBookingButton = true;
      }
    }


    let accTitle = '';
    if (this.state.patchData && this.state.patchData.accommodation && this.state.patchData.accommodation.title) {
      accTitle = this.state.patchData.accommodation.title;
    }

    const { viewer, supplier } = this.props;
    const noteTitle = <h5 style={{ fontWeight: 'bold' }} >Notes</h5>;
    const roomTitle = <h5 style={{ fontWeight: 'bold' }} >Room - <span style={{ fontSize: '13px' }}>{accTitle}</span></h5>;
    const extraTitle = <h5 style={{ fontWeight: 'bold' }} >Extra Options</h5>;
    let extras;
    const spanHead = styles.configHead;


    if (viewer.accommodationPlacement.serviceBookings[this.props.activeDetail].accommodation.extras) {
      extras = viewer.accommodationPlacement.serviceBookings[this.props.activeDetail].accommodation.extras.map((extra, idx) =>
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
    // only show the 'booking reference' when the serviceBooking is in 'Booked' status
    if (this.props.tpBookingRef && this.state.statusCheck === 'Booked') {
      tpBookingRef = this.props.tpBookingRef;
    }

    const btnBookRoomCategory = this.state.userRole === 'TA' ? null : (<div style={{ paddingTop: '10px' }}>
      {
        !this.props.disableBook
          ? <a style={{ color: '#7fc7ae', fontSize: '11px' }} href='#!' onClick={this.bookRoomCategory}> <i className='mdi mdi-cash-usd fs-22' />  BOOK ROOM CATEGORY</a>
          : <a style={{ color: '#bfbfbf', fontSize: '11px', pointerEvents: 'none', cursor: 'default' }} href='#!' onClick={this.bookRoomCategory}> <i className='mdi mdi-cash-usd fs-22' />  BOOK ROOM CATEGORY</a>
        }
    </div>);

    const btnMakeRoomAvailable = this.state.userRole === 'TA' ? null : (  // eslint-disable-line no-nested-ternary
      showMarkAvailableButton
        ? <div className='availabilityInfo' style={{ color: '#7fc7ae' }} onClick={() => { this.handleConfirmAvalability(); }}><FaCalendarCheckO size={18} /> <div style={{ fontSize: '11px', cursor: 'pointer', color: '#7fc7ae' }}>CONFIRM AVAILABILITY</div></div>
        : null

    );

    const btnCancelRoomCategory = (<div style={{ paddingTop: '10px' }}>
      <a style={{ color: '#111111', fontSize: '11px' }} href='#!'><i className='mdi mdi-close-circle-outline fs-22' /> Cancel Booking</a>
    </div>);


    let availabilityStatus = null;
    if (this.state.patchData && this.state.patchData.status && this.state.patchData.status.tpAvailabilityStatus) {
      availabilityStatus = this.state.patchData.status.tpAvailabilityStatus;
    }
    let showPrice = '';
    // Only show accurate prices after availability check.
    if (availabilityStatus === null || availabilityStatus === '') {
      showPrice = '--';
    } else {
      if (this.state.patchData && this.state.patchData.price && this.state.patchData.price.amount) {
        showPrice = this.state.patchData.price.amount;
      }
      if (showPrice === '' || showPrice === null || showPrice === 0) {
        showPrice = '--';
      } else {
        showPrice = SERVICES.currency[this.props.infoBoxData.currency] + this._priceFormat(showPrice);
      }
    }

    let val_isEarlyCheckin = this.state.isEarlyCheckin;
    let val_isLateCheckout = this.state.isLateCheckout;
    if (val_isEarlyCheckin === null) {
      val_isEarlyCheckin = false;
    }
    if (val_isLateCheckout === null) {
      val_isLateCheckout = false;
    }

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
            <div className='col s12 p-0'>
              <div style={{ fontWeight: 'bold' }}>All inclusive</div>
              <div style={{ marginTop: '20px', fontWeight: 'bold' }}>
                <div>
                  <input name='isEarlyCheckin' type='checkbox' id='requestEarlyCheckIn' checked={val_isEarlyCheckin} onChange={this.handleUpdateService} />
                  <label htmlFor='requestEarlyCheckIn' style={{ color: '#423e3e', fontSize: '13px' }}>Request early check in</label>
                </div>
                <div>
                  <input name='isLateCheckout' type='checkbox' id='requestLateCheckout' checked={val_isLateCheckout} onChange={this.handleUpdateService} />
                  <label htmlFor='requestLateCheckout' style={{ color: '#423e3e', fontSize: '13px' }}>Request late check out</label>
                </div>
              </div>
            </div>
          </div>

          <div className={cx(spanHead, 'row m-0 pt-10 fw-700', { 'fs-13': !SERVICES.isSideNavOpen }, { 'fs-10': SERVICES.isSideNavOpen })}>
            <div className='col s6 p-0'>
              <span>*This Booking can be cancelled up to 1 day before checkin.</span>
            </div>
            <div className='col s6 align-right'>
              {
              supplier.cancellationPolicy ?
                <div className='exo-colors-text text-data-1 cursor fs-13' onClick={this.changeRemoveCancellationModal.bind(null, true)}>
                  <span>Cancellation Policy <i className='mdi mdi-alert-circle-outline' /></span>
                </div>
              : null
            }
            </div>
          </div>
          {/* <div className='row' style={{ marginTop: '0px' }}>
            <div className='col s6'>
              {this.availabilityInfo()}
            </div> */}
          {/* <div className='col s4'>
              <div style={{ fontSize: '11px', color: '#98c1ab' }}>Booking reference #</div>
              <div style={{ fontSize: '11px', color: '#6abda0', fontWeight: 'bold' }}>{tpBookingRef}</div>
            </div> */}
          {/* <div className={cx('col s6', styles.textRight)}>
              ${ (this.state.patchData && this.state.patchData.price && this.state.patchData.price.amount) }
            </div>
          </div>


          <div className='row'>
            <div className='col s12'>
              <div className='exo-colors-text text-label-1'>All inclusive</div>
            </div>
          </div>

          <div className='row'>
            <div className='col s12'>
              <input name='isEarlyCheckin' type='checkbox' id='requestEarlyCheckIn' checked={viewer.accommodationPlacement.serviceBookings[this.props.activeDetail].isEarlyCheckin} onChange={this.handleUpdateService} />
              <label htmlFor='requestEarlyCheckIn'>Request early check in</label>
            </div>
          </div>

          <div className='row'>
            <div className='col s12'>
              <input name='isLateCheckout' type='checkbox' id='requestLateCheckout' checked={viewer.accommodationPlacement.serviceBookings[this.props.activeDetail].isLateCheckout} onChange={this.handleUpdateService} />
              <label htmlFor='requestLateCheckout'>Request late check out</label>
            </div>
          </div>

          <div className='row'>
            <div className='col s6'>
              This booking can be cancelled up to 1 day before checkin.
            </div>
            <div className={cx('col s6', styles.textRight)}>
              {
              supplier.cancellationPolicy ?
                <div className='exo-colors-text text-data-1 cursor' onClick={this.changeRemoveCancellationModal.bind(null, true)}>
                  Cancellation Policy <i className='mdi mdi-alert-circle-outline' />
                </div>
              : null
            }
            </div>
          </div>*/}
          <div className='row m-0 fw-700'>
            <div className='col s6 p-0'>
              {btnMakeRoomAvailable}
            </div>
            <div className='col s6 p-0'>
              {
                this.state.isBooked
                ? btnCancelRoomCategory
                : btnBookRoomCategory
              }
            </div>
          </div>


        </div>
        <div style={{ borderTop: '2px solid #e0e0e0', fontWeight: 'bold' }}>
          <Card title={roomTitle} titleBackColor='white' noBoxShadow doFullCardTitleExpand>
            <div style={{ paddingRight: '10px', paddingTop: '20px', pointerEvents: `${this.state.isBooked ? 'none' : ''}` }}>
              {this.renderRoomConfigs()}
              <div className='row m-0'>
                <div className='col s6 p-0 fw-700'>
                  <a className='fs-11 fw-700 cursor' onClick={this.handleAddRoom}><i className='mdi mdi-plus mr-3 pb-2' style={{ fontSize: '15px' }} />ADD ROOM</a>
                </div>
                <div className='col s6 p-0 align-right'>
                  {
                    supplier.childPolicy ?
                      <div className={cx('col s12 p-0 cursor fs-10', styles.textRight)} onClick={this.changeRemoveChildModal.bind(null, true)}>
                        <div>Child Policy <i className='mdi mdi-alert-circle-outline' /></div>
                      </div>
                    : null
                  }
                </div>
              </div>

            </div>
          </Card>
        </div>

        <div style={{ borderTop: '1px solid #e0e0e0', fontWeight: 'bold' }}>
          <Card title={noteTitle} titleBackColor='white' noBoxShadow minimized doFullCardTitleExpand>
            <div className='row m-0 p-0' style={{ pointerEvents: `${this.state.isBooked ? 'none' : ''}` }}>
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
            <Modal showCancelButton isModalOpened={this.state.isCancellationModalOpen} changeModalState={this.changeRemoveCancellationModal}>
              <h2>Cancellation Policy</h2>
              <p>{supplier.cancellationPolicy}</p>
            </Modal>
          : null
        }

        {
          this.state.isChildModalOpen ?
            <Modal showCancelButton isModalOpened={this.state.isChildModalOpen} changeModalState={this.changeRemoveChildModal}>
              <h2>Child Policy</h2>
              <p>{supplier.childPolicy}</p>
            </Modal>
          : null
        }
      </div>
    );
  }
}
