import React, { PropTypes, Component } from 'react';
import CityBooking from '../../CityBooking/containers/CityBooking';

export default class Body extends Component {
  render() {
    const {
      data: countryBooking,
      showLineAmounts,
      showDescriptions,
      showImages,
      showDayNotes
    } = this.props;
    const { cityBookings } = countryBooking;

    return (<div>
      {cityBookings.map((cityBooking, i) => (
        <CityBooking
          showDescriptions={showDescriptions}
          showImages={showImages}
          showLineAmounts={showLineAmounts}
          countryBooking={countryBooking}
          cityBooking={cityBooking}
          showDayNotes={showDayNotes}
          key={i}
          showSeparator={i !== 0}
        />
        ))}
    </div>);
  }
}
