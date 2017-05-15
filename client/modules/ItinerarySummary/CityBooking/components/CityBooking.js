import React, { Component } from 'react';
import _, { range } from 'lodash';
import CityDay from '../containers/CityDay';
import TransferPlacement from '../../TransferPlacement/containers/TransferPlacement';
import AccommodationPlacement from '../../AccommodationPlacement/containers/AccommodationPlacement';

export default class CityBooking extends Component {
  getDayAccommodationPlacements = (accommodationPlacements) => {
    const accumulator = {};
    accommodationPlacements.forEach((accommodationPlacement) => {
      const { startDay, durationNights } = accommodationPlacement;
      range(startDay, startDay + durationNights).forEach((day) => {
        if (!accumulator[day]) {
          accumulator[day] = [];
        }

        accumulator[day].push(accommodationPlacement);
      });
    });

    return accumulator;
  };


  render() {
    const {
      cityBooking,
      countryBooking: {
        countryCode
      },
      showLineAmounts,
      showDescriptions,
      showImages,
      showDayNotes,
      showSeparator = true

    } = this.props;

    const {
      cityCode,
      cityDays,
      accommodationPlacements,
      transferPlacement
    } = cityBooking;

    const dayAccommodationPlacements = this.getDayAccommodationPlacements(accommodationPlacements);

    return (<div>
      <div>
        <TransferPlacement
          transferPlacement={transferPlacement}
          showLineAmounts={showLineAmounts}
        />
      </div>
      {showSeparator && <div
        className='ml-50 mt-5'
        style={{
          marginRight: '-18px',
        }}
      >
        <hr />
      </div>}
      <h2>
        {cityCode}
      </h2>
      <div >
        {_.chain(cityDays)
          .flatMap((cityDay, i) => [
            <CityDay
              cityDay={cityDay}
              showLineAmounts={showLineAmounts}
              showDescriptions={showDescriptions}
              showImages={showImages}
              showDayNotes={showDayNotes}
            />,

            (dayAccommodationPlacements[cityDay.startDay] || [])
              .map(accommodationPlacement => (
                <AccommodationPlacement
                  showDescriptions={
                    showDescriptions &&
                    cityDay.startDay === accommodationPlacement.startDay
                  }
                  showImages={
                    showImages &&
                    cityDay.startDay === accommodationPlacement.startDay
                  }
                  accommodationPlacement={accommodationPlacement}
                  showLineAmounts={showLineAmounts}
                />
              ))
          ])
          .slice(0, -1)
          .value()}
      </div>
    </div>);
  }
}
