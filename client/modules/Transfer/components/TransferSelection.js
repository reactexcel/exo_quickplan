import React, { Component, PropTypes } from 'react';
import cx from 'classnames';
import styles from '../style.module.scss';
import TransferIcon from './TransferIcon';

export default class TransferSelection extends Component {

  static propTypes = {
    data: PropTypes.object.isRequired,
    onClick: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = { };
  }

  render() {
    const { data } = this.props;
    let fromCityName = '';
    if (data.route && data.route.from) {
      fromCityName = `${data.route.from.cityName}, ${data.route.from.place}`;
    }
    let toCityName = '';
    if (data.route && data.route.to) {
      toCityName = `${data.route.to.cityName}, ${data.route.to.place}`;
    }
    const description1 = ((data.vehicle && data.vehicle.category) || (data.class && data.class.description) || '');
    const description2 = ((data.vehicle && data.vehicle.model) || '');

    return (
      <div className={cx(styles['transfer-selection-item'], 'cursor')} onClick={this.props.onClick}>
        <div className='row m-0 p-0'>
          <div className='col s2 mr-5 fw-600 fs-20'><TransferIcon typeDescription={data.type.description} /></div>
          <div className='col s9 fw-600 fs-12'>
            <div>{description1}</div>
            <div>{description2}</div>
          </div>
        </div>
        <div className='row m-0 p-0'>
          <div className='col s2 mr-5 fs-10 exo-colors-text text-label-1'>From</div>
          <div className='col s9 p-0 fw-600 fs-10'>{fromCityName}</div>
        </div>
        <div className='row m-0 p-0'>
          <div className='col s2 mr-5 fs-10 exo-colors-text text-label-1'>To</div>
          <div className='col s9 p-0 fw-600 fs-10'>{toCityName}</div>
        </div>
      </div>
    );
  }

}
