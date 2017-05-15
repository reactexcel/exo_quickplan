import React, { Component, PropTypes } from 'react';
import classNames from 'classnames/bind';
import Dotdotdot from 'react-dotdotdot';
import styles from '../style.module.scss';

const cx = classNames.bind(styles);

export default class AccommodationSelection extends Component {
  static propTypes = {
    supplier: PropTypes.object.isRequired,
    handleOpenOverlay: PropTypes.func.isRequired,
    className: PropTypes.string.isRequired,
    style: PropTypes.object
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

  render() {
    const { supplier, handleOpenOverlay, className, style } = this.props;

    let imageUrl;

    if (supplier.images) imageUrl = supplier.images[0].url;

    const isPreselected = supplier.accommodations.some(acc => acc.isPreselected);
    const title = $('<textarea/>').html(supplier.title).text();

    return (
      <div className={className} onClick={handleOpenOverlay.bind(null, true, supplier)} style={style}>
        <div className='cursor exo-colors darken-2' style={{ height: '195px', width: '100%', position: 'relative', backgroundImage: `url(${imageUrl})`, backgroundSize: 'cover' }}>
          <div className={cx('p-5 exo-colors-text ', { 'text-accent-3': isPreselected })} style={{ position: 'absolute', top: 5, right: 5, borderRadius: '5px', backgroundColor: 'rgba(255, 255, 255, 0.8)' }}><i className={cx('mdi mdi-pin mdi-28px', { pinRotationOn: !isPreselected }, { pinRotationOff: isPreselected })} /></div>
        </div>
        <div className='exo-colors modal-bgr1' style={{ height: '60px', width: '165px', bottom: '5px' }}>
          <div className='row m-0'>
            <div className='col s10 p-0 pl-10 pt-5 fs-11' >
              <Dotdotdot clamp={2}>
                <span style={{ fontWeight: 'bold' }}>
                  {title}
                </span>
              </Dotdotdot>
              <div>
                { supplier.cheapestRoomRate ? <div>From <b>{this._priceFormat(supplier.cheapestRoomRate)} {supplier.currency}</b></div> : 'Price on request' }
                {/* <h6 className='light' style={{ display: 'inline-block' }}>from {supplier.cheapestRoomRate} {supplier.currency}</h6>*/}
              </div>
            </div>
            <div className='col s2 p-0 pl-2 pt-5 fs-13' >
              { supplier.hasPromotions ? <span className='left'><i className='mdi-maps-local-offer' /></span> : null }
            </div>
          </div>
        </div>
      </div>
    );
  }
}
