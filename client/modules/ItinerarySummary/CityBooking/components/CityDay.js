import React, { Component } from 'react';
import moment from 'moment';
import { merge } from 'lodash';
import Tour from '../../Tour/containers/Tour';
import Placeholder from '../../Tour/containers/Placeholder';
import Transfer from '../../TransferPlacement/containers/Transfer';
import Note from '../containers/Note';
import Meal from '../../Meal/containers/Meal';
import allTimeSlots from '../../../City/timeSlots.json';

export default class CityDay extends Component {
  getFullTimeSlots = () => {
    const { timeSlots } = this.props.cityDay;

    return allTimeSlots.map(({ order: slotOrder }) => ({
      slotOrder,
      ...(timeSlots.find(
        timeSlot => timeSlot.slotOrder === slotOrder
      ) || {})
    }));
  };


  render() {
    const {
      cityDay,
      showLineAmounts,
      showDescriptions,
      showImages,
      showDayNotes
    } = this.props;

    const {
      startDay,
      startDate,
      serviceBookings
    } = cityDay;


    return (<div>
      <div className='row'>
        <div
          className='col m12 fs-14 relative'
        >
          <span className='bold'> Day {startDay}</span>
          <span className='absolute l-50'>{moment(startDate).format('DD MMMM YYYY')}</span>
        </div>
      </div>
      <div className='row'>

        {showDayNotes ? <Note cityDay={cityDay} /> : ''}
        <div
          className='row valign-wrapper line'
        >
          <div className='col m12'>
            <i
              className='mdi mdi-silverware little service-icon'
            />
            <span>
              {this.getFullTimeSlots()
              .map(timeSlot => <Meal timeSlot={timeSlot} />)}
            </span>
          </div>
        </div>
        {
        [
          ...serviceBookings
              .filter(({ transfer }) => transfer)
              .map(serviceBooking => <Transfer
                showLineAmounts={showLineAmounts}
                serviceBooking={serviceBooking}
                transfer={serviceBooking.transfer}
                priceClassName='right fs-14 bold'
              />),
          ...serviceBookings
              .filter(({ tour }) => tour)
              .map(serviceBooking => <Tour
                showLineAmounts={showLineAmounts}
                tour={serviceBooking.tour}
                serviceBooking={serviceBooking}
                showDescriptions={showDescriptions}
                showImages={showImages}
              />),
          ...serviceBookings
              .filter(({ placeholder }) => placeholder)
              .map(serviceBooking => <Placeholder
                showLineAmounts={showLineAmounts}
                tour={serviceBooking.placeholder}
                serviceBooking={serviceBooking}
              />)
        ]
        }
      </div>
    </div>);
  }
}
