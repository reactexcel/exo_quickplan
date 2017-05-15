import React, { Component, PropTypes } from 'react';
import cx from 'classnames';
import Dotdotdot from 'react-dotdotdot';
import ReactTooltip from 'react-tooltip';
import PubSub from 'pubsub-js';
import { MdHelpOutline, MdTimelapse, MdConfirmationNumber } from 'react-icons/lib/md';
import { Dropdown } from '../../Utils/components';
import styles from '../tourmodal.module.scss';

export default class Placeholder extends Component {
  static propTypes = {
    style: PropTypes.object.isRequired,
    activeServiceBookingKey: PropTypes.string,
    handleClickPlaceholder: PropTypes.func,
    service: PropTypes.object.isRequired,
    isInPlacement: PropTypes.bool,
    changeRemoveModalState: React.PropTypes.func,
    changeModalState: React.PropTypes.func,
    cityDayKey: React.PropTypes.string,
    cityBookingId: React.PropTypes.string,
    cityBookingKey: React.PropTypes.string
  };

  publishInfobox = () => PubSub.publish('Infobox', {
    serviceBookingKey: this.props.service._key,
    cityDayKey: this.props.cityDayKey,
    cityBookingKey: this.props.cityBookingKey,
    type: 'placeholder'
  });

  handleOnClick = () => {
    const { service, changeRemoveModalState, changeModalState, cityDayKey, cityBookingId } = this.props;
    const modifiedService = { ...service };
    modifiedService.changeRemoveModalState = changeRemoveModalState;
    modifiedService.changeModalState = changeModalState;
    modifiedService.cityDayKey = cityDayKey;
    modifiedService.cityBookingId = cityBookingId;

    if (this.props.isInPlacement) {
      return { onClick: this.publishInfobox };
    }

    if (this.props.service.status && this.props.service.status.state && this.props.service.status.state === 'Booked') {
      return null;
    }

    return { onClick: this.props.handleClickPlaceholder.bind(null, true, this.props.service) };
  };

  renderPlaceholderDropdown = () => {
    const { service, changeRemoveModalState, changeModalState } = this.props;
    const triggerDropdown = <a><i className='mdi-navigation-more-vert small' style={{ color: 'white' }} /></a>;

    return (
      <Dropdown className='dropdown' triggerButton={triggerDropdown}>
        <li><a onClick={changeModalState.bind(null, true)}>Change placeholder</a></li>
        <li><a onClick={changeRemoveModalState.bind(null, true, service)}>Remove placeholder</a></li>
      </Dropdown>
    );
  };

  renderConsiderThis = () => {
    const { style, service, activeServiceBookingKey, isInPlacement } = this.props;
    const isActive = activeServiceBookingKey === service._key;

    return (<div className='valign-wrapper' style={style} {...this.handleOnClick()}>
      <div data-tip={service.placeholder.title} id={`${service._key}_${service.startSlot}`} className={cx('cursor row m-0', { 'z-depth-3': isActive })} style={{ width: '100%', position: 'relative' }}>
        <div style={{ marginTop: '10px' }}>
          <div className={cx('col p-0 pl-10', { s9: !isInPlacement }, { s7: isInPlacement })} style={{ textAlign: 'center', fontSize: '1.1em', marginTop: '5px', color: '#6f6f6f' }} >
            Consider This...
          </div>
          {
            isInPlacement ?
            (
              <div className='col s3 p-0 pr-5 align-right'>
                {this.renderPlaceholderDropdown()}
              </div>
            ) : null
          }
        </div>
      </div>
    </div>);
  };

  render() {
    const { style, service, activeServiceBookingKey, isInPlacement } = this.props;
    const isActive = activeServiceBookingKey === service._key;
    let placeholder = styles.placeholder;
    let placeholderBottom = styles.placeholderBottom;
    if (isInPlacement) {
      placeholder = styles.placementPlaceholder;
      placeholderBottom = styles.placementPlaceholderBottom;
    }
    const placeholderIcon = () => {
      if (service.placeholder.type === 'freeTime') {
        return <MdTimelapse size={(isInPlacement && service.durationSlots === 1) ? 22 : 80} style={isInPlacement ? { color: 'white' } : { color: '#d7d7d7' }} />;
      } else if (service.placeholder.type === 'customTour') {
        return <MdConfirmationNumber size={(isInPlacement && service.durationSlots === 1) ? 22 : 80} style={isInPlacement ? { color: 'white' } : { color: '#d7d7d7' }} />;
      }
      return <MdHelpOutline size={(isInPlacement && service.durationSlots === 1) ? 22 : 80} style={isInPlacement ? { color: 'white' } : { color: '#d7d7d7' }} />;
    };

    if (service.placeholder.type === 'considerThis') {
      return this.renderConsiderThis();
    }

    const statusIcon = () => {
      if (service.status && service.status.state) {
        switch (service.status.state) {
          case 'Booked':
            return <i className={cx('mdi mdi-cash-usd', styles.bookedColor)} />;
          default:
            return null;
        }
      }
      return null;
    };

    const renderToolTip = () => {
      if (!this.props.isInPlacement) {
        return null;
      }
      return { 'data-tip': this.props.service.placeholder.title };
    };
    const product_pre_selection_count = !this.props.preselections ? 0 : this.props.preselections.filter(preselection => preselection.startSlot === service.startSlot).length;

    return (
      <div className='valign-wrapper' style={style} {...this.handleOnClick()}>
        <div {...renderToolTip()} id={`${service._key}_${service.startSlot}`} className={cx('cursor', placeholder, { 'z-depth-3': isActive })} >
          { isInPlacement && product_pre_selection_count > 0 ? <div className={styles.preselectionIcon1} onClick={this.props.preSelectionActionTour}>{product_pre_selection_count}<i className='mdi mdi-layers' style={{ marginLeft: '2px', fontSize: '1rem' }} /></div> : null}
          {
            (isInPlacement && service.durationSlots === 1) ?
            (
              <div style={{ float: 'right', paddingRight: '5px' }}>
                {this.renderPlaceholderDropdown()}
              </div>
            ) : null
          }
          <div style={(isInPlacement && service.durationSlots === 1) ? { padding: '10px' } : { textAlign: 'center', marginTop: '50px' }}>
            {placeholderIcon()}
            {
              (isInPlacement && service.durationSlots === 1) ?
              (
                <div style={{ paddingTop: '5px', color: 'white', fontWeight: 'bold' }}>
                  {this.props.service.placeholder.title}
                </div>
              ) : null
            }
          </div>
          {
            (isInPlacement && service.durationSlots === 1) ? null :
            <div className={placeholderBottom}>
              <div className='row m-0'>
                {
                  (!isInPlacement && statusIcon()) ?
                    <div className='col s2 p-0'>
                      <p style={{ padding: '0px' }}>{statusIcon()}</p>
                    </div>
                  : null
                }
                <div className={cx('col p-0 pl-5 pt-5 fw-700', { s9: !isInPlacement }, { s7: isInPlacement })} >
                  <Dotdotdot clamp={2}>
                    <span style={isInPlacement ? { color: 'white' } : { color: 'black' }}>
                      {
                        !isInPlacement ? 'Custom' : this.props.service.placeholder.title
                      }
                    </span>
                  </Dotdotdot>
                </div>
                {
                  isInPlacement ? null :
                  <div className='col s3 p-0 pt-3 align-right'>
                    <MdHelpOutline size={20} />
                  </div>
                }
                {
                  isInPlacement ?
                  (
                    <div>
                      <div className='col s1 p-0'>
                        <p style={{ padding: '0px' }}>{statusIcon()}</p>
                      </div>
                      <div style={{ float: 'right' }}>
                        {this.renderPlaceholderDropdown()}
                      </div>
                    </div>
                  ) : null
                }
              </div>
            </div>
          }
        </div>
        <ReactTooltip />
      </div>
    );
  }
}
