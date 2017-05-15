import React, { Component, PropTypes } from 'react';
import _ from 'lodash';
import Slot from './Slot';

export default class AccommodationCanvas extends Component {
  static propTypes = {
    activeDetail: PropTypes.object,
    totalDays: PropTypes.number.isRequired,
    accommodationPlacements: PropTypes.array.isRequired,
    relay: PropTypes.object,
    cityBookingKey: PropTypes.string,
    cityBookingId: PropTypes.string,
    activeServiceBookingKey: PropTypes.string,
    isTaView: PropTypes.bool
  };

  flattenAccommodation = (accommodation) => {
    _.forEach(accommodation, (acc) => {
      if (acc.supplier) {
        acc.title = acc.supplier.title; // eslint-disable-line no-param-reassign
      }
    });
  };

  render() {
    const finalHeight = this.props.totalDays * 434;
    const { accommodationPlacements, activeDetail, cityBookingKey, cityBookingId, activeServiceBookingKey, country } = this.props;
    this.flattenAccommodation(accommodationPlacements);

    return (
      <div className='row m-0'>
        <div className='col s12' style={{ position: 'relative' }}>
          {
            <Slot cityStartDay={this.props.cityStartDay} height={350} country={country} cityCode={this.props.cityCode} services={accommodationPlacements} activeServiceBookingKey={activeServiceBookingKey} activeDetail={activeDetail} cityDays={this.props.cityDays} totalDays={this.props.totalDays} type='hotel' cityBookingKey={cityBookingKey} cityBookingId={cityBookingId} isTaView={this.props.isTaView} />
          }
        </div>
      </div>
    );
  }
}
