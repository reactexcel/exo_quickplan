import React, { Component, PropTypes } from 'react';
import Detail from '../Detail';
import OwnArrangementConfigure from './OwnArrangementConfigure';

export default class OwnArrangementInfobox extends Component {
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
      dayValue: nextProps.activeDetail && nextProps.activeDetail.startSlot ? nextProps.activeDetail.startSlot : '',
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

  render() {
    const { viewer } = this.props;

    this.modifiedServiceBooking(viewer.serviceBooking);
    const configureRenderer = <OwnArrangementConfigure viewer={viewer} />;

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
        serviceBookingKey={viewer.serviceBooking._key}
        type='accommodationPlaceholder'
      />
    );
  }
}
