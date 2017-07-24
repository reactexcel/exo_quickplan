// source  https://github.com/ecmadao/react-times

import React, { Component, PropTypes } from 'react';
import moment from 'moment';
import 'moment-range';
import TimePicker from 'react-times';
import ReactDateRangePicker from 'react-daterange-picker';
import shortId from 'shortid';

//import '../../../../node_modules/react-times/css/material/default.css';

export default class ExoTimePicker extends Component {
  static propTypes = {
  }

  state = {
    focused: false,
    timeMode: '12',
    time: '',
    AMPM: 'AM'
  }

  componentWillReceiveProps(nextProps) {
    const settings = this.state;
    if (nextProps.timeMode) {
      settings.timeMode = nextProps.timeMode;
    }
    if (nextProps.time) {
      settings.time = nextProps.time;
    }
    this.setState(settings);
  }

  componentDidMount() {
  }

  componentWillUnmount() {
  }

  onTimeChange(time) {
    const settings = this.state;
    settings.time = time;
    settings.AMPM = this.state.AMPM;
    settings.focused = true;
    this.setState(settings);
  }

  onFocusChange(time) {
    const settings = this.state;
    settings.focused = true;
    this.setState(settings);
    this.props.onTimeChange(this.state.time, this.state.AMPM);
  }

  onTimeQuantumChange(ampm) {
    const settings = this.state;
    settings.AMPM = ampm;
    this.setState(settings);
  }

  uuid = shortId.generate();

  render() {
    return (
      <div id={this.uuid}>
        <TimePicker
          timeMode={this.state.timeMode}
          time={this.state.time}
          focused={this.state.focused}
          theme='material'
          onFocusChange={this.onFocusChange.bind(this)}
          onTimeChange={this.onTimeChange.bind(this)}
          onTimeQuantumChange={this.onTimeQuantumChange.bind(this)}
        />
      </div>
    );
  }
}
