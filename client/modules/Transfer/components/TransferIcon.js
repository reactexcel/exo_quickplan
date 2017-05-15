import React, { Component, PropTypes } from 'react';

export default class TransferIcon extends Component {
  // static propTypes = {
  //   typeDescription: PropTypes.string.isRequired
  // };

  componentWillMount() {
    this.icon = this.iconClass(this.props.typeDescription);
  }

  iconClass = (icon) => {
    switch (icon) {
      case 'Car':
        return 'mdi mdi-car';
      case 'Van':
        return 'mdi mdi-truck';
      case 'Bus':
        return 'mdi mdi-bus';
      case 'Public transport':
        return 'mdi mdi-tram';
      case 'Plane':
        return 'mdi mdi-airplane';
      case 'Taxi':
        return 'mdi mdi-car';
      case 'Train':
        return 'mdi mdi-train';
      case 'Boat':
        return 'mdi mdi-ferry';
      case 'Helicopter':
        return 'mdi mdi-fan';
      case 'Custom':
        return 'mdi mdi-help-circle-outline';
      case 'Multi-vehicle':
        return 'mdi mdi-jeepney';
      default:
        return 'mdi mdi-label-outline';
    }
  };

  render() {
    return (
      <i className={this.icon} />
    );
  }
}
