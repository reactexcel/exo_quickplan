import React, { Component, PropTypes } from 'react';
import Relay from 'react-relay';
import Detail from '../Detail';
import UpdateServiceMutation from '../../../ServiceBooking/mutations/UpdateService';
import ChangeServiceDayMutation from '../../mutations/ChangeServiceDay';
import CustomTourConfigure from './CustomTourConfigure';
import CustomTourInfo from './CustomTourInfo';

export default class CustomTourInfobox extends Component {
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
    }

    if (nextProps.viewer.tourAvailability && nextProps.viewer.tourAvailability.availability) setting.serviceStatus = nextProps.viewer.tourAvailability.availability;

    if (nextProps.viewer.serviceBooking.status && nextProps.viewer.serviceBooking.status.state !== '') {
      setting.serviceStatus = nextProps.viewer.serviceBooking.status.state;
    }
    this.setState(setting);
  }

  modifiedServiceBooking = (ServiceBooking) => {
    ServiceBooking.title = ServiceBooking.placeholder.title; // eslint-disable-line no-param-reassign
  };

  handleCheckTourAvailability = () => {
    const service = this.props.activeDetail;
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
    Relay.Store.commitUpdate(new UpdateServiceMutation({
      serviceBookingId: this.props.viewer.serviceBooking.id,
      serviceBookingKey: this.props.viewer.serviceBooking._key,
      patchData: {
        status: {
          state: '',
          tpBookingStatus: 'XX'
        }
      }
    }));
  };

  bookService = () => {
    Relay.Store.commitUpdate(new UpdateServiceMutation({
      serviceBookingId: this.props.viewer.serviceBooking.id,
      serviceBookingKey: this.props.viewer.serviceBooking._key,
      patchData: {
        status: {
          state: 'Booked',
          tpBookingStatus: 'OK'
        }
      }
    }));
  };

  render() {
    const { viewer, cityDayKey } = this.props;

    this.modifiedServiceBooking(viewer.serviceBooking);

    const configureRenderer = <CustomTourConfigure serviceStatus={this.state.serviceStatus} viewer={viewer} />;
    const infoRenderer = <CustomTourInfo viewer={viewer} />;

    return (
      <Detail
        viewer={viewer}
        disableCheck
        handleCheckButton={this.handleCheckTourAvailability}
        handleBookService={this.bookService}
        handleCancelBooking={this.cancelBooking}
        serviceStatus={this.state.serviceStatus}
        renderTimeslot={(<div> Day 1 (May 22) - Morning</div>)}
        renderConfigure={configureRenderer}
        renderInfo={infoRenderer}
        cityDayKey={cityDayKey}
        type='tour'
      />
    );
  }
}
