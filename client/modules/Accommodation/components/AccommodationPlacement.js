import React, { Component, PropTypes } from 'react';
import Relay from 'react-relay';
import Dotdotdot from 'react-dotdotdot';
import cx from 'classnames';
import _ from 'lodash';
import moment from 'moment';
import ReactTooltip from 'react-tooltip';
import PubSub from 'pubsub-js';
import shortId from 'shortid';
import { Dropdown, Modal } from '../../Utils/components';
import styles from '../style.module.scss';
import UpdateAccommodationPlacementMutation from '../mutations/Update';
import AccommodationModal from '../renderers/AccommodationModalRenderer';
import TAAccommodationModal from '../renderers/TAAccommodationModalRenderer';
import { getUserRole } from '../../../services/user';
import SERVICES from '../../../services';

export default class AccommodationPlacement extends Component {
  static propTypes = {
    service: PropTypes.object.isRequired,
    style: PropTypes.object.isRequired,
    activeDetail: PropTypes.object,
    isInPlacement: PropTypes.bool,
    handleOpenOverlay: PropTypes.func,
    cityBookingKey: PropTypes.string,
    cityBookingId: PropTypes.string,
    changeRemoveModalState: PropTypes.func,
    cityDayKey: React.PropTypes.string,
    activeServiceBookingKey: React.PropTypes.string,
    isTaView: React.PropTypes.bool,
    imageHeight: React.PropTypes.string
  };

  state = {
    isAccommodationModalOpened: false,
    isInPlacement: false,
    isRemoveModalOpened: false,
    accommodationModalKey: shortId.generate(),
    userRole: getUserRole(),
    currency: 'USD'
  };

  componentWillMount() {
    this.token = PubSub.subscribe(`AccommodationPlacement_${this.props.service._key}`, (msg, data) => {
      if (data.type === 'change') {
        this.changeAccommodationModalState(data.isOpen);
      } else {
        this.changeRemoveModalState(data.isOpen);
      }
    });
    if (this.props.isInPlacement) {
      const TAcountry = SERVICES.selectedTAOffice && SERVICES.selectedTAOffice.workInCountries && SERVICES.selectedTAOffice.workInCountries.filter(off => off.countryCode === (this.props.country && this.props.country.location && this.props.country.location.tpCode));
      if (typeof TAcountry !== 'undefined' && TAcountry.length > 0) {
        this.setState({ currency: TAcountry[0].currency });
      }
    }
  }

  componentWillUnmount() {
    PubSub.unsubscribe(this.token);
  }

  publishInfobox = () => PubSub.publish('Infobox', {
    accommodationPlacementKey: this.props.service._key,
    // this is not really a service booking key but a accommodation placement key
    serviceBookingKey: this.props.service._key,
    cityBookingKey: this.props.cityBookingKey,
    type: 'accommodation',
    tpBookingRef: this.props.country.tpBookingRef,
    currency: this.state.currency
  });

  handleOpenOverlay = () => {
    const modifiedService = { ...this.props.service };
    modifiedService.changeModalState = this.changeAccommodationModalState;
    modifiedService.changeRemoveModalState = this.changeRemoveModalState.bind(this, true);
    modifiedService.cityBookingKey = this.props.cityBookingKey;
    modifiedService.cityDayKey = this.props.cityDayKey;

    if (!this.props.isInPlacement) {
      return {
        onClick: this.props.handleOpenOverlay.bind(null, true, modifiedService)
      };
    }
    return {
      onClick: this.publishInfobox
    };
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

  changeAccommodationModalState = (isOpen) => {
    // Setup a service object to be suitable with
    // AccommodationPlacement in the Accommodation Picker
    this.accommodationPlacement = _.cloneDeep(this.props.service);
    delete this.accommodationPlacement.serviceBookings;
    if (this.state.userRole === 'TA') {
      this.accommodationPlacement.accommodations = this.props.service.serviceBookings.map((sb) => {
        sb.accommodation.isSelected = true; // eslint-disable-line no-param-reassign
        sb.accommodation.isPreselected = true; // eslint-disable-line no-param-reassign
        sb.accommodation.rate = sb.rate; // eslint-disable-line no-param-reassign
        sb.accommodation.inactive = sb.inactive; // eslint-disable-line no-param-reassign
        return sb.accommodation;
      });
    } else {
      this.accommodationPlacement.accommodations = this.props.service.serviceBookings.filter(sb => sb.inactive !== true).map((sb) => {
        sb.accommodation.isSelected = true; // eslint-disable-line no-param-reassign
        sb.accommodation.isPreselected = true; // eslint-disable-line no-param-reassign
        sb.accommodation.rate = sb.rate; // eslint-disable-line no-param-reassign
        return sb.accommodation;
      });
    }

    this.setState({ isAccommodationModalOpened: isOpen, accommodationModalKey: shortId.generate() });
  };

  changeRemoveModalState = (isOpen) => {
    this.setState({ isRemoveModalOpened: isOpen });
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

  renderDropdown = (isInPlacement) => { // eslint-disable-line consistent-return
    const triggerDropdown = <a><i className='mdi-navigation-more-vert small' style={{ color: 'white' }} /></a>;

    let dropdownButtonStyle = {};
    if (this.props.service && this.props.service.serviceBookings && this.props.service.serviceBookings[0] && this.props.service.serviceBookings[0].status) {
      // disabled the remove and change button when in 'Booked' status state
      if (this.props.service.serviceBookings[0].status.state === 'Booked') {
        dropdownButtonStyle = { pointerEvents: 'none', cursor: 'default', color: '#CCCCCC' };
      }
    }
    if (isInPlacement) {
      let dropCount2;
      if (this.props.count === 2 && SERVICES.isSideNavOpen) {
        dropCount2 = {
          position: 'absolute',
          left: '68%'
        };
      }
      return (
        <div className='col s3 p-0 align-right' style={dropCount2}>
          <Dropdown className='dropdown' triggerButton={triggerDropdown}>
            <li><a style={dropdownButtonStyle} onClick={this.changeAccommodationModalState.bind(this, true)}>Change hotel</a></li>
            { this.state.userRole === 'TA' ? null : <li><a style={dropdownButtonStyle} onClick={this.changeRemoveModalState.bind(this, true)}>Remove hotel</a></li> }
          </Dropdown>
        </div>
      );
    }
  };


  renderRepeatedInfo = () => {

  }

  render() {
    let amountLeft = '68%';
    let hotelListHeight;
    let nightStyle;
    const calH = (this.props.style.height || '330') - '180';
    const divH = `${calH}px`;
    let none;
    let hideDetail;
    let fontSize;
    let amountPos = 'absolute';
    let iconPos = 'absolute';
    let iconLeft = '31px';
    if (SERVICES.isSideNavOpen) {
      iconLeft = '35px';
    }
    if (this.props.count === 2) {
      none = 'none';
      if (SERVICES.isSideNavOpen) {
        amountLeft = '0%';
        hotelListHeight = '30px';
      } else {
        amountPos = 'inherit';
        iconPos = 'inherit';
      }
    }
    if (this.props.count === 1 && SERVICES.isSideNavOpen) {
      amountLeft = '58%';
      nightStyle = {
        width: '45%',
        left: '66px'
      };
      fontSize = '8px';
    }
    // //currency symbol
    const TAcountry = SERVICES.selectedTAOffice && SERVICES.selectedTAOffice.workInCountries && SERVICES.selectedTAOffice.workInCountries.filter(off => off.countryCode === (this.props.country && this.props.country.location && this.props.country.location.tpCode));
    // /////////////////
    const { activeServiceBookingKey, service, style, isInPlacement, cityBookingId, cityBookingKey, isTaView } = this.props;
    const removeButton = <a className='modal-action modal-close waves-effect waves-green btn' onClick={this.removeAccommodationPlacement.bind(null, this.props)}><i className='mdi-action-delete left' />Remove</a>;

    const isActive = activeServiceBookingKey === service._key;
    let imageUrl;
    const accommodations = service.serviceBookings || service.accommodations.filter(acc => acc.isSelected);

    // Take the first image
    if (service.images) imageUrl = service.images[0].url;

    const product_pre_selection_count = service.preselectionNum;

    let isAvailabilityChecked = false;
    if (this.props.service && this.props.service.serviceBookings && this.props.service.serviceBookings[0] && this.props.service.serviceBookings[0].status) {
      if (this.props.service.serviceBookings[0].status.tpAvailabilityStatus && this.props.service.serviceBookings[0].status.tpAvailabilityStatus !== '') {
        isAvailabilityChecked = true;
      }
    }

    let accommodationModal = null;
    if (this.state.isAccommodationModalOpened) {
      accommodationModal = isTaView ?
        (<TAAccommodationModal
          key={this.state.accommodationModalKey}
          countryName={this.props.country.location.name}
          cityCode={this.props.cityCode}
          date={moment(this.props.service.startDate).format('YYYY-MM-D')}
          startDay={service.startDay}
          duration={1}
          accommodationPlacementKey={this.accommodationPlacement._key}
          cityBookingId={cityBookingId}
          cityBookingKey={cityBookingKey}
          isModalOpened={this.state.isAccommodationModalOpened}
          changeModalState={this.changeAccommodationModalState}
          selectedSupplier={this.accommodationPlacement}
        />) : (<AccommodationModal
          key={this.state.accommodationModalKey}
          countryName={this.props.country.location.name}
          cityCode={this.props.cityCode}
          date={moment(this.props.service.startDate).format('YYYY-MM-D')}
          startDay={service.startDay}
          duration={1}
          durationNights={this.props.service.durationNights}
          accommodationPlacementKey={this.accommodationPlacement._key}
          cityBookingId={cityBookingId}
          cityBookingKey={cityBookingKey}
          isModalOpened={this.state.isAccommodationModalOpened}
          changeModalState={this.changeAccommodationModalState}
          selectedSupplier={this.accommodationPlacement}
        />);
    }


    // start repeating info block for hotel placement


    const toBeRepeatedInfo = (<div>
      <div style={{ height: '40px', width: '100%', position: 'inherit' }}>
        <div className={cx('col p-0 pt-5 pl-1', { s9: !isInPlacement }, { s9: isInPlacement })} >
          <Dotdotdot clamp={2}>
            <span className='lh-5' style={{ fontSize: '11px', fontWeight: 'bold', color: 'white' }}>
              {service.title}
            </span>
          </Dotdotdot>
        </div>
        {this.renderDropdown(isInPlacement)}
      </div>
      <div>
        {
          accommodations.filter(acc => acc.inactive !== true).map((obj, i) => {
            const list = accommodations.filter(acc => acc.inactive !== true);
            let hasPaxErrors = false;
            if (isInPlacement && obj.roomConfigs.length > 0) {
              obj.roomConfigs.map((roomConfigs) => { // eslint-disable-line array-callback-return
                if (roomConfigs.paxs && roomConfigs.paxs.length === 0) {
                  hasPaxErrors = true;
                }
              });
            }
            const count = 1;
            let duplicatePax = false;
            const allPax = [];
            accommodations.filter(acc => acc.inactive !== true).map((obj, i) => { // eslint-disable-line array-callback-return
              if (obj.roomConfigs && obj.roomConfigs.length > 0) {
                obj.roomConfigs.map((roomConfigs) => { // eslint-disable-line array-callback-return
                  if (roomConfigs.paxs && roomConfigs.paxs.length > 0) {
                    roomConfigs.paxs.map((pax) => { // eslint-disable-line array-callback-return
                      if (SERVICES.pax && SERVICES.pax.length > 0) {
                        SERVICES.pax.map((checkPax, p) => { // eslint-disable-line array-callback-return
                          if (checkPax._key === pax._key) {
                            allPax.push(checkPax._key);
                          }
                        });
                      }
                    });
                  }
                });
              }
            });

            const b = allPax.sort();

            _.times(b.length - 1, (l) => {
              if (b[l + 1] === b[l]) {
                duplicatePax = true;
              }
            });

            if (obj.roomConfigs && obj.roomConfigs.length === 0) {
              duplicatePax = false;
            }
            let Hlist = styles.hotelList;
            let name = styles.hotelName;
            let amount = styles.amountDiv;
            let top;
            if (isInPlacement) {
              top = '17px';
            } else {
              top = '3px';
            }
            if (list.length === 3 && service.durationNights === 1) {
              Hlist = styles.hotelList3;
              name = styles.hotelName3;
              amount = styles.amountDiv3;
              if (isInPlacement) { top = '13px'; } else { top = '6px'; }
            }
            if (list.length >= 4 && service.durationNights === 1) {
              Hlist = styles.hotelList4;
              name = styles.hotelName4;
              amount = styles.amountDiv4;
              if (isInPlacement) { top = '13px'; } else { top = '6px'; }
            }
            let accommodation_status = '';
            if (obj.status && obj.status.state) {
              accommodation_status = obj.status.state;
            }

            let accommodation_status_icon = <div style={{ color: '#42937a', position: iconPos, top, left: iconLeft }} >--</div>;
            if (accommodation_status === 'Available') {
              accommodation_status_icon = <div className='availabilityInfo'><i className='mdi mdi-calendar-check' style={{ position: iconPos, top, left: iconLeft }} /></div>;
            } else if (accommodation_status === 'Booked') {
              accommodation_status_icon = <div className='availabilityInfo'><i className='mdi mdi-cash-usd' style={{ position: iconPos, top, left: iconLeft }} /></div>;
            } else if (accommodation_status === 'Unavailable') {
              accommodation_status_icon = <div className='exo-colors-text text-error-front availabilityInfo'><i className='mdi mdi-calendar-remove' style={{ position: iconPos, top, left: iconLeft }} /></div>;
            } else if (accommodation_status === 'On Request') {
              accommodation_status_icon = <div className='exo-colors-text text-accent-4 availabilityInfo'><i className='mdi mdi mdi-calendar-blank' style={{ position: iconPos, top, left: iconLeft }} /></div>;
            }
            let priceAmount = '--';
            if (obj.price && obj.price.amount && obj.price.amount !== 0 && obj.price.amount !== '') {
              priceAmount = SERVICES.currency[(TAcountry && TAcountry[0].currency) || 'USD'] + this._priceFormat(obj.price.amount);
            }
            return (<div key={obj._key} className={Hlist} style={{ height: hotelListHeight, padding: '2px 0 0 1px' }}>
              <span className={name} style={{ display: none, fontSize }}>{obj.title || obj.accommodation.title}</span>
              <span className={amount} style={{ left: amountLeft, position: amountPos }}>
                {accommodation_status_icon}
                {isInPlacement && isAvailabilityChecked ? <i>{priceAmount}</i> : null}
                {isInPlacement && hasPaxErrors ? <i className='mdi mdi-account-alert' style={{ color: '#ffb340', marginLeft: '13px', marginBottom: '4px', fontSize: '14px' }} /> : null}
                {isInPlacement && duplicatePax ? <i className='mdi mdi-account-alert' style={{ color: '#d51224', marginLeft: '13px', marginBottom: '4px', fontSize: '14px' }} /> : null}
              </span>
            </div>);
          })
        }
      </div>
    </div>);

    const d_durationNights = this.props.service.durationNights;
    let repeated_info = '';
    if (d_durationNights > 2) {
      repeated_info = _.times(d_durationNights - 1, (k) => {
        const c = d_durationNights - 2;
        let hideDetail;
        if (k === c) {
          hideDetail = 'none';
        } else {
          hideDetail = '';
        }
        const t = k + 2;
        const m = k * 350;
        let top = 474 + m;
        top += 'px';
        let left;
        if (SERVICES.isSideNavOpen) {
          if (d_durationNights > 9) {
            left = '50px';
          } else {
            left = '58px';
          }
        } else if (d_durationNights > 9) {
          left = '94px';
        } else {
          left = '102px';
        }
        if (k > 7) {
          if (SERVICES.isSideNavOpen) {
            left = '17px';
          } else {
            left = '63px';
          }
        }
        return (<div key={k} style={{ width: '100%', zIndex: '10', position: 'absolute', top: `${top}` }}>
          <span className={styles.repeatinCount} style={{ left }}>
            <span>{k + 2}</span> of {d_durationNights}
          </span>
          <div style={{ margin: '0px 8px', borderTop: '2px solid #499f81' }}>
            <div style={{ height: '100%', width: '100%', position: 'inherit', backgroundColor: '#53b898', paddingBottom: '15px', borderRadius: '0 0 3px 3px', display: hideDetail }}>
              {toBeRepeatedInfo}
            </div>
          </div>
        </div>);
      });
    }
    // end repeating info block for hotel placement
    return (
      <div className={cx('valign-wrapper', { 'pl-20': !isInPlacement })} style={style} >

        <div data-tip={service.title} style={{ height: '100%', width: '100%', position: 'relative', marginBottom: '18px' }} className={cx({ 'z-depth-3': isActive })} {...this.handleOpenOverlay()} >
          {isInPlacement ? repeated_info : null}
          <div className={cx('cursor exo-colors darken-2', { cursor: !isInPlacement })} style={{ height: this.props.imageHeight || '160px', width: '100%', position: 'relative', backgroundImage: `url(${imageUrl})`, backgroundSize: 'cover', borderRadius: '3px 3px 0 0' }}>

            {
              isInPlacement && product_pre_selection_count > 0 ?
              (
                <div>
                  <p onClick={this.changeAccommodationModalState.bind(this, true)} className={styles.preselectionIcon}>{product_pre_selection_count}<i style={{ marginLeft: '2px', fontSize: '1rem' }} className='mdi mdi-layers' /></p>
                  <i className={styles.nights} style={nightStyle}>{service.durationNights} {(service.durationNights === 1) ? <i>night</i> : <i>nights</i> }</i>
                </div>
              ) : null
            }

          </div>
          <div style={{ height: calH, width: '100%', position: 'inherit', backgroundColor: '#53b898', paddingBottom: '15px', borderRadius: '0 0 3px 3px' }}>
            <div style={{ height: '40px', width: '100%', position: 'inherit' }}>
              <div className={cx('col p-0 pt-5 pl-10', { s9: !isInPlacement }, { s9: isInPlacement })} >
                <Dotdotdot clamp={2}>
                  <span className='lh-5' style={{ fontSize: '11px', fontWeight: 'bold', color: 'white' }}>
                    {service.title}
                  </span>
                </Dotdotdot>
              </div>
              {this.renderDropdown(isInPlacement)}
            </div>
            <div>
              {
              accommodations.filter(acc => acc.inactive !== true).map((obj, i) => {
                const list = accommodations.filter(acc => acc.inactive !== true);
                let hasPaxErrors = false;
                if (isInPlacement && obj.roomConfigs.length > 0) {
                  obj.roomConfigs.map((roomConfigs) => { // eslint-disable-line array-callback-return
                    if (roomConfigs.paxs && roomConfigs.paxs.length === 0) {
                      hasPaxErrors = true;
                    }
                  });
                }
                const count = 1;
                let duplicatePax = false;
                const allPax = [];
                accommodations.filter(acc => acc.inactive !== true).map((obj, i) => { // eslint-disable-line array-callback-return
                  if (obj.roomConfigs && obj.roomConfigs.length > 0) {
                    obj.roomConfigs.map((roomConfigs) => { // eslint-disable-line array-callback-return
                      if (roomConfigs.paxs && roomConfigs.paxs.length > 0) {
                        roomConfigs.paxs.map((pax) => { // eslint-disable-line array-callback-return
                          if (SERVICES.pax && SERVICES.pax.length > 0) {
                            SERVICES.pax.map((checkPax, p) => { // eslint-disable-line array-callback-return
                              if (checkPax._key === pax._key) {
                                allPax.push(checkPax._key);
                              }
                            });
                          }
                        });
                      }
                    });
                  }
                });

                const b = allPax.sort();

                _.times(b.length - 1, (l) => {
                  if (b[l + 1] === b[l]) {
                    duplicatePax = true;
                  }
                });

                if (obj.roomConfigs && obj.roomConfigs.length === 0) {
                  duplicatePax = false;
                }
                let Hlist = styles.hotelList;
                let name = styles.hotelName;
                let amount = styles.amountDiv;
                let top;
                if (isInPlacement) {
                  top = '17px';
                } else {
                  top = '3px';
                }
                if (list.length === 3 && service.durationNights === 1) {
                  Hlist = styles.hotelList3;
                  name = styles.hotelName3;
                  amount = styles.amountDiv3;
                  if (isInPlacement) { top = '13px'; } else { top = '6px'; }
                }
                if (list.length >= 4 && service.durationNights === 1) {
                  Hlist = styles.hotelList4;
                  name = styles.hotelName4;
                  amount = styles.amountDiv4;
                  if (isInPlacement) { top = '13px'; } else { top = '6px'; }
                }

                let accommodation_status = '';
                if (obj.status && obj.status.state) {
                  accommodation_status = obj.status.state;
                }

                let accommodation_status_icon = <div style={{ color: '#42937a', position: iconPos, top, left: iconLeft }} >--</div>;
                if (accommodation_status === 'Available') {
                  accommodation_status_icon = <div className='availabilityInfo'><i className='mdi mdi-calendar-check' style={{ position: iconPos, top, left: iconLeft }} /></div>;
                } else if (accommodation_status === 'Booked') {
                  accommodation_status_icon = <div className='availabilityInfo'><i className='mdi mdi-cash-usd' style={{ position: iconPos, top, left: iconLeft }} /></div>;
                } else if (accommodation_status === 'Unavailable') {
                  accommodation_status_icon = <div className='exo-colors-text text-error-front availabilityInfo'><i className='mdi mdi-calendar-remove' style={{ position: iconPos, top, left: iconLeft }} /></div>;
                } else if (accommodation_status === 'On Request') {
                  accommodation_status_icon = <div className='exo-colors-text text-accent-4 availabilityInfo'><i className='mdi mdi mdi-calendar-blank' style={{ position: iconPos, top, left: iconLeft }} /></div>;
                }
                let priceAmount = '--';
                if (obj.price && obj.price.amount && obj.price.amount !== 0 && obj.price.amount !== '') {
                  priceAmount = SERVICES.currency[(TAcountry && TAcountry[0].currency) || 'USD'] + this._priceFormat(obj.price.amount);
                }
                return (<div key={obj._key} className={Hlist} style={{ height: hotelListHeight }}>
                  <span className={name} style={{ display: none, fontSize }}>{obj.title || obj.accommodation.title}</span>
                  <span className={amount} style={{ left: amountLeft, position: amountPos }}>
                    {accommodation_status_icon}
                    {isInPlacement && isAvailabilityChecked ? <i>{priceAmount}</i> : null}
                    {isInPlacement && hasPaxErrors ? <i className='mdi mdi-account-alert' style={{ color: '#ffb340', marginLeft: '13px', marginBottom: '4px', fontSize: '14px' }} /> : null}
                    {isInPlacement && duplicatePax ? <i className='mdi mdi-account-alert' style={{ color: '#d51224', marginLeft: '13px', marginBottom: '4px', fontSize: '14px' }} /> : null}
                  </span>
                </div>);
              })
            }
            </div>
          </div>
        </div>
        <ReactTooltip />
        {accommodationModal}
        {
          this.state.isRemoveModalOpened ?
            <Modal actionButton={removeButton} isModalOpened={this.state.isRemoveModalOpened} changeModalState={this.changeRemoveModalState}>
              <h3>Remove Accommodation</h3>
              <span>This action will remove this hotel and cannot be undone. Do you wish to continue?</span>
            </Modal>
            : null
        }
      </div>
    );
  }
}
