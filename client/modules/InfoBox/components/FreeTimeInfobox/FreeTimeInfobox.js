import React, { Component, PropTypes } from 'react';
import Relay from 'react-relay';
import Detail from '../Detail';
import ChangeServiceDayMutation from '../../mutations/ChangeServiceDay';
import FreeTimeConfigure from './FreeTimeConfigure';

export default class FreeTimeInfobox extends Component {
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

  render() {
    const { viewer, cityDayKey } = this.props;

    this.modifiedServiceBooking(viewer.serviceBooking);

    const configureRenderer = <FreeTimeConfigure viewer={viewer} />;

    return (
      <Detail
        viewer={viewer}
        disableCheck
        disableBook
        renderTimeslot={(<div> Day 1 (May 22) - Morning</div>)}
        renderConfigure={configureRenderer}
        renderInfo={null}
        cityDayKey={cityDayKey}
        type='tour'
      />
    );
  }
}
