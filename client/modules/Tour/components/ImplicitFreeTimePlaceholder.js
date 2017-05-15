import React, { Component, PropTypes } from 'react';
import cx from 'classnames';
import Dotdotdot from 'react-dotdotdot';
import ReactTooltip from 'react-tooltip';
import PubSub from 'pubsub-js';
import { MdHelpOutline, MdTimelapse, MdConfirmationNumber } from 'react-icons/lib/md';
import { Dropdown } from '../../Utils/components';
import styles from '../tourmodal.module.scss';

// A implicit free time placeholder with default preselections number for TA user.
export default class ImplicitFreeTimePlaceholder extends Component {
  static propTypes = {
    style: PropTypes.object.isRequired,
    activeServiceBookingKey: PropTypes.string,
    changeModalState: React.PropTypes.func.isRequired,
    service: PropTypes.object.isRequired,
    cityDayKey: React.PropTypes.string,
    cityBookingId: React.PropTypes.string,
    cityBookingKey: React.PropTypes.string,
    defaultTours: PropTypes.array
  }

  handleOnClick = () => {
    const { defaultTours, changeModalState, service } = this.props;
    // if there is no default preslections, nothing to show
    if (!defaultTours || defaultTours.length === 0) {
      return;
    }
    // open the picker with exist default preselections.
    changeModalState(true, service);
  }

  render() {
    const { style, service, activeServiceBookingKey, defaultTours } = this.props;
    const placeholderIcon = <MdTimelapse size={30} className='exo-colors-text text-lighten-5 p-5' />;
    const renderToolTip = () => ({ 'data-tip': this.props.service.placeholder.title });
    const isActive = activeServiceBookingKey === service._key;
    return (
      <div className='valign-wrapper' style={style} onClick={() => this.handleOnClick()}>
        <div {...renderToolTip()} id={`${service._key}_${service.startSlot}`} className={cx('cursor', { 'z-depth-3': isActive })} style={{ height: '100%', width: '100%', position: 'relative', backgroundColor: '#007674', backgroundSize: 'cover', border: '1px solid #CCC' }}>
          { defaultTours && defaultTours.length ? <div className={styles.preselectionIcon1} onClick={() => this.handleOnClick()}>{defaultTours.length}<i className='mdi mdi-layers' style={{ marginLeft: '2px', fontSize: '1rem' }} /></div> : null }
          <div style={{ textAlign: 'left', marginTop: 0 }}>
            {placeholderIcon}
            <div className='exo-colors-text text-lighten-5 p-5 fw-600'><span className='lh-5'>{service.placeholder.title}</span></div>
          </div>
        </div>
      </div>
    );
  }
}
