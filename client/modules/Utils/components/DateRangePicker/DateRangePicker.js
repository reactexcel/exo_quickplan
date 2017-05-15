import React, { Component, PropTypes } from 'react';
import moment from 'moment';
import 'moment-range';
import ReactDateRangePicker from 'react-daterange-picker';
import './style.scss';

export default class DateRangePicker extends Component {
  static propTypes = {
    triggerButton: PropTypes.node.isRequired,
    onDateChange: PropTypes.func.isRequired,
    singleDateRange: PropTypes.bool,
  };

  static stateDefinitions = {
    available: {
      color: null,
      label: 'Available',
    },
    unavailable: {
      selectable: false,
      color: '#78818b',
      label: 'Unavailable',
    },
    enquire: {
      color: '#ffd200',
      label: 'Enquire',
    },
  };

  state = {
    value: null,
    isOpen: false
  };

  componentDidMount() {
    /**
     Clicking outside the picker will close the picker
     Have to use document for binding the event instead of using JQuery
     See http://stackoverflow.com/questions/25862475/react-and-jquery-event-handlers-fired-in-wrong-order
     */
    document.addEventListener('click', this.closeDatePicker);
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.closeDatePicker);
  }

  getTriggerButton(triggerButton, openDatePicker) {
    return React.cloneElement(triggerButton, {
      onClick: openDatePicker
    });
  }

  closeDatePicker = () => {
    this.setState({ isOpen: false });
  };

  handleSelect = (range, states) => {
    // range is a moment-range object
    this.setState({
      value: range,
      states
    });

    this.props.onDateChange(range.start, range.end);
  };

  openDatePicker = () => {
    this.setState({ isOpen: true });
  };

  stopPropagation(e) {
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();
  }

  render() {
    let none;
    if (!this.state.isOpen) {
      none = 'none';
    } else {
      none = '';
    }
    let v_value = this.state.value;
    if (v_value === null && this.props.value) {
      v_value = this.props.value;
    }

    return (
      <span id='DateRangePickerWrapper' onClick={this.stopPropagation}>
        {this.getTriggerButton(this.props.triggerButton, this.openDatePicker)}
        <input type='button' value='OK' style={{ backgroundColor: 'white', border: '1px solid grey', display: none, zIndex: '200', position: 'relative', top: '370px', left: '25px' }} onClick={this.closeDatePicker} />
        {this.state.isOpen ?
          <ReactDateRangePicker
            firstOfWeek={1}
            numberOfCalendars={2}
            selectionType='range'
            minimumDate={(this.props.minimumDate instanceof Date) ? this.props.minimumDate : undefined}
            stateDefinitions={DateRangePicker.stateDefinitions}
            defaultState='available'
            value={v_value}
            onSelect={this.handleSelect}
            singleDateRange={this.props.singleDateRange || false}
            // dateStates={dateRanges}
          /> : null
        }
      </span>
    );
  }
}
