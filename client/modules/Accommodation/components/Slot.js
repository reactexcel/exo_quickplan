import React, { Component, PropTypes } from 'react';
import _ from 'lodash';
import AccommodationPlacement from './AccommodationPlacement';
import PlaceholderSelection from './PlaceholderSelection';

export default class Slot extends Component {
  static propTypes = {
    services: PropTypes.array,
    height: PropTypes.number,
    width: PropTypes.number,
    activeDetail: PropTypes.object,
    handleClickTour: PropTypes.func,
    handleOpenOverlay: PropTypes.func,
    changeRemoveModalState: PropTypes.func,
    changeModalState: PropTypes.func,
    cityDayKey: PropTypes.string,
    type: PropTypes.string,
    isSelected: PropTypes.bool,
    addPlaceholder: PropTypes.bool,
    handleClickPlaceholder: PropTypes.func,
    cityBookingID: PropTypes.string,
    totalDays: PropTypes.number,
    cityBookingKey: PropTypes.string,
    cityBookingId: PropTypes.string,
    activeServiceBookingKey: PropTypes.string,
    isTaView: React.PropTypes.bool
  };

  static defaultProps = {
    addPlaceholder: false,
    handleClickPlaceholder: null
  };

  state = {
    addedPlaceholder: false
  };

  componentWillMount() {
    this.init();
  }

  componentWillUpdate(nextProps) {
    this.props = nextProps;
    this.init();
  }

  init() {
    this.config = {
      height: this.props.height || 80,
      width: this.props.width
    };

    const { matrix, maxDisplayingColumn } = this.calculateHotelsPosition();

    this.calculateStyles(matrix, maxDisplayingColumn);
  }

  calculateHotelsPosition() {
    let services = this.props.services;
    const numberOfHotels = services.length;
    let maxDisplayingColumn = 0;
    const matrix = [];
    for (let z = 0; z < this.props.totalDays; z++) {
      matrix.push(new Array(numberOfHotels).fill('available'));
    }

    // console.log( this.props )
    // console.log( matrix )

    services = _.orderBy(services, ['durationNights'], ['desc']);

    _.each(services, (service) => {
      // let startDay = service.startDay - 1; // Index start from zero

      let startDay = service.startDay; // Index start from zero

      // console.log('stttt ::' + startDay )

      startDay = startDay - this.props.cityStartDay; // eslint-disable-line operator-assignment

      // console.log('stttt 11 ::' + startDay )

      const durationNights = service.durationNights;

      let i = 0;
      if (matrix[startDay]) {
        while (matrix[startDay][i] !== 'available') {
          i++;
        }
      }

      for (let x = 0; x < durationNights; x++) {
        if (matrix[startDay + x]) {
          matrix[startDay + x][i] = 'unavailable';
        }
      }
      if (matrix[startDay]) {
        matrix[startDay][i] = service;
      }
      maxDisplayingColumn = _.max([maxDisplayingColumn, i + 1]);
    });
    return { matrix, maxDisplayingColumn };
  }

  /**
   * Calculate coordinate position of each tour to be displayed on the tour canvas
   * @param matrix
   * @param maxDisplayingColumn
   */
  calculateStyles(matrix, maxDisplayingColumn) {
    const services = this.props.services;
    const numberOfTours = services.length;

    let width;
    let left;
    this.positions = {};

    // Loop through the matrix to calculate tour styles
    for (let i = 0; i < this.props.totalDays; i++) {
      for (let j = 0; j < numberOfTours; j++) {
        const service = matrix[i][j];
        // If the width doesn't given by props, have to calculate it based on the width of the window
        if (!this.config.width) {
          width = `calc( 80.2% / ${maxDisplayingColumn} )`;
          left = `calc( ${j} * 80.2% / ${maxDisplayingColumn} )`;
        } else {
          width = `${this.config.width}px`;
          left = `calc( ${j} * ${width} )`;
        }

        if (service && typeof (service) !== 'string') {
          const paddingHeight = service.durationNights * 28;
          const startDayHeight = 110 + ((service.startDay - 1) * 30);
          const test = (service.durationNights * this.config.height) + paddingHeight;

          let startDay = service.startDay;

          if (this.props.cityStartDay > 1) {
            startDay = startDay - this.props.cityStartDay; // eslint-disable-line operator-assignment
          } else {
            startDay = startDay - 1; // eslint-disable-line operator-assignment
          }

          // console.log( 'aaaa::: '+  this.props.cityStartDay )

          const top = (startDay * this.config.height) + 110;


          // console.log('top ::' + top )
          // if( top < 0 ){
          //   top = top * -1;
          // }

          // if( this.props.cityStartDay > 1 ){
          //   //top = top - 110;
          // }

          this.positions[service.__dataID__] = {
            // top: (i * this.config.height) + startDayHeight,
            top,
            height: (service.durationNights * this.config.height),
            left,
            width
          };
        }
      }
    }
  }

  render() {
    const { matrix, maxDisplayingColumn } = this.calculateHotelsPosition();
    const style = {
      position: 'absolute',
      paddingBottom: '21px',
      marginTop: '13px',
      top: '103px',
      width: '80.3%'
    };

    const services = this.props.services.map((service, i) => {
      if (service.serviceBookings && service.serviceBookings.length > 0 && service.serviceBookings[0].placeholder) {
        return (<PlaceholderSelection
          type={this.props.type}
          key={`${i}`}
          style={{ ...style, ...this.positions[service.__dataID__] }}
          service={service}
          handleClickPlaceholder={() => null}
          cityBookingKey={this.props.cityBookingKey}
          cityBookingId={this.props.cityBookingId}
          activeServiceBookingKey={this.props.activeServiceBookingKey}
          isInPlacement
        />);
      }

      return (
        <AccommodationPlacement
          country={this.props.country}
          count={maxDisplayingColumn}
          type={this.props.type}
          key={`${i}`}
          totalDays={this.props.totalDays}
          cityDays={this.props.cityDays}
          style={{ ...style, ...this.positions[service.__dataID__] }}
          service={service}
          activeDetail={this.props.activeDetail}
          handleClickTour={this.props.handleClickTour}
          changeRemoveModalState={this.props.changeRemoveModalState}
          changeModalState={this.props.changeModalState}
          handleOpenOverlay={this.props.handleOpenOverlay}
          isSelected={this.props.isSelected}
          cityDayKey={this.props.cityDayKey}
          cityBookingID={this.props.cityBookingID}
          handleClickPlaceholder={this.props.handleClickPlaceholder}
          cityBookingKey={this.props.cityBookingKey}
          cityBookingId={this.props.cityBookingId}
          activeServiceBookingKey={this.props.activeServiceBookingKey}
          isInPlacement
          cityCode={this.props.cityCode}
          isTaView={this.props.isTaView}
        />
      );
    });

    return <div>{services}</div>;
  }
}
