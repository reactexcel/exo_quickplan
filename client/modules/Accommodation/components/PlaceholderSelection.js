import React, { Component, PropTypes } from 'react';
import Relay from 'react-relay';
import Dotdotdot from 'react-dotdotdot';
import { MdHotel } from 'react-icons/lib/md';
import _ from 'lodash';
import cx from 'classnames';
import moment from 'moment';
import PubSub from 'pubsub-js';
import { Dropdown, Modal } from '../../Utils/components';
import UpdateAccommodationPlacementMutation from '../mutations/Update';
import AccommodationModal from '../renderers/AccommodationModalRenderer';
import styles from '../style.module.scss';

export default class PlaceholderSelection extends Component {
  static propTypes = {
    style: PropTypes.object.isRequired,
    activeDetail: PropTypes.object,
    handleClickPlaceholder: PropTypes.func,
    service: PropTypes.object.isRequired,
    isInPlacement: PropTypes.bool,
    cityBookingId: PropTypes.string,
    cityBookingKey: PropTypes.string,
    activeServiceBookingKey: React.PropTypes.string
  };

  state = {
    isAccommodationModalOpened: false,
    isRemoveModalOpened: false
  };

  componentWillMount() {
    if (this.props.service.serviceBookings) {
      this.token = PubSub.subscribe(`AccommodationPlaceholder_${this.props.service.serviceBookings[0]._key}`, (msg, data) => {
        if (data.type === 'change') {
          this.changeAccommodationModalState(data.isOpen);
        } else {
          this.changeRemoveModalState(data.isOpen);
        }
      });
    }
  }

  componentWillUnmount() {
    PubSub.unsubscribe(this.token);
  }

  changeRemoveModalState = (isOpen) => {
    this.setState({ isRemoveModalOpened: isOpen });
  };

  publishInfobox = () => PubSub.publish('Infobox', {
    accommodationPlacementKey: this.props.service._key,
    // this is not really a service booking key but a accommodation placement key
    serviceBookingKey: this.props.service.serviceBookings[0]._key,
    cityBookingKey: this.props.cityBookingKey,
    type: 'placeholder'
  });

  handleOpenOverlay = () => {
    if (!this.props.isInPlacement) {
      return {
        onClick: this.props.handleClickPlaceholder.bind(null, true)
      };
    }

    const modifiedService = { ...this.props.service.serviceBookings[0] };
    modifiedService.changeModalState = this.changeAccommodationModalState;
    modifiedService.changeRemoveModalState = this.changeRemoveModalState.bind(this, true);

    return { onClick: this.publishInfobox };
  };

  changeAccommodationModalState = (isOpen) => {
    PubSub.publish('Infobox', { type: 'clear' });
    this.setState({ isAccommodationModalOpened: isOpen });

    // Setup a service object to be suitable with
    // AccommodationPlacement in the Accommodation Picker
    this.accommodationPlacement = _.cloneDeep(this.props.service.serviceBookings[0]);
    this.accommodationPlacement.cityBookingId = this.props.cityBookingId;
  };

  removeAccommodationPlacement = ({ service: { _key: accommodationPlacementKey }, cityBookingKey, cityBookingId }) => {
    const onSuccess = () => {
      PubSub.publish('Infobox', { type: 'clear' });
    };

    Relay.Store.commitUpdate(new UpdateAccommodationPlacementMutation({
      action: 'Delete',
      accommodationPlacementKey,
      cityBookingKey,
      cityBookingId
    }), { undefined, onSuccess });
  };

  render() {
    const { style, service, isInPlacement, activeServiceBookingKey, cityBookingId, cityBookingKey } = this.props;
    const triggerDropdown = <a><i className='mdi-navigation-more-vert small' style={{ color: 'white' }} /></a>;
    const removeButton = <a className='modal-action modal-close waves-effect waves-green btn' onClick={this.removeAccommodationPlacement.bind(null, this.props)}><i className='mdi-action-delete left' />Remove</a>;
    const nightStyle = {
      width: '45%',
      left: '66px'
    };
    let serviceBooking = service;
    if (service.serviceBookings) {
      serviceBooking = service.serviceBookings[0];
    }

    const isActive = activeServiceBookingKey === service._key;
    const product_pre_selection_count = service.preselectionNum;
    return (
      <div className={cx('valign-wrapper', { 'pl-20': !isInPlacement })} {...this.handleOpenOverlay()} style={style}>
        <div style={{ height: '100%', width: '100%', position: 'relative' }} className={cx({ 'z-depth-3': isActive })} >
          <div className={cx('cursor exo-colors darken-2', { cursor: !isInPlacement })} style={{ height: '257px', width: '100%', position: 'relative', borderRadius: '3px' }}>
            {
              isInPlacement && product_pre_selection_count > 0 ?
              (
                <div>
                  <p onClick={this.changeAccommodationModalState.bind(this, true)} className={styles.preselectionIcon}>{product_pre_selection_count}<i style={{ marginLeft: '2px', fontSize: '1rem' }} className='mdi mdi-layers' /></p>
                  <i className={styles.nights} style={nightStyle}>{service.durationNights} {(service.durationNights === 1) ? <i>night</i> : <i>nights</i> }</i>
                </div>
              ) : null
            }
            <div style={{ textAlign: 'center', position: 'relative', top: 50 }}>
              <MdHotel size={80} style={{ color: 'white' }} />
            </div>
            <div className='exo-colors' style={{ height: '50px', width: '100%', position: 'absolute', bottom: '0px' }}>
              <div className='row m-0'>
                <div className='col s9 p-0 pl-10 pt-10'>
                  <Dotdotdot clamp={2}>
                    <span className='lh-5' style={{ fontSize: '11px', fontWeight: 'bold', color: 'white' }}>
                      {serviceBooking.placeholder.title}
                    </span>
                  </Dotdotdot>
                </div>
                {
                  isInPlacement ?
                  (
                    <div className='col s3 exo-colors-text text-accent-1 p-0 pr-5 align-right'>
                      <Dropdown className='dropdown' triggerButton={triggerDropdown}>
                        <li><a onClick={this.changeAccommodationModalState.bind(this, true)}>Change placeholder</a></li>
                        <li><a onClick={this.changeRemoveModalState.bind(this, true)}>Remove placeholder</a></li>
                      </Dropdown>
                    </div>
                  ) : null
                }
              </div>
            </div>
          </div>
          <div className='exo-colors' style={{ height: style.height - '280', width: '100%', position: 'inherit', padding: '5px 10px', overflow: 'auto', fontSize: '11px', fontWeight: 'bold', color: 'white', borderBottomLeftRadius: '3px', borderBottomRightRadius: '3px' }}>
            {serviceBooking.notes || serviceBooking.placeholder.notes}
          </div>
        </div>
        {
          this.state.isAccommodationModalOpened ?
            <AccommodationModal countryName='thailand' cityCode='bkk' date={moment().format('YYYY-MM-D')} duration={1} accommodationPlacementKey={this.accommodationPlacement._key} selectedSupplier={this.accommodationPlacement} cityBookingId={cityBookingId} cityBookingKey={cityBookingKey} isModalOpened={this.state.isAccommodationModalOpened} changeModalState={this.changeAccommodationModalState} /> : null
        }

        {
          this.state.isRemoveModalOpened ?
            <Modal actionButton={removeButton} isModalOpened={this.state.isRemoveModalOpened} changeModalState={this.changeRemoveModalState}>
              <h3>Remove placeholder</h3>
              <span>This will remove placeholder. The removal cannot be undone. Do you want to remove it?</span>
            </Modal>
            : null
        }
      </div>
    );
  }
}
