import React, { Component, PropTypes } from 'react';
import _ from 'lodash';
import { StatusBox } from '../../Utils/components';

export default class ServiceBookingPaxStatus extends Component {
  static propTypes = {
    viewer: PropTypes.object.isRequired,
    relay: PropTypes.object,
    cityDayKey: PropTypes.string,
    tripKey: PropTypes.string,
    serviceBookingKey: PropTypes.string,
    theKey: PropTypes.string
  };

  state = {
    theKey: this.props.theKey
  }

  componentWillReceiveProps(nextProps) {
    if (this.state.theKey !== nextProps.theKey) {
      this.props.relay.forceFetch();
      this.setState({ theKey: nextProps.theKey });
    }
  }

  render() {
    const { viewer } = this.props;
    const statusBoxes = () => {
      if (this.props.TourPlacement) {
        const alertResult = [];
        const warningResult = [];
        let i = 0;
        _.each(viewer.checkServiceBookingPaxStatus, (obj) => {
          if (obj.severity !== 0) {
            if (obj.severity > 10) {
              const type = obj.severity > 10 ? 'alert' : 'warning';
              alertResult.push(<StatusBox key={i} type={type} status={obj.message} />);
              i++;
            } else {
              const type = obj.severity > 10 ? 'alert' : 'warning';
              warningResult.push(<StatusBox key={i} type={type} status={obj.message} />);
              i++;
            }
          }
        });
        if (alertResult.length > 0 && warningResult.length > 0) {
          return <p><i style={{ fontSize: '12px', paddingBottom: '3px', color: '#D51224' }} className='mdi mdi-account-alert' /></p>;
        } else if (alertResult.length > 0) {
          return <p><i style={{ fontSize: '12px', paddingBottom: '3px', color: '#D51224' }} className='mdi mdi-account-alert' /></p>;
        } else if (warningResult.length > 0) {
          return <p><i style={{ fontSize: '12px', paddingBottom: '3px', color: '#ffb340' }} className='mdi mdi-account-alert' /></p>;
        }
        return false;
      }
      const result = [];
      let i = 0;
      _.each(viewer.checkServiceBookingPaxStatus, (obj) => {
        if (obj.severity !== 0) {
          const type = obj.severity > 10 ? 'alert' : 'warning';
          result.push(<StatusBox key={i} type={type} status={obj.message} />);
          i++;
        }
      });
      return result;
    };

    return (
      <div style={{ paddingBottom: '20px' }}>{ statusBoxes() }</div>
    );
  }
}
