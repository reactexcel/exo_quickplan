import React, { Component, PropTypes } from 'react';
import Relay from 'react-relay';
import moment from 'moment';
import { FaCalendarCheckO, FaDollar } from 'react-icons/lib/fa';
import _ from 'lodash';
import { Card, Select2 } from '../../../Utils/components';
import UpdateServiceMutation from '../../../ServiceBooking/mutations/UpdateService';

// React Icons

export default class CustomTourConfigure extends Component {
  static propTypes = {
    serviceStatus: PropTypes.string,
    viewer: PropTypes.object
  };

  static defaultProps = {
    serviceStatus: ''
  };

  static people = [{
    text: 'Child 1',
    id: 1
  }, {
    text: 'Child 2',
    id: 2
  }, {
    text: 'Adult 1',
    id: 3
  }];

  constructor(props) {
    super(props);
    const serviceBooking = { ...props.viewer.serviceBooking };
    serviceBooking.cancelHours /= 24;
    if (serviceBooking.cancelHours === 0) {
      serviceBooking.cancelHours = '';
    }
    this.state = {
      patchData: serviceBooking,
      pickUpTime: '',
      dropOffTime: ''
    };
  }

  componentWillReceiveProps(nextProps) {
    const serviceBooking = { ...nextProps.viewer.serviceBooking };
    if (serviceBooking.pickUp && serviceBooking.pickUp.time && serviceBooking.pickUp.time != null) {
      const pickUpTime = moment(serviceBooking.pickUp.time, ['HHmm']).format('HH:mm');
      this.setState({ pickUpTime });
      if (serviceBooking.dropOff && serviceBooking.dropOff.time != null) {
        const dropOffTime = moment(serviceBooking.dropOff.time, ['HHmm']).format('HH:mm');
        this.setState({ dropOffTime });
      }
    }
    serviceBooking.cancelHours /= 24;
    if (serviceBooking.cancelHours === 0) {
      serviceBooking.cancelHours = '';
    }
    this.state = {
      patchData: serviceBooking
    };
  }

  handleUpdateService = (e) => {
    const name = e.target.name;
    let value = (e.target.type === 'checkbox' ? e.target.checked : e.target.value);

    if (name === 'cancelHours') {
      value = parseInt(value, 10) * 24;
    }

    const patchData = {};
    _.set(patchData, name, value);

    Relay.Store.commitUpdate(new UpdateServiceMutation({
      serviceBookingId: this.props.viewer.serviceBooking.id,
      serviceBookingKey: this.props.viewer.serviceBooking._key,
      patchData
    }));

    this.handleChange(e);
  };

  handleChange = (e) => {
    const name = e.target.name;
    const value = (e.target.type === 'checkbox' ? e.target.checked : e.target.value);

    const patchData = { ...this.state.patchData };
    _.set(patchData, name, value);

    this.setState({
      patchData
    });
  };

  availabilityInfo() {
    switch (this.props.serviceStatus) {
      case 'OK':
        return (<div className='exo-colors-text text-darken-2 availabilityInfo'>
          <FaCalendarCheckO size={18} /> <div>Available</div>
        </div>);
      case 'Booked':
        return (<div className='bookedColor availabilityInfo'>
          <FaDollar size={18} /> <div>Booked</div>
        </div>);
      default:
        return '';
    }
  }

  render() {
    const { viewer } = this.props;
    const noteTitle = <h5 className='exo-colors-text text-data-1'><i className='mdi-action-today' />Notes</h5>;
    const pdTitle = <h5 className='exo-colors-text text-data-1'><i className='mdi-image-compare' />Pickup / Drop-off</h5>;
    const travellerTitle = <h5 className='exo-colors-text text-data-1'><i className='mdi-social-person' />Travellers</h5>;

    return (
      <div className='configure'>
        <div className='general'>
          {/* Tour Availability */}
          {this.availabilityInfo()}

          <div style={{ padding: '10px', marginTop: '15px' }}>
            <div className='input-field'>
              <input id='input_title' name='placeholder.title' onBlur={this.handleUpdateService} value={(this.state.patchData.placeholder && this.state.patchData.placeholder.title)} type='text' onChange={this.handleChange} />
              <label className='active' htmlFor='input_title'>Title</label>
            </div>
          </div>

          <div style={{ padding: '10px', marginTop: '15px' }}>
            <div className='input-field'>
              <input name='price.amount' id='input_price' onBlur={this.handleUpdateService} value={(this.state.patchData.price && this.state.patchData.price.amount) || ''} type='number' onChange={this.handleChange} />
              <label className='active' htmlFor='input_price'>Price</label>
            </div>
          </div>

          <div style={{ padding: '10px', marginTop: '15px' }}>
            <div className='input-field'>
              <input name='cancelHours' id='input_cancelHours' onBlur={this.handleUpdateService} value={this.state.patchData.cancelHours} type='number' onChange={this.handleChange} />
              <label className='active' htmlFor='input_cancelHours'>Cancel before (days)</label>
            </div>
          </div>
        </div>

        {/* Travellers */}
        <Card title={travellerTitle}>
          <div className='travellers row mt-0'>
            <div className='col s11' style={{ overflow: 'hidden' }}>
              <Select2 multiple data={CustomTourConfigure.people} />
            </div>
          </div>
        </Card>

        {/* Pickup / Drop-off */}
        <Card title={pdTitle}>
          <div className='row mb-20'>
            <div className='col s12'><i className='mdi-navigation-arrow-back fs-20' /> Pick-up</div>
            <div className='input-field col s3'>
              <input type='time' name='pickUp.time' onBlur={this.handleUpdateService} onChange={this.handleChange} value={(this.state.pickUpTime) || ''} />
            </div>
            <div className='input-field col s9'>
              <input type='text' placeholder='Pick-up location' id='pickup-location' name='pickUp.location' onBlur={this.handleUpdateService} onChange={this.handleChange} value={(this.state.patchData.pickUp && this.state.patchData.pickUp.location) || ''} />
            </div>
            <div className='input-field col s12'>
              <textarea placeholder='Pick-up notes' type='text' id='pickup-notes' className='materialize-textarea' name='pickUp.remarks' onBlur={this.handleUpdateService} onChange={this.handleChange} value={(this.state.patchData.pickUp && this.state.patchData.pickUp.remarks) || ''} />
            </div>
          </div>

          <div className='row'>
            <div className='col s12'><i className='mdi-navigation-arrow-forward fs-20' /> Drop-off</div>
            <div className='input-field col s3'>
              <input type='time' name='dropOff.time' onBlur={this.handleUpdateService} onChange={this.handleChange} value={(this.state.dropOffTime) || ''} />
            </div>
            <div className='input-field col s9'>
              <input type='text' placeholder='Drop-off location' id='dropoff-location' name='dropOff.location' onBlur={this.handleUpdateService} onChange={this.handleChange} value={(this.state.patchData.dropOff && this.state.patchData.dropOff.location) || ''} />
            </div>
            <div className='input-field col s12'>
              <textarea placeholder='Drop-off notes' type='text' id='dropoff-notes' className='materialize-textarea' name='dropOff.remarks' onBlur={this.handleUpdateService} onChange={this.handleChange} value={(this.state.patchData.dropOff && this.state.patchData.dropOff.remarks) || ''} />
            </div>

            <div className='col s12'>
              <input name='longDistanceOption' type='checkbox' id='checkbox1' checked={viewer.serviceBooking.longDistanceOption} onChange={this.handleUpdateService} />
              <label htmlFor='checkbox1'>Request long distance service ( > 10km )</label>
            </div>
          </div>
        </Card>

        {/* Notes */}
        <Card title={noteTitle}>
          <div className='input-field'>
            <textarea type='text' id='notes' name='notes' placeholder='Notes' className='materialize-textarea' onBlur={this.handleUpdateService} onChange={this.handleChange} value={this.state.patchData.notes || ''} />
          </div>
        </Card>
      </div>
    );
  }
}
