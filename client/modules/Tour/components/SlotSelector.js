import React, { Component, PropTypes } from 'react';
import TourPlacement from './TourPlacement';
import TourSelection from './TourSelection';
import Placeholder from './Placeholder';
import ImplicitFreeTimePlaceholder from './ImplicitFreeTimePlaceholder';

export default class Slot extends Component {
  static propTypes = {
    service: PropTypes.object,
    type: PropTypes.string
  };

  render() {
    const { service, type, ...rest } = this.props;
    let serviceBookingKey;
    if (service.serviceBookingType === 'tour') {
      serviceBookingKey = service._key;
    }
    let component;
    if (service.placeholder) {
      if (service.isImplicitFreeTime) {
        component = <ImplicitFreeTimePlaceholder service={service} {...rest} />;
      } else {
        component = <Placeholder service={service} {...rest} />;
      }
    } else if (type === 'placement') {
      component = <TourPlacement service={service} serviceBookingKey={serviceBookingKey} {...rest} />;
    } else if (type === 'selection') {
      component = <TourSelection service={service} {...rest} />;
    }

    return (
      <div>{component}</div>
    );
  }
}
