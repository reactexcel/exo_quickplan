import React, { Component, PropTypes } from 'react';
import _ from 'lodash';
import Relay from 'react-relay';
import classNames from 'classnames/bind';
import Dotdotdot from 'react-dotdotdot';
import TogglePreselectedTour from '../mutations/TogglePreselectedTour';
import styles from '../tourmodal.module.scss';

const cx = classNames.bind(styles);

export default class TourSelection extends Component {
  static propTypes = {
    service: PropTypes.object.isRequired,
    cityDayKey: PropTypes.string.isRequired,
    style: PropTypes.object.isRequired,
    activeDetail: PropTypes.object,
    handleClickTour: PropTypes.func.isRequired,
    handleOpenOverlay: PropTypes.func.isRequired,
    isSelected: PropTypes.bool,
    unavailableSlots: PropTypes.array
  };
  onClickButton = () => {
    if (this.props.service.status && this.props.service.status.state && this.props.service.status.state === 'Booked') {
      return null;
    }
    const { service } = this.props;
    if (service && !this.isServiceSlotsAvailable(service)) {
      return null;
    }

    return { onClick: this.props.handleClickTour.bind(null, this.props.service) };
  };

  handleTogglePreselectedTour = (e) => {
    e.stopPropagation();

    const { cityDayKey } = this.props;
    const { tour: { id, _key, isPreselected }, startSlot } = this.props.service;

    Relay.Store.commitUpdate(new TogglePreselectedTour({
      isPreselected,
      startSlot,
      cityDayKey,
      tourId: id,
      tourKey: _key
    }));
  };

  // check if all the slots of the services is available
  isServiceSlotsAvailable(service) {
    const unavailableSlots = this.props.unavailableSlots || [];
    const { startSlot, durationSlots } = service;
    const slotsOfService = [];
    for (let i = 0; i < durationSlots; i++) {
      const slot = startSlot + i;
      if (slot === 1) slotsOfService.push('am');
      else if (slot === 2) slotsOfService.push('pm');
      else if (slot === 3) slotsOfService.push('eve');
    }
    return _.intersection(slotsOfService, unavailableSlots).length === 0;
  }

  render() {
    const { activeDetail, service, isSelected, style, handleOpenOverlay } = this.props;
    const isActive = activeDetail && activeDetail._key === service._key;
    let imageUrl;
    let serviceTitle = service.title;

    // Take the first image
    if (service && service.images) imageUrl = service.images[0].url;
    if (isSelected) {
      if (service.tour && service.tour.images) {
        imageUrl = service.tour.images[0].url;
      }
      if (service.tour && service.tour.title) {
        serviceTitle = service.tour.title;
      }
    }
    // start below is needed as after adding tour placement images and title are not showing
    if (typeof imageUrl === 'undefined' && service.tour.images) {
      imageUrl = service.tour.images[0].url;
    }
    if (typeof serviceTitle === 'undefined' && service.tour.title) {
      serviceTitle = service.tour.title;
    }
    serviceTitle = $('<textarea/>').html(serviceTitle).text();

    const statusIcon = () => {
      if (service.status && service.status.state) {
        switch (service.status.state) {
          case 'Booked':
            return (
              <div className='col s1 p-0'>
                <p style={{ padding: '0px' }}><i className={cx('mdi mdi-cash-usd', styles.bookedColor)} /></p>
              </div>
            );
          default:
            return null;
        }
      }
      return null;
    };
    const wrapperHeight = _.parseInt(style.height) || 240;
    const titleHeight = wrapperHeight - 195;
    const titleClassName = isSelected ? 'exo-colors darken-3' : 'exo-colors modal-bgr1';
    return (
      <div style={style} {...this.onClickButton()}>
        <div id={`${service._key}_${service.startSlot}`} className={cx('cursor exo-colors darken-2', { 'z-depth-3': isActive })} style={{ height: '195px', width: '100%', position: 'relative', backgroundImage: `url(${imageUrl})`, backgroundSize: 'cover', verticalAlign: 'top !important' }}>
          {
            !isSelected ?
              <div className={cx('p-5 exo-colors-text ', { 'text-accent-3': service.tour.isPreselected })} onClick={this.handleTogglePreselectedTour} style={{ position: 'absolute', top: 5, right: 5, borderRadius: '5px', backgroundColor: 'rgba(255, 255, 255, 0.8)' }}><i className={cx('mdi mdi-pin mdi-28px', { pinRotationOn: !service.tour.isPreselected }, { pinRotationOff: service.tour.isPreselected })} /></div>
              : null
          }
        </div>
        <div className={titleClassName} style={{ height: titleHeight, width: '220px', position: 'absolute', bottom: '5px', padding: '5px', backgroundColor: '' }}>
          <div className='row m-0'>
            {statusIcon()}
            <div className='col s9 p-0 pl-10' >
              <Dotdotdot clamp={2}>
                <span className='lh-5'>
                  {serviceTitle}
                </span>
              </Dotdotdot>
            </div>
            {
              this.props.selectedTour ?
                <div className={cx('col p-0 pr-5 align-right', { s2: statusIcon() }, { s3: !statusIcon() })}><i className='mdi-action-info-outline fs-20 lh-0' onClick={handleOpenOverlay.bind(null, true, true, service)} /></div>
              : <div className={cx('col p-0 pr-5 align-right', { s2: statusIcon() }, { s3: !statusIcon() })}><i className='mdi-action-info-outline fs-20 lh-0' onClick={handleOpenOverlay.bind(null, true, false, service)} /></div>
            }
          </div>
        </div>
      </div>
    );
  }
}
