import React, { Component, PropTypes } from 'react';
import classNames from 'classnames/bind';
import Promotion from './Promotion';
import styles from '../style.module.scss';

export default class RoomCategory extends Component {

  static propTypes = {
    accommodations: PropTypes.array.isRequired,
    handleSelectAccommodation: PropTypes.func.isRequired,
    isSelected: PropTypes.bool
  };

  _priceFormat = (showPrice) => { // eslint-disable-line consistent-return
    let finalPrice = '';
    const arr = showPrice.toString().split('');
    _.times(arr.length, (i) => {
      finalPrice += arr[i];
      if ((arr.length - i - 1) % 3 === 0 && i < arr.length - 1) finalPrice += ',';
    });
    return finalPrice;
  }

  renderAccommodations(accommodations, isSelected) {
    const cx = classNames.bind(styles);

    return accommodations.map((acc, idx) => (
      <div className={cx('col s12', 'roomItem')} key={acc.id}>

        <div className='roomItem row mb-5 mt-5 mr-0 exo-colors-text text-data-1' key={acc.id}>
          <div className='col s7 p-0'>
            <input type='checkbox' id={`checkbox${acc.id}`} defaultChecked={acc.isSelected} onClick={this.props.handleSelectAccommodation.bind(null, acc, idx, 'isSelected')} disabled={isSelected === false} />
            <label htmlFor={`checkbox${acc.id}`}>{acc.title}</label>
            <Promotion hasPromotions={acc.hasPromotions} rate={acc.rate} promotions={acc.promotions} />
          </div>
          <div className='col s3 p-0'>
            <h6 className='light'>{acc.rate ? `from ${this._priceFormat(acc.rate.doubleRoomRate)} THB` : 'price on request'} </h6>
          </div>
          <div className='col s2 p-0'>
            <i className={cx('cursor right mdi mdi-pin mdi-28px', { 'exo-colors-text': !acc.isPreselected }, { pinRotationOn: !acc.isPreselected && !acc.isSelected }, { 'exo-colors-text text-accent-3': acc.isPreselected }, { 'exo-colors-text text-lighten-3': acc.isSelected }, { pinRotationOff: acc.isPreselected || acc.isSelected })} onClick={this.props.handleSelectAccommodation.bind(null, acc, idx, 'isPreselected')} />
          </div>
        </div>

      </div>
    ));
  }

  render() {
    const { accommodations, isSelected } = this.props;
    const cx = classNames.bind(styles);

    return (
      <div>
        <h4 className='exo-colors-text text-data-1 ml-10'><i className='mdi-maps-hotel' /> Select Room Categories</h4>
        <div className='row mr-0 pr-0 exo-colors-text text-data-1' style={{ fontSize: '11px', color: '#999999' }}>
          <div className='col s7 p-0'>
            <span className='light'>Placement</span>
          </div>
          <div className='col s3 p-0' style={{ marginLeft: '-18px' }}>
            <span className='light'>Price per room / night</span>
          </div>
          <div className='col s2 p-0'>
            <span className='light right'>Alternative</span>
          </div>
        </div>

        <div className={cx('row', 'mr-0', 'pr-0', 'roomCategoryWrapper')} >
          {this.renderAccommodations(accommodations, isSelected)}
        </div>
      </div>
    );
  }
}
