import React, { Component, PropTypes } from 'react';
import Relay from 'react-relay';
import Detail from '../Detail';
import BookServiceMutation from '../../../ServiceBooking/mutations/BookService';
import CancelBookingMutation from '../../../ServiceBooking/mutations/CancelBooking';
import ChangeServiceDayMutation from '../../mutations/ChangeServiceDay';
import ConsiderThisConfigure from './ConsiderThisConfigure';

export default class ConsiderThisInfobox extends Component {
  static propTypes = {
    viewer: PropTypes.object.isRequired,
    cityDayKey: PropTypes.string
  };

  state = {
    dayValue: this.props.viewer.serviceBooking.startSlot,
    serviceStatus: this.props.viewer.serviceBooking.status ? this.props.viewer.serviceBooking.status.state : 'OK'
  };

  componentWillReceiveProps(nextProps) {
    const setting = {
      dayValue: nextProps.viewer.serviceBooking.startSlot,
      serviceStatus: 'OK',
      availability: {}
    };

    if (this.props.viewer.serviceBooking !== nextProps.viewer.serviceBooking) {
      setting.availability = {};
    } else {
      setting.availability = nextProps.viewer.tourAvailability;
      if (nextProps.viewer.tourAvailability && nextProps.viewer.tourAvailability.availability) setting.serviceStatus = nextProps.viewer.tourAvailability.availability;
    }

    if (nextProps.viewer.serviceBooking.status && nextProps.viewer.serviceBooking.status.state !== '') {
      setting.serviceStatus = nextProps.viewer.serviceBooking.status.state;
    }
    this.setState(setting);
  }

  modifiedServiceBooking = (ServiceBooking) => {
    ServiceBooking.title = ServiceBooking.placeholder.title; // eslint-disable-line no-param-reassign
  };

  handleCheckTourAvailability = () => {
    const service = this.props.viewer.serviceBooking;
    this.props.relay.setVariables({
      country: 'thailand',
      productId: service.tour.productId.toString(),
      date: '2016-09-25',
      nrOfAdults: 2,
      nrOfChildren: 0,
      nrOfInfants: 0,
      hasQuery: true
    });
  };

  changeDay = (e) => {
    const daySlot = e.target.value;
    Relay.Store.commitUpdate(new ChangeServiceDayMutation({
      serviceBookingKey: this.props.viewer.serviceBooking._key,
      cityDayKey: this.props.viewer.serviceBooking.cityDayKey,
      cityBookingID: this.props.viewer.serviceBooking.cityBookingId,
      startSlot: daySlot,
      cityBooking: null
    }));
  };

  cancelBooking = () => {
    Relay.Store.commitUpdate(new CancelBookingMutation({
      serviceBookings: this.props.viewer.serviceBooking
    }));
  };

  bookService = () => {
    Relay.Store.commitUpdate(new BookServiceMutation({
      serviceBookings: this.props.viewer.serviceBooking
    }));
  };

  render() {
    const { viewer, cityDayKey } = this.props;

    this.modifiedServiceBooking(viewer.serviceBooking);
    const configureRenderer = <ConsiderThisConfigure viewer={viewer} />;

    return (
      <Detail
        viewer={viewer}
        disableCheck
        disableBook
        handleCheckButton={this.handleCheckTourAvailability}
        handleBookService={this.bookService}
        handleCancelBooking={this.cancelBooking}
        renderTimeslot={(<div> Day 1 (May 22) - Morning</div>)}
        renderConfigure={configureRenderer}
        renderInfo={null}
        cityDayKey={cityDayKey}
        type='tour'
      />
    );
  }
}
