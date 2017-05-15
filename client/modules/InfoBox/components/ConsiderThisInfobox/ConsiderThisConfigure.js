import React, { Component, PropTypes } from 'react';
import Relay from 'react-relay';
import { Card } from '../../../Utils/components';
import UpdateServiceMutation from '../../../ServiceBooking/mutations/UpdateService';

export default class ConsiderThisConfigure extends Component {
  static propTypes = {
    viewer: PropTypes.object.isRequired
  };

  static people = [{
    text: 'Child 1'
  }, {
    text: 'Child 2'
  }, {
    text: 'Adult 1'
  }];

  constructor(props) {
    super(props);
    const serviceBooking = { ...props.viewer.serviceBooking };
    serviceBooking.cancelHours /= 24;
    this.state = {
      patchData: serviceBooking
    };
  }

  componentWillReceiveProps(nextProps) {
    const serviceBooking = { ...nextProps.viewer.serviceBooking };
    serviceBooking.cancelHours /= 24;
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

    Relay.Store.commitUpdate(new UpdateServiceMutation({
      serviceBookingId: this.props.viewer.serviceBooking.id,
      serviceBookingKey: this.props.viewer.serviceBooking._key,
      patchData: {
        [name]: value
      }
    }));

    this.handleChange(e);
  };

  handleChange = (e) => {
    const name = e.target.name;
    const value = (e.target.type === 'checkbox' ? e.target.checked : e.target.value);

    this.setState({
      patchData: {
        ...this.state.patchData,
        [name]: value
      }
    });
  };

  render() {
    const noteTitle = <h5 className='exo-colors-text text-data-1'><i className='mdi-action-today' />Notes</h5>;

    return (
      <div className='configure'>
        <div className='general' />

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
