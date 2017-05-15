import React, { Component, PropTypes } from 'react';
import _ from 'lodash';
import PubSub from 'pubsub-js';
import ReactTooltip from 'react-tooltip';
import cx from 'classnames';
import SlotSelector from '../../Tour/components/SlotSelector';

// for local transfer
import { Modal, Dropdown } from '../../Utils/components';
import TransferPlacement from '../../Transfer/components/TransferPlacement';
import Meal from '../../Meal/components/Meal';
import style_AA from '../../Transfer/style.module.scss';

export default class Slot extends Component {
  static propTypes = {
    services: PropTypes.array,
    meals: PropTypes.array,
    preselections: PropTypes.array,
    height: PropTypes.number,
    width: PropTypes.number,
    handleClickTour: PropTypes.func,
    handleOpenOverlay: PropTypes.func,
    changeRemoveModalState: PropTypes.func,
    changeModalState: PropTypes.func,
    cityDayKey: PropTypes.string,
    type: PropTypes.string,
    isSelected: PropTypes.bool,
    addPlaceholder: PropTypes.bool,
    handleClickPlaceholder: PropTypes.func,
    cityBookingKey: PropTypes.string,
    isInPlacement: PropTypes.bool,
    days: React.PropTypes.array,
    tripKey: PropTypes.string,
    activeServiceBookingKey: PropTypes.string,
    isTaView: PropTypes.bool,
    handleSaveMeal: PropTypes.func,
    defaultTours: PropTypes.array,
  };

  state = {
    addedPlaceholder: false,
    data_transfer_serviceBookings: false,
    removedServiceBookingKey: false,
    meals: [],
    am: '',
    pm: '',
    eve: ''
  };
  services = [];

  componentWillMount() {
    this.init();
  }

  componentWillReceiveProps(props) {
    const props_unavailableSlots = props.unavailableSlots;
    const props_meals = props.meals;
    let state_meals = [];
    // if (typeof props_unavailableSlots !== 'undefined' && props_unavailableSlots.length > 0) {
    //   _.forEach(props_meals, (meal, i) => {
    //     const meal_slotOrder = meal.slotOrder;
    //     let selectMeal = true;
    //     _.forEach(props_unavailableSlots, (us, j) => {
    //       if ((meal_slotOrder === 1 && us === 'am') || (meal_slotOrder === 2 && us === 'pm') || (meal_slotOrder === 3 && us === 'eve')) {
    //         selectMeal = false;
    //       }
    //     });
    //     if (selectMeal === true) {
    //       state_meals.push(meal);
    //     }
    //   });
    // } else {
    state_meals = props_meals;
    // }

    this.setState({
      data_transfer_serviceBookings: props.transfer_serviceBookings,
      meals: state_meals,
      am: '',
      pm: '',
      eve: ''
    });
    if (props.unavailableSlots && props.unavailableSlots.length > 0) {
      props.unavailableSlots.map((slot) => { // eslint-disable-line array-callback-return
        if (slot === 'am') {
          this.setState({ am: slot });
        } else if (slot === 'pm') {
          this.setState({ pm: slot });
        } else if (slot === 'eve') {
          this.setState({ eve: slot });
        }
      });
    }
  }

  componentWillUpdate(nextProps) {
    this.props = nextProps;
    this.init();
  }

  /**
   * Calculate coordinate position of each tour to be displayed on the tour canvas
   * @param matrix
   * @param maxDisplayingColumn
   */
  calculateStyles(matrix, maxDisplayingColumn) {
    const services = this.services;
    const numberOfTours = services.length;
    let width;
    let left;
    let right;
    const positions = {};

    // Loop through the matrix to calculate tour styles
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < numberOfTours; j++) {
        const service = matrix[i][j];
        // If the width doesn't given by props, have to calculate it based on the width of the window
        if (!this.config.width) {
          if (maxDisplayingColumn === 1) {
            width = `calc( 43.3% / ${maxDisplayingColumn} )`;
            right = `calc( ${1} * 38% / ${maxDisplayingColumn} )`;
          } else {
            width = `calc( 63% / ${maxDisplayingColumn} )`;
            left = `calc( ${j} * 63% / ${maxDisplayingColumn} )`;
          }
        } else {
          width = `${this.config.width}px`;
          left = `calc( ${j} * ${width})`;
        }

        if (service && service !== 'unavailable') {
          positions[service.id] = {
            top: i * this.config.height,
            height: `${service.durationSlots * this.config.height}px`,
            left,
            right,
            width
          };
        }
      }
    }

    return positions;
  }

  /**
   * Create a matrix with dimension 3xN (N is the number of tours), then
   * fill each tour into a cell. In case of Full day tour, the cell under
   * the selected cell will be marked as "unavailable". This matrix will then
   * be used to calculate a coordinate(top, left) position of a tour on the tour canvas.
   * In addition, maxDisplayingColumn will be used to calculate a width if this.props.width
   * hasn't been given
   * @returns {{matrix: *[], maxDisplayingColumn: number}}
   */
  calculateToursPosition() {
    const services = this.services;
    const numberOfTours = services.length;
    let maxDisplayingColumn = 0;

    // Create a two dimensional array with 3xN (pre-filled with undefined)
    const matrix = [new Array(numberOfTours), new Array(numberOfTours), new Array(numberOfTours)];

    // Loop through the tour to fill each tour in the created matrix
    _.each(services, (service) => {
      if (!service.startSlot) {
        // eslint-disable-next-line no-param-reassign
        service.startSlot = 1;  // if undefined in case of localtransfer
      }
      const startSlot = service.startSlot - 1; // Index start from zero
      const durationSlots = service.durationSlots;

      for (let i = 0; i < numberOfTours; i++) {
        // Find the left most cell that is still empty in that Slot
        if (matrix[startSlot][i]) continue; // eslint-disable-line no-continue
        else if (durationSlots === 2 && matrix[startSlot + 1][i]) continue; // eslint-disable-line no-continue


        // In case of Full day tour, the below cell will be marked as unavailable
        if (durationSlots !== 1) matrix[startSlot + 1][i] = 'unavailable';

        // Put the tour into the cell
        matrix[startSlot][i] = service;

        // Save max column
        maxDisplayingColumn = _.max([maxDisplayingColumn, i + 1]);

        break;
      }
    });

    return { matrix, maxDisplayingColumn };
  }

  init() {
    this.config = {
      height: this.props.height || 80,
      width: this.props.width
    };
    this.implicitServices = this.getImplicitFreeTimesServices();
    this.services = this.props.services.filter(service => service.inactive !== true).concat(this.implicitServices);
    const { matrix, maxDisplayingColumn } = this.calculateToursPosition();
    this.positions = this.calculateStyles(matrix, maxDisplayingColumn);
  }

  getImplicitFreeTimesServices() {
    if (!this.props.isTaView) {
      return [];
    }
    const implicitFreeTimeBlocks = null;
    const freeTimeSlotsSet = new Set([1, 2, 3]);
    this.props.services.filter(service => service.inactive !== true).map((service, i) => { // eslint-disable-line  array-callback-return
      freeTimeSlotsSet.delete(service.startSlot);
      for (let i = 1; i < service.durationSlots; i++) {
        freeTimeSlotsSet.delete(service.startSlot + i);
      }
    });
    const services = Array.from(freeTimeSlotsSet).map(startSlot => ({
      id: `implicit_free_time_${this.props.cityDayKey}_${startSlot}`,
      key: `implicit_free_time_${this.props.cityDayKey}_${startSlot}`,
      startSlot,
      durationSlots: 1,
      note: '',
      placeholder: {
        title: 'Free Time',
        type: 'freeTime'
      },
      tour: null,
      isImplicitFreeTime: true
    }));

    return services;
  }

  render() {
    const { matrix, maxDisplayingColumn } = this.calculateToursPosition();
    const style = {
      position: 'absolute',
      padding: '8px 0px 7px 25px',
    };
    const services = this.services.map((service, i) => {
      if (service.localtransfer && service.localtransfer != null) {
        if (service._key === this.state.removedServiceBookingKey) { // this check will not show removed local transfer when a local transfer is removed
          return '';
        }
        return (<div key={i} className='valign-wrapper' style={{ ...style, ...this.positions[service.id] }}>
          <TransferPlacement
            isLocalTransfer
            completeTransferSB={service}
            numberOfTransferOptions='1'
            cityBookingKey={this.props.cityBookingKey}
            cityDayKey={this.props.cityDayKey}
            key={service._key}
            countryBooking={this.props.countryBooking}
            transferPlacementKey={service._key}
            transferPlacementId={service.id}
            data={service.localtransfer}
            bindInfobox
            onSuccessClearTransfer={() => {
              PubSub.publish('Infobox', {
                type: 'clear',
              });
              PubSub.publish('TripForceFetch', {});
            }}
            onFailureClearTransfer={() => {
              PubSub.publish('Infobox', {
                type: 'clear',
              });
              PubSub.publish('TripForceFetch', {});
            }}
            updateLocalTransfer={this.props.updateLocalTransfer}
            statusState={service && service.status ? service.status.state : ''}
            serviceBooking={service}
          />
        </div>);
      } else { // eslint-disable-line no-else-return
        if (service.tour === null && service.status === null && service.placeholder === null) { // eslint-disable-line no-lonely-if
          return '';
        } else { // eslint-disable-line no-else-return
          return <SlotSelector selectedTour={this.props.selectedTour} preSelectionActionTour={this.props.preSelectionActionTour} countryBooking={this.props.countryBooking} count={maxDisplayingColumn} type={this.props.type} key={service.id} style={{ ...style, ...this.positions[service.id] }} service={service} isInPlacement={this.props.isInPlacement} handleClickTour={this.props.handleClickTour} changeRemoveModalState={this.props.changeRemoveModalState} changeModalState={this.props.changeModalState} handleOpenOverlay={this.props.handleOpenOverlay} cityDayKey={this.props.cityDayKey} isSelected={this.props.isSelected} cityBookingKey={this.props.cityBookingKey} handleClickPlaceholder={this.props.handleClickPlaceholder} activeServiceBookingKey={this.props.activeServiceBookingKey} tripKey={this.props.tripKey} days={this.props.days} isTaView={this.props.isTaView} preselections={this.props.preselections} defaultTours={this.props.defaultTours} unavailableSlots={this.props.unavailableSlots} />;
        }
      }
    });

    const unavailableSlots = this.props.unavailableSlots;

    const slots_list = [
      {
        dataTip: 'Morning',
        text: 'AM'
      }, {
        dataTip: 'Afternoon',
        text: 'PM'
      }, {
        dataTip: 'Evening',
        text: 'EVE'
      }
    ];

    let slots_check = 0;
    const slots_html = _.map(slots_list, (slot, i) => {  // eslint-disable-line consistent-return
      const slot_text = slot.text;

      slots_check++;
      let style_height = '40px';
      if (slots_check === 2) {
        style_height = '132px';
      } else if (slots_check === 3) {
        style_height = '224px';
      }

      // if (_.indexOf(unavailableSlots, slot_text.toLowerCase()) === -1) {
      //   return (<div key={i} data-tip={slot.dataTip}><span style={{ top: `${style_height}`, left: '12px', position: 'relative', color: '#9c9c9c' }}>{slot_text}</span></div>);
      // }
      return (<div key={i} data-tip={slot.dataTip}><span style={{ top: `${style_height}`, left: '12px', position: 'relative', color: '#9c9c9c' }}>{slot_text}</span></div>);
    });

    return (
      <div>
        {
          this.props.isInPlacement ?
          (
            <div>
              <div style={{ width: '25px', display: 'inline', float: 'left', height: '100%' }}>
                { slots_html }

                {/*
                {this.state.am === 'am' ? (<div data-tip='Morning'><span style={{ top: '40px', position: 'relative', color: '#CCCCCC' }}>Slot Unavailable</span></div>)
                : (<div data-tip='Morning'><span style={{ top: '40px', left: '12px', position: 'relative', color: '#CCCCCC' }}>AM</span></div>)}
                {this.state.pm === 'pm' ? (<div data-tip='Afternoon'><span style={{ top: '132px', position: 'relative', color: '#CCCCCC' }}>Slot Unavailable</span></div>)
                : (<div data-tip='Afternoon'><span style={{ top: '132px', left: '12px', position: 'relative', color: '#CCCCCC' }}>PM</span></div>)}
                {this.state.eve === 'eve' ? (<div data-tip='Evening'><span style={{ top: '224px', position: 'relative', color: '#CCCCCC' }}>Slot Unavailable</span></div>)
                : (<div data-tip='Evening'><span style={{ top: '224px', left: '12px', position: 'relative', color: '#CCCCCC' }}>EVE</span></div>)}
                */}

              </div>
              <div style={{ width: '25px', display: 'inline', float: 'left', height: '100%' }}>
                <Meal meals={this.state.meals} am={this.state.am} pm={this.state.pm} eve={this.state.eve} handleSaveMeal={this.props.handleSaveMeal} unavailableSlots={this.props.unavailableSlots} />
              </div>
              <div style={{ marginLeft: '50px', position: 'relative' }}>
                {services}
              </div>
              <ReactTooltip />
            </div>
          ) : (
            <div>{services}</div>
          )
        }
      </div>
    );
  }
}
