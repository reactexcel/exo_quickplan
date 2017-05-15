import React, { Component, PropTypes } from 'react';
import _ from 'lodash';
import { StatusBox } from '../../Utils/components';

export default class SupplierPaxStatus extends Component {
  static propTypes = {
    viewer: PropTypes.object.isRequired,
    relay: PropTypes.object,
    cityBookingKey: PropTypes.string,
    tripKey: PropTypes.string,
    roomConfigKey: PropTypes.string,
    theKey: PropTypes.string
  };

  state = {
    theKey: this.props.theKey
  }

  componentWillReceiveProps(nextProps) {
    const { cityBookingKey, tripKey, roomConfigKey } = this.props;
    if (this.state.theKey !== nextProps.theKey) {
      this.props.relay.forceFetch({ cityBookingKey, tripKey, roomConfigKey }, () => {
        this.setState({ theKey: nextProps.theKey });
      });
    }
  }

  render() {
    const { viewer } = this.props;

    const statusBoxes = () => {
      const result = [];
      let i = 0;
      _.each(viewer.checkSupplierPaxStatus, (obj) => {
        if (obj.severity !== 0) {
          const type = obj.severity > 10 ? 'alert' : 'warning';
          result.push(<StatusBox key={i} type={type} status={obj.message} />);
          i++;
        }
      });

      return result;
    };

    return (
      <div>{ statusBoxes() }</div>
    );
  }
}
