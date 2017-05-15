import React, { Component, PropTypes } from 'react';
import cx from 'classnames';
import { FaCalendarCheckO, FaCalendarTimesO, FaDollar } from 'react-icons/lib/fa';
import classNames from 'classnames/bind';
import PubSub from 'pubsub-js';
import { Tabs, Tab, Modal } from '../../Utils/components';
import styles from '../style.module.scss';
import { getUserRole } from '../../../services/user';
import SERVICES from '../../../services';

export default class Detail extends Component {
  static propTypes = {
    viewer: PropTypes.object.isRequired,
    relay: PropTypes.object,
    serviceStatus: PropTypes.string,
    serviceState: PropTypes.string,
    handleCheckButton: PropTypes.func,
    handleBookService: PropTypes.func,
    handleCancelBooking: PropTypes.func,
    renderTimeslot: PropTypes.object,
    renderConfigure: PropTypes.object,
    renderInfo: PropTypes.object,
    renderBeforeTabs: PropTypes.object,
    renderExtraTabs: PropTypes.object,
    disableCheck: PropTypes.bool,
    disableBook: PropTypes.bool,
    type: PropTypes.string,
    cityDayKey: PropTypes.string,
    placementKey: PropTypes.string,
    serviceBookingKey: PropTypes.string,
    tpAvailabilityStatus: PropTypes.string,
    tpBookingStatus: PropTypes.string
  };

  state = {
    hasPaxErrors: 0,
    availability: {},
    isTourBookModalOpened: false,
    isCancelTourBookModalOpened: false,
    isTransferBookModalOpened: false,
    isCancelTransferBookModalOpened: false,
    isAccommodationBookModalOpened: false,
    isCancelAccommodationBookModalOpened: false,
    serviceStatus: this.props.serviceStatus, // this.props.viewer.serviceBooking.status ? this.props.viewer.serviceBooking.status.state : '',
    key: Math.random(),
    dayValue: this.props.viewer.serviceBooking.startSlot,
    userRole: getUserRole(),
    isBooked: false
  };

  componentDidMount() {
    const $sidebar = $('#detail');
    const $window = $(window);
    const offset = $sidebar.offset();
    const topPadding = 100;

    const checkScroll = () => {
      if ($window.scrollTop() > offset.top) {
        $sidebar.css({
          marginTop: ($window.scrollTop() - offset.top) + topPadding,
          height: `${$(window).height() * 0.9}px`
        });
      } else {
        $sidebar.css({
          marginTop: 0,
          height: `${$(window).height() * 0.82}px`
        });
      }
    };

    $window.scroll(checkScroll);
    checkScroll();
  }

  componentWillReceiveProps(nextProps) {
    const setting = {
      availability: {},
      key: Math.random(),
      dayValue: nextProps.viewer.serviceBooking.startSlot,
      hasPaxErrors: nextProps.hasPaxErrors ? nextProps.hasPaxErrors : 0,
      isBooked: false
    };
    if (nextProps.serviceState && nextProps.serviceState === 'Booked') {
      setting.isBooked = true;
    }
    this.setState(setting);
  }

  handleOpenModal = () => {
    const { viewer, cityDayKey, placementKey, serviceBookingKey } = this.props;
    if (this.props.type === 'tour') {
      PubSub.publish(`Day_${cityDayKey}`, { isOpen: true, type: 'change', service: viewer.serviceBooking });
    } else if (this.props.type === 'accommodation') {
      PubSub.publish(`AccommodationPlacement_${placementKey}`, { type: 'change', isOpen: true });
    } else if (this.props.type === 'transfer' || this.props.type === 'localtransfer') {
      if (this.props.type === 'transfer') {
        PubSub.publish(`ChangeTransfer_${placementKey}`, { type: 'change', isOpen: true });
      } else if (this.props.type === 'localtransfer') {
        PubSub.publish(`ChangeLocalTransfer_${this.props.transferPlacementId}`, { type: 'change', isOpen: true });
      }
    } else {
      PubSub.publish(`AccommodationPlaceholder_${serviceBookingKey}`, { type: 'change', isOpen: true });
    }
  };

  handleRemove = () => {
    const { viewer, cityDayKey, placementKey, serviceBookingKey } = this.props;
    if (this.props.type === 'tour') {
      PubSub.publish(`Day_${cityDayKey}`, { isOpen: true, type: 'remove', service: viewer.serviceBooking });
    } else if (this.props.type === 'accommodation') {
      PubSub.publish(`AccommodationPlacement_${placementKey}`, { type: 'remove', isOpen: true });
    } else if (this.props.type === 'transfer' || this.props.type === 'localtransfer') {
      if (this.props.handleRemoveService) {
        this.props.handleRemoveService();
      }
    } else {
      PubSub.publish(`AccommodationPlaceholder_${serviceBookingKey}`, { type: 'remove', isOpen: true });
    }
  };

  changeBookModalState = (isOpen) => {
    if (this.props.type === 'tour') {
      this.setState({ isTourBookModalOpened: isOpen });
    } else if (this.props.type === 'transfer' || this.props.type === 'localtransfer') {
      this.setState({ isTransferBookModalOpened: isOpen });
    } else if (this.props.type === 'accommodation') {
      this.setState({ isAccommodationBookModalOpened: isOpen });
    }
  };

  changeCancelBookModalState = (isOpen) => {
    if (this.props.type === 'tour') {
      this.setState({ isCancelTourBookModalOpened: isOpen });
    } else if (this.props.type === 'transfer' || this.props.type === 'localtransfer') {
      this.setState({ isCancelTransferBookModalOpened: isOpen });
    } else if (this.props.type === 'accommodation') {
      this.setState({ isCancelAccommodationBookModalOpened: isOpen });
    }
  };

  availabilityIcon = () => {
    switch (this.props.tpAvailabilityStatus) {
      case 'OK':
        return <FaCalendarCheckO size={18} className='exo-colors-text text-darken-2' />;
      case 'NO':
        return <FaCalendarTimesO size={18} className='exo-colors-text text-error-front' />;
      case 'Booked':
        return <FaDollar size={18} className='bookedColor' />;
      default:
        return '';
    }
  };

  paxStatusIcon = () => {
    if (this.state.hasPaxErrors && this.state.hasPaxErrors > 0) {
      return <i className='mdi mdi-account-alert' style={{ color: 'orange', fontSize: '20px', paddingLeft: '12px' }} />;
    } else { // eslint-disable-line no-else-return
      return '';
    }
  }

  render() {
    const { viewer, handleCheckButton, handleBookService, handleCancelBooking, renderTimeslot, renderConfigure, renderInfo, renderBeforeTabs, renderExtraTabs, disableCheck, disableBook } = this.props;

    const bookTourButton = <a className='modal-action modal-close waves-effect waves-green btn' onClick={handleBookService}><i className='mdi-editor-attach-money left' />Book Tour</a>;
    const bookTransferButton = <a className='modal-action modal-close waves-effect waves-green btn' onClick={handleBookService}><i className='mdi-editor-attach-money left' />Book Transfer</a>;
    const bookAccommodationButton = <a className='modal-action modal-close waves-effect waves-green btn' onClick={handleBookService}><i className='mdi-editor-attach-money left' />Book Hotel</a>;
    const cancelBookButton = <a className='modal-action modal-close waves-effect btn red' onClick={handleCancelBooking}><i className='mdi-editor-attach-money left' />Cancel Booking</a>;

    const cx = classNames.bind(styles);

    const tabs = () => {
      if (renderExtraTabs) {
        return (
          <Tabs>
            <Tab title='CONFIGURE'>{renderConfigure}</Tab>
            <Tab title='INFO'>{renderInfo}</Tab>
            {renderExtraTabs}
          </Tabs>
        );
      } else if (renderInfo) {
        return (<Tabs>
          <Tab title='CONFIGURE'>{renderConfigure}</Tab>
          <Tab title='INFO'>{renderInfo}</Tab>
        </Tabs>);
      }
      return (
        <Tabs>
          <Tab title='CONFIGURE'>{renderConfigure}</Tab>
        </Tabs>);
    };

    const windowHeight = $(window).height() * 0.82;
    let transferTitleFont = '20px';
    if (SERVICES.isSideNavOpen) {
      transferTitleFont = '15px';
    }
    let title = '';

    if (this.props.type && viewer.serviceBooking && viewer.serviceBooking.route && (this.props.type === 'transfer' || this.props.type === 'localtransfer')) {
      const t_from = viewer.serviceBooking.route.from.place || viewer.serviceBooking.route.from.localityName || viewer.serviceBooking.route.from.cityName;
      const t_to = viewer.serviceBooking.route.to.place || viewer.serviceBooking.route.to.localityName || viewer.serviceBooking.route.to.cityName;
      title = (<div className='row m-0 mt-20 mb-20 fw-700'>
        <div className='col s5 p-0' style={{ fontSize: '10px', lineHeight: '16px', color: '#564f4f' }}>
          <span style={{ fontSize: transferTitleFont, color: '#383838' }}>{t_from}
          </span> <br />{viewer.serviceBooking.route.from.cityName}
        </div>
        <div className='col s1 p-0 pl-5'>
          <i className='mdi mdi-ray-start-end small green-text mr-10 pl-10 pr-10' />
        </div>
        <div className='col s4 p-0' style={{ lineHeight: '16px' }}>
          <span className='left ' style={{ fontSize: '10px', marginLeft: '14%', color: '#564f4f' }}>
            <span style={{ fontSize: transferTitleFont, color: '#383838' }}>{t_to}
            </span>
            <br />
            {viewer.serviceBooking.route.to.cityName}</span>
        </div>
      </div>);
    }

    if (title === '' && this.props.viewerComplete && this.props.viewerComplete.serviceBookings && this.props.viewerComplete.serviceBookings.length > 0 && (this.props.type === 'transfer' || this.props.type === 'localtransfer')) {
      let tt_from = '';
      let tt_to = '';
      this.props.viewerComplete.serviceBookings.map((serviceBooking, i) => { // eslint-disable-line array-callback-return
        if (i === 0 && serviceBooking.route && serviceBooking.route.from) {
          tt_from = serviceBooking.route.from;
        }
        if (i === 0 && serviceBooking.route && serviceBooking.route.to) {
          tt_to = serviceBooking.route.to;
        }
      });
      if (tt_from !== '' && tt_to !== '') {
        title = (<div className='row m-0 mt-20 mb-20 fw-700'>
          <div className='col s5 p-0' style={{ fontSize: '10px', lineHeight: '16px', color: '#564f4f' }}>
            <span style={{ fontSize: transferTitleFont, color: '#383838' }}>{tt_from}</span>
          </div>
          <div className='col s1 p-0 pl-5'>
            <i className='mdi mdi-ray-start-end small green-text mr-10 pl-10 pr-10' />
          </div>
          <div className='col s4 p-0' style={{ lineHeight: '16px' }}>
            <span className='left ' style={{ fontSize: '10px', marginLeft: '14%', color: '#564f4f' }}>
              <span style={{ fontSize: transferTitleFont, color: '#383838' }}>{tt_to}</span>
            </span>
          </div>
        </div>);
      }
    }

  //   <div><span key='1' className='left m-0 light' style={{ fontSize: '10px' }}><span style={{ fontSize: '15px', fontWeight: 'bold' }}>{`${t_from}`} </span> <br />{viewer.serviceBooking.route.from.cityName} </span>
  // <i style={{ position: 'relative', fontSize: '22px', right: "19%" }} key='7' className='mdi-navigation-arrow-forward'></i>
  //   <span key='6' className='left light' style={{ fontSize: '10px', marginLeft: '14%' }}><span style={{ fontSize: '15px', fontWeight: 'bold' }}>{`${t_to}`} </span><br /> {viewer.serviceBooking.route.to.cityName}</span></div>

    if (title === '') {
      title = viewer.serviceBooking.title || viewer.serviceBooking.countryName || viewer.serviceBooking.cityName || (viewer.serviceBooking.route && `${viewer.serviceBooking.route.from.cityName} -> ${viewer.serviceBooking.route.to.cityName}`) || '';
      title = $('<textarea/>').html(title).text();
    }

    const buttonColClassName = this.state.userRole === 'TA' ? 'col s4 p-0 cursor' : 'col s3 p-0 cursor';
    const none = 'none';
    const isBooked = this.props.serviceState === 'Booked';
    return (
      <div className='detail' id='detail' style={{ height: `${windowHeight}px`, marginTop: '20px', overflowY: 'auto', overflowX: 'hidden' }}>
        <div style={{ padding: '10px 24px', backgroundColor: 'white' }}>
          {this.props.type === 'transfer' ? <div>{title}</div> :
          <div style={{ fontSize: '16px', fontWeight: 'bold', margin: '20px 0px' }}>{title}<i className='mdi mdi-account-alert' style={{ color: 'orange', fontSize: '20px', paddingLeft: '12px', display: none }} />
            <i style={{ paddingLeft: '6px', display: none }}>
              {this.availabilityIcon()}
            </i>
            {this.paxStatusIcon()}
            {(this.props.type === 'accommodation' && this.props.alertPax) ? <i className='mdi mdi-account-alert' style={{ color: '#d51224', fontSize: '20px', paddingLeft: '12px' }} /> : null}
          </div>
          }

          <div className={cx('row m-0 pt-10 fw-700 fs-10')}>
            <a className={cx(buttonColClassName, 'pt-3', { disabled: disableCheck || isBooked })} onClick={handleCheckButton}><i className='mdi mdi-check' />CHECK</a>
            {
              isBooked ? <a className={buttonColClassName} onClick={this.changeCancelBookModalState.bind(this, true)}><i className='mdi-editor-attach-money' />CANCEL</a>
              : <a className={cx(buttonColClassName, 'pt-3', { disabled: disableBook })} onClick={this.changeBookModalState.bind(this, true)}><i className='mdi mdi-cash-usd pr-4' />BOOK</a>
            }
            <a className={cx(buttonColClassName, 'pt-3', { disabled: isBooked })} onClick={this.handleOpenModal}><i className='mdi-editor-mode-edit' />CHANGE</a>
            { this.state.userRole === 'TA' ? null : <a className={cx(buttonColClassName, 'pt-3', { disabled: isBooked })} onClick={this.handleRemove} style={{ pointerEvents: `${this.state.isBooked ? 'none' : ''}` }}><i className='mdi-action-delete' />REMOVE</a> }
          </div>
          {renderTimeslot}
        </div>
        {renderBeforeTabs}
        {tabs()}
        { /* TOUR */ }
        {
          this.state.isTourBookModalOpened ?
            <Modal actionButton={bookTourButton} isModalOpened={this.state.isTourBookModalOpened} changeModalState={this.changeBookModalState}>
              <h3>Book tour</h3>
              <span>This will book tour: <strong>{viewer.serviceBooking.tour ? viewer.serviceBooking.tour.title : viewer.serviceBooking.placeholder.title}.</strong> After booking, cancellation and change fees may apply. Do you want to book this tour?</span>
            </Modal>
            : null
        }
        {
          this.state.isCancelTourBookModalOpened ?
            <Modal actionButton={cancelBookButton} isModalOpened={this.state.isCancelTourBookModalOpened} changeModalState={this.changeCancelBookModalState}>
              <h3>Cancel tour</h3>
              <span>This will cancel confirmed tour booking for <strong>{viewer.serviceBooking.tour ? viewer.serviceBooking.tour.title : viewer.serviceBooking.placeholder.title}.</strong> Cancellation and change fees may apply. Do you want to cancel this booking?</span>
            </Modal>
            : null
        }
        { /* TRANSFER */ }
        {
          this.state.isTransferBookModalOpened ?
            <Modal actionButton={bookTransferButton} isModalOpened={this.state.isTransferBookModalOpened} changeModalState={this.changeBookModalState}>
              <h3>Book transfer</h3>
              <span>This will book selected segment(s) for</span>
              <h5>{viewer.serviceBooking.route.from.cityName}<i className='mdi-navigation-arrow-forward f-20' />{viewer.serviceBooking.route.to.cityName}</h5>
              <span>After booking, cancellation and change fees may apply. Do you want to book this transfer?</span>
            </Modal>
            : null
        }
        {
          this.state.isCancelTransferBookModalOpened ?
            <Modal actionButton={cancelBookButton} isModalOpened={this.state.isCancelTransferBookModalOpened} changeModalState={this.changeCancelBookModalState}>
              <h3>Cancel transfer</h3>
              <span>This will cancel confirmed transfer segment(s) for</span>
              <h5>{viewer.serviceBooking.route.from.cityName}<i className='mdi-navigation-arrow-forward f-20' />{viewer.serviceBooking.route.to.cityName}</h5>
              <span>Cancellation and change fees may apply. Do you wnat to cancel the booking?</span>
            </Modal>
            : null
        }
        { /* ACCOMMODATION */ }
        {
          this.state.isAccommodationBookModalOpened ?
            <Modal actionButton={bookAccommodationButton} isModalOpened={this.state.isAccommodationBookModalOpened} changeModalState={this.changeBookModalState}>
              <h3>Book hotel</h3>
              <span>This will book selected room(s) for </span>
              <h5>{viewer.serviceBooking.title}</h5>
              <span>After booking, cancellation and change fees may apply. Do you want to book this hotel?</span>
            </Modal>
            : null
        }
        {
          this.state.isCancelAccommodationBookModalOpened ?
            <Modal actionButton={cancelBookButton} isModalOpened={this.state.isCancelAccommodationBookModalOpened} changeModalState={this.changeCancelBookModalState}>
              <h3>Cancel hotel</h3>
              <span>This will cancel confirmed accommodation segment(s) for</span>
              <h5>{viewer.serviceBooking.title}</h5>
              <span>Cancellation and change fees may apply. Do you wnat to cancel the booking?</span>
            </Modal>
            : null
        }
      </div>
    );
  }
}
