import React, { Component, PropTypes } from 'react';
import CustomTourInfobox from './CustomTourInfobox/CustomTourInfobox';
import FreeTimeInfobox from './FreeTimeInfobox/FreeTimeInfobox';
import ConsiderThisInfobox from './ConsiderThisInfobox/ConsiderThisInfobox';
import OwnArrangementInfobox from './OwnArrangementInfobox/OwnArrangementInfobox';

export default class PlaceholderInfobox extends Component {
  static propTypes = {
    viewer: PropTypes.object
  };

  render() {
    const { viewer, ...rest } = this.props;

    let component;
    if (viewer.serviceBooking.placeholder.type === 'customTour') {
      component = <CustomTourInfobox viewer={viewer} {...rest} />;
    } else if (viewer.serviceBooking.placeholder.type === 'freeTime') {
      component = <FreeTimeInfobox viewer={viewer} {...rest} />;
    } else if (viewer.serviceBooking.placeholder.type === 'considerThis') {
      component = <ConsiderThisInfobox viewer={viewer} {...rest} />;
    } else {
      component = <OwnArrangementInfobox viewer={viewer} {...rest} />;
    }

    return (
      <div>{component}</div>
    );
  }
}
