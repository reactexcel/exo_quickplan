import React from 'react';
import cx from 'classnames';
import { FaCalendarCheckO, FaCalendarTimesO, FaDollar } from 'react-icons/lib/fa';
import ReactTooltip from 'react-tooltip';
import Dotdotdot from 'react-dotdotdot';
import PubSub from 'pubsub-js';
import { Dropdown } from '../../Utils/components';
import ServiceBookingPaxStatus from '../../InfoBox/renderers/ServiceBookingPaxStatusRenderer';
import styles from '../tourmodal.module.scss';
import { getUserRole } from '../../../services/user';
import SERVICES from '../../../services';

export default class TourPlacement extends React.Component {
  static propTypes = {
    service: React.PropTypes.object.isRequired,
    style: React.PropTypes.object.isRequired,
    changeRemoveModalState: React.PropTypes.func.isRequired,
    changeModalState: React.PropTypes.func.isRequired,
    cityDayKey: React.PropTypes.string.isRequired,
    cityBookingKey: React.PropTypes.string.isRequired,
    tripKey: React.PropTypes.string,
    days: React.PropTypes.array,
    activeServiceBookingKey: React.PropTypes.string,
    isTaView: React.PropTypes.bool,
    preselections: React.PropTypes.array
  };
  state = {
    userRole: getUserRole(),
    count: '',
    amount: '',
    currency: 'USD',
    highlights: ''
  };
  componentWillReceiveProps(props) {
    const TAcountry = SERVICES.selectedTAOffice && SERVICES.selectedTAOffice.workInCountries && SERVICES.selectedTAOffice.workInCountries.filter(off => off.countryCode === (props.countryBooking && props.countryBooking.location && props.countryBooking.location.tpCode));
    if (TAcountry && TAcountry.length > 0) {
      this.setState({ currency: TAcountry[0].currency });
    } this.setState({ count: props.count });
    if (props.count === 1) {
      this.setState({ tourTitle: styles.tourTitle1, amount: styles.amount1, preselectionIcon: styles.preselectionIcon1, statusIcon: styles.statusIcon1, dropdown: styles.dropdown2 });
    } else if (props.count === 2) {
      this.setState({ tourTitle: styles.tourTitle2, amount: styles.amount2, preselectionIcon: styles.preselectionIcon2, dropdown: styles.dropdown2, statusIcon: styles.statusIcon2 });
    } else if (props.count === 3) {
      this.setState({ tourTitle: styles.tourTitle3, amount: styles.amount3, preselectionIcon: styles.preselectionIcon3, dropdown: styles.dropdown3, statusIcon: styles.statusIcon3 });
    } else if (props.count >= 4) {
      this.setState({ tourTitle: styles.tourTitle4, amount: styles.amount4, preselectionIcon: styles.preselectionIcon4, dropdown: styles.dropdown4, statusIcon: styles.statusIcon4 });
    }
    let s_title = '';
    if (props.service && props.service.tour && props.service.tour.title) {
      s_title = props.service.tour.title;
    }
    let highlights = `${s_title}<ol style="list-style-type : disc ; padding : 0">`;

    if (this.props.service.tour && this.props.service.tour.highlights && (this.props.service.tour.highlights.length > 0)) {
      this.props.service.tour.highlights.map((cc) => { // eslint-disable-line array-callback-return
        const addText = highlights.concat(`<li>${cc}</li>`);
        highlights = addText;
      });
    }
    this.setState({ highlights });
  }
  publishInfobox = () => {
    const { service, cityDayKey, cityBookingKey } = this.props;

    PubSub.publish('Infobox', {
      serviceBookingKey: service._key,
      cityDayKey,
      cityBookingKey,
      type: 'tour',
      currency: this.state.currency,
      tpBookingRef: this.props.countryBooking.tpBookingRef
    });
  };

  // statusIcon = () => { // eslint-disable-line consistent-return
  //   const { service } = this.props;
  //   if (service.status && service.status.state === 'Booked') {
  //     return <i className={cx('mdi mdi-cash-usd', styles.bookedColor)} />;
  //   }
  // };

  statusIcon() { // eslint-disable-line consistent-return
    const { service } = this.props;
    let checkStatus = '';
    if (service.status && service.status.tpAvailabilityStatus) {
      checkStatus = service.status.tpAvailabilityStatus;
    }
    if (service.status && service.status.state && service.status.state !== '') {
      checkStatus = service.status.state;
    }
    if (checkStatus !== '') {
      switch (checkStatus) {
        case 'Available':
          return (<span className='exo-colors-text text-darken-2 availabilityInfo'>
            <FaCalendarCheckO size={11} style={{ verticalAlign: 'up' }} />
          </span>);
        case 'Unavailable':
          return (<span className='exo-colors-text text-accent-4 text-error-front availabilityInfo'>
            <FaCalendarTimesO size={11} style={{ verticalAlign: 'up', color: '#d51224' }} />
          </span>);
        case 'Booked':
          return (<span className='bookedColor availabilityInfo'>
            <FaDollar size={11} style={{ verticalAlign: 'up' }} />
          </span>);
        case 'On Request':
          return (<div className='exo-colors-text text-accent-4 availabilityInfo'>
            <i className='mdi mdi-calendar-blank' />
          </div>);
        default:
          return false;
            // <i className='mdi mdi-calendar-check' style={{ color: '#42937a', position: 'absolute', top, left: '26px' }} />
      }
    }
  }

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
    let status;
    if (SERVICES.isSideNavOpen) {
      status = 'none';
    }
    // let imgY;
    // if (this.state.count === 1) {
    //   imgY = '540px';
    // }
    const { service, style, activeServiceBookingKey, changeModalState, changeRemoveModalState } = this.props;
    const isActive = activeServiceBookingKey === service._key;
    const triggerDropdown = <a><i style={{ color: 'white' }} className='mdi-navigation-more-vert small' /></a>;
    let imageUrl;

    // hide the inactive tour booking service in placement.
    if (service.inactive === true) {
      return null;
    }

    // Take the first image
    if (service.tour && service.tour.images) imageUrl = service.tour.images[0].url;

    let s_title = '';
    if (service && service.tour && service.tour.title) {
      s_title = service.tour.title;
    }

    const highlights = `${this.state.highlights}</ol>`;

    const title = $('<textarea/>').html(s_title).text();
    const servicePriceAmount = this.props.service.price && this.props.service.price.amount ? this.props.service.price.amount : '';
    const product_pre_selection_count = !this.props.preselections ? 0 : this.props.preselections.filter(preselection => preselection.startSlot === service.startSlot).length;

    let dropdownButtonStyle = {};
    if (service && service.status && service.status.state && service.status.state === 'Booked') {
      // disabled the remove and change button when in 'Booked' status state
      dropdownButtonStyle = { pointerEvents: 'none', cursor: 'default', color: '#CCCCCC' };
    }
    return (
      <div className='valign-wrapper' style={style} onClick={this.publishInfobox}>
        <div data-tip={highlights} data-html='true' className={cx('cursor exo-colors darken-2', { 'z-depth-3': isActive })} style={{ height: '100%', borderRadius: '3px', width: '100%', position: 'relative', backgroundImage: `url(${imageUrl})`, backgroundSize: 'cover' }}>
          <div>
            { product_pre_selection_count > 0 ? <div className={this.state.preselectionIcon} onClick={this.props.preSelectionActionTour}>{product_pre_selection_count}<i className='mdi mdi-layers' style={{ marginLeft: '2px', fontSize: '1rem' }} /></div> : null}
            <div className='row m-0' style={{ height: '40px', width: '100%', position: 'absolute', bottom: '0px', backgroundColor: '#007674', borderRadius: '0 0 3px 3px' }}>
              <div className='col s6 p-0'>
                <Dotdotdot clamp={2}>
                  <p className={this.state.tourTitle}>
                    {title}
                  </p>
                </Dotdotdot>
              </div>
              <div className={cx('col p-0 pt-10', { s3: servicePriceAmount }, { s1: !servicePriceAmount })} >
                <span className={this.state.amount} style={{ display: status }}> {this.props.service.price && this.props.service.price.amount ? SERVICES.currency[this.state.currency] + this._priceFormat(this.props.service.price.amount) : '' } </span>
              </div>
              <div className={cx('col p-0', { s1: servicePriceAmount }, { s2: !servicePriceAmount })}>
                <p className={this.state.statusIcon}>{this.statusIcon()}</p>
              </div>
              <div className={cx('col p-0', { s1: servicePriceAmount }, { s2: !servicePriceAmount })}>
                {
                  this.props.isInPlacement && this.props.serviceBookingKey ?
                    <ServiceBookingPaxStatus TourPlacement serviceBookingKey={this.props.serviceBookingKey} cityDayKey={this.props.cityDayKey} tripKey={this.props.tripKey} />
                  : null
                }
              </div>
              <div className='col s1 p-0 align-right'>
                <div className={this.state.dropdown}>
                  <Dropdown className='dropdown' triggerButton={triggerDropdown}>
                    <li><a style={dropdownButtonStyle} onClick={changeModalState.bind(null, true, service)}>Change tour</a></li>
                    { this.state.userRole === 'TC' ? <li><a style={dropdownButtonStyle} onClick={changeRemoveModalState.bind(null, true, service)}>Remove tour</a></li> : null }
                  </Dropdown>
                </div>
              </div>
            </div>
          </div>
        </div>
        <ReactTooltip />
      </div>
    );
  }
}
