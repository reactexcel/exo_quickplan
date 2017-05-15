import React, { Component, PropTypes } from 'react';
import PubSub from 'pubsub-js';
import Relay from 'react-relay';
import { FaCalendarCheckO, FaCalendarTimesO, FaDollar } from 'react-icons/lib/fa';
import style from '../style.module.scss';
import { Dropdown } from '../../Utils/components';
import SERVICES from '../../../services';
//  import ClearTransferPlacementMutation from '../mutations/ClearTransferPlacement';
import RemoveLocalTransfer from '../../Transfer/mutations/RemoveLocalTransfer'; // added on 19th oct to remove local transfer

export default class TransferPlacement extends Component {
  static defaultProps = {
    data: {
      route: {
        from: {
          cityName: 'Bangkok'
        },
        to: {
          cityName: 'Hua Hin'
        }
      }
    },
    className: style.arrowBox
  };

  static propTypes = {
    data: PropTypes.object,
    className: PropTypes.node,
    bindInfobox: PropTypes.bool,
    transferPlacementId: PropTypes.string
  };

  constructor(props) {
    super(props);
    this.state = {
      local_transfer_action_btn: {
        color: '#999999'
      },
      currency: 'USD'
    };
  }
  componentWillReceiveProps(props) {
    if (props.isLocalTransfer) {
      const TAcountry = SERVICES.selectedTAOffice && SERVICES.selectedTAOffice.workInCountries && SERVICES.selectedTAOffice.workInCountries.filter(off => off.countryCode === (props.countryBooking && props.countryBooking.location && props.countryBooking.location.tpCode));
      if (TAcountry && TAcountry.length > 0) {
        this.setState({ currency: TAcountry[0].currency });
      }
    } else {
      const TAcountry = SERVICES.selectedTAOffice && SERVICES.selectedTAOffice.workInCountries && SERVICES.selectedTAOffice.workInCountries.filter(off => off.countryCode === (props.country && props.country.location && props.country.location.tpCode));
      if (TAcountry && TAcountry.length > 0) {
        this.setState({ currency: TAcountry[0].currency });
      }
    }
  }

  componentWillMount() {
    this.token = PubSub.subscribe(`ChangeLocalTransfer_${this.props.transferPlacementKey}`, (msg, data) => {
      if (data.type === 'change') {
        this.props.updateLocalTransfer({
          transferPlacementKey: this.props.transferPlacementKey,
          transfer_key: this.props.data._key
        });
      }
    });
  }
  componentWillUnmount() {
    PubSub.unsubscribe(this.token);
  }

  _on_local_transfer_action_btn_hover = () => {
    this.setState({
      local_transfer_action_btn: {
        color: '#7fc7ae'
      }
    });
  }

  _on_local_transfer_action_btn_out = () => {
    this.setState({
      local_transfer_action_btn: {
        color: '#999999'
      }
    });
  }

  bindInfoBox = () => { // eslint-disable-line consistent-return
    if (this.props.bindInfobox) {
      return this.publishInfobox;
    }
  };

  publishInfobox = () => {
    let clickedTransferKey = '';
    if (this.props.completeTransferSB && this.props.completeTransferSB._key) {
      clickedTransferKey = this.props.completeTransferSB._key;
    }

    // store clicked transfer id

    if (this.props.isLocalTransfer) {
      PubSub.publish('Infobox', { type: 'clear' });
      PubSub.publish('Infobox', {
        cityBookingKey: this.props.cityBookingKey,
        transferPlacementId: this.props.transferPlacementId,
        type: 'localtransfer',
        tpBookingRef: this.props.tpBookingRef,
        currency: this.state.currency,
        clickedTransferKey
      });
    } else {
      PubSub.publish('Infobox', { type: 'clear' });
      PubSub.publish('Infobox', {
        transferPlacementId: this.props.transferPlacementId,
        type: 'transfer',
        currency: this.state.currency,
        tpBookingRef: this.props.tpBookingRef,
        clickedTransferKey
      });
    }
  };

  // added to remove local transfer
  removeLocalTransfer = () => {
    Relay.Store.commitUpdate(new RemoveLocalTransfer({
      transferPlacementKey: this.props.transferPlacementKey
    }), {
      onSuccess: response => this.props.onSuccessClearTransfer(true, response),
      onFailure: response => this.props.onFailureClearTransfer(false, response)
    });
  };

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

  availabilityInfo(statusCheck) {
    switch (statusCheck) {
      case 'Booked':
        return (<div className='availabilityInfo'>
          <i className='mdi mdi-cash-usd fs-25' />
        </div>);
      case 'Available':
        return (<div className='availabilityInfo'>
          <i className='mdi mdi-calendar-check' />
        </div>);
      case 'Unavailable':
        return (<div className='exo-colors-text text-error-front availabilityInfo'>
          <FaCalendarTimesO size={10} />
        </div>);
      case 'On Request':
        return (<div className='exo-colors-text text-accent-4 availabilityInfo'>
          <i className='mdi mdi-calendar-blank' />
        </div>);
      default:
        return (<div className='availabilityInfo'>
          --
        </div>);
    }
  }


  render() {
    const { data, data: { isPlaceholder } } = this.props;
    let width = '210px';
    if (SERVICES.isSideNavOpen) {
      width = '160px';
    }
    let fromCityName;
    let toCityName;
    let description1;
    let description2;

    // start for local transfer
    const triggerButton = (<a style={this.state.local_transfer_action_btn} onMouseEnter={this._on_local_transfer_action_btn_hover} onMouseLeave={this._on_local_transfer_action_btn_out}>
      <i className='mdi-navigation-more-vert' style={{ fontSize: '1.4em', color: 'white' }} />
    </a>);

    const isLocalTransfer = this.props.isLocalTransfer || false;
    let localOptionMenu = '';
    if (isLocalTransfer) {
      let dropdownButtonStyle = {};
      if (this.props.statusState === 'Booked') {
        dropdownButtonStyle = { pointerEvents: 'none', cursor: 'default', color: '#CCCCCC' };
      }
      localOptionMenu = (<Dropdown key='2' triggerButton={triggerButton}>
        <li>
          <a style={dropdownButtonStyle} href='#!' onClick={() => { this.props.updateLocalTransfer({ transferPlacementKey: this.props.transferPlacementKey, transfer_key: data._key }); }}>
            Change Local Transfer
          </a>
        </li>
        <li><a style={dropdownButtonStyle} href='#!' onClick={this.removeLocalTransfer} >Remove Local Transfer</a></li>
      </Dropdown>);
    }

    const numberOfTransferOptions = this.props.numberOfTransferOptions || false; // eslint-disable-line no-unused-vars

    // end for local transfer

    if (!isPlaceholder) {
      let from;


      fromCityName = `${data.route && data.route.from && data.route.from.cityName} , ${(data.route && data.route.from && data.route.from.place) || (data.route && data.route.from && data.route.from.localityName)}`;
      toCityName = `${data.route && data.route.to && data.route.to.cityName} , ${(data.route && data.route.to && data.route.to.place) || (data.route && data.route.to && data.route.to.localityName)}`;
      description1 = ((data.vehicle && data.vehicle.category) || (data.class && data.class.description) || '');
      description2 = ((data.vehicle && data.vehicle.model) || '');
      // add ref no, time etc in description
    } else {
      let from_place = '';
      let from_cityName = '';
      let to_place = '';
      let to_cityName = '';
      if (data.serviceBooking && data.serviceBooking.transfer && data.serviceBooking.transfer.route) {
        const sbTransferRoute = data.serviceBooking.transfer.route;
        from_place = (sbTransferRoute.from && sbTransferRoute.from.place || ''); // eslint-disable-line no-mixed-operators
        from_cityName = (sbTransferRoute.from && sbTransferRoute.from.cityName || ''); // eslint-disable-line no-mixed-operators
        to_place = (sbTransferRoute.to && sbTransferRoute.to.place || ''); // eslint-disable-line no-mixed-operators
        to_cityName = (sbTransferRoute.to && sbTransferRoute.to.cityName || ''); // eslint-disable-line no-mixed-operators
        fromCityName = `${from_place} ${from_cityName}`;
        toCityName = `${to_place} ${to_cityName}`;
      }

      if (typeof fromCityName === 'undefined' || fromCityName === '') {
        fromCityName = (data.serviceBooking && data.serviceBooking.route && data.serviceBooking.route.from || '');  // eslint-disable-line no-mixed-operators
      }
      if (typeof toCityName === 'undefined' || toCityName === '') {
        toCityName = (data.serviceBooking && data.serviceBooking.route && data.serviceBooking.route.to || ''); // eslint-disable-line no-mixed-operators
      }
      description1 = (data.serviceBooking && data.serviceBooking.placeholder && data.serviceBooking.placeholder.vehicle || ''); // eslint-disable-line no-mixed-operators
      description2 = (data.serviceBooking && data.serviceBooking.placeholder && data.serviceBooking.placeholder.vehicleModel || ''); // eslint-disable-line no-mixed-operators
    }

    let t_icon = '';
    let t_desc = '';
    let t_TransferIcon = '';

    if (data.type && data.type.description) {
      t_desc = data.type.description;
      t_icon = this.iconClass(t_desc);
      t_TransferIcon = <i className={t_icon} />;
    }
    if (String(t_TransferIcon) === '' && data.serviceBooking && data.serviceBooking.transfer && data.serviceBooking.transfer.type && data.serviceBooking.transfer.type.description) {
      t_icon = this.iconClass(data.serviceBooking.transfer.type.description);
      if (t_icon !== '') {
        t_TransferIcon = <i className={t_icon} />;
      }
    }


    if (String(t_TransferIcon) === '' && data.serviceBooking && data.serviceBooking.placeholder && data.serviceBooking.placeholder.type) {
      t_desc = data.serviceBooking.placeholder.type;
      t_icon = this.iconClass(t_desc);
      t_TransferIcon = <i className={t_icon} />;
    }
    let font = '10px';
    if (SERVICES.isSideNavOpen) {
      font = '7px';
    }


    let sbStatusCheck = '';
    if (this.props.serviceBooking && this.props.serviceBooking.status && this.props.serviceBooking.status.state) {
      sbStatusCheck = this.props.serviceBooking.status.state;
    }
    if (sbStatusCheck === '' && this.props.data && this.props.data.serviceBooking && this.props.data.serviceBooking.status && this.props.data.serviceBooking.status.state) {
      sbStatusCheck = this.props.data.serviceBooking.status.state;
    }

    const statusIcon = this.availabilityInfo(sbStatusCheck);


    return (<div style={{ width: '100%' }}>
      {
          isLocalTransfer ?
            <div className={style.localTransferWrapper} onClick={this.bindInfoBox()}>
              <div style={{ paddingTop: '0px' }}>
                <span className={style.dropdown}>{localOptionMenu}</span>
                <span>
                  {t_TransferIcon}
                </span>
                <span className={style.description}><i>{description1}</i> <br /> <i>{description2}</i></span>
              </div>
              <div style={{ paddingLeft: '13px' }}>
                <span> {statusIcon}</span>
              </div>
              <div style={{ paddingTop: '2px' }}>
                <div className='row m-0 p-0' style={{ fontSize: font, color: 'white' }}>
                  <div className='col s2 p-0' style={{ textAlign: 'center' }}>
                     From
                  </div>
                  <div className='col s4 p-0' style={{ textAlign: 'center', fontWeight: 'bold', wordWrap: 'break-word' }}>
                    {fromCityName}
                  </div>
                  <div className='col s2 p-0' style={{ textAlign: 'center' }}>
                     To
                   </div>
                  <div className='col s4 p-0' style={{ textAlign: 'left', fontWeight: 'bold', wordWrap: 'break-word' }}>
                    {toCityName}
                  </div>
                </div>
              </div>
              {/* <div className='row m-0'>
                <div className='col s2'>
                  {localOptionMenu}
                  <br />
                  {
                    numberOfTransferOptions ? <span> <i className='mdi mdi-buffer' /> <br /> {numberOfTransferOptions}</span> : null
                  }
                </div>
                <div className='col s10' onClick={this.bindInfoBox()} >
                  <p className='m-0' style={{ fontSize: '14px' }}>{fromCityName}</p>
                  <hr className='m-0' />
                  <p className='m-0' style={{ fontSize: '14px' }}>{toCityName}</p>
                  <br />
                  <p className='m-0' style={{ maxHeight: '40px', fontSize: '12px' }}>{description1} <br /> {description2}</p>
                  <span className={style.icon}> {t_TransferIcon}</span>
                </div> */}
              {/* </div> */}
            </div>
            : <div className={this.props.className} style={{ width }} onClick={this.bindInfoBox()}>
              <p className='m-0' style={{ lineHeight: '15px', fontWeight: '600', top: '10px', left: '51px', maxHeight: '40px', fontSize: '1em', position: 'relative', color: 'white' }}>{description1} <br /> {description2}</p>
              <div className='row m-0 pt-10 pl-5' style={{ top: '24px', position: 'relative', height: '40px', left: '11px', fontSize: '10px', color: 'white' }}>
                <div className='col p-0 s2'>
                  <span>From</span>
                </div>
                <div className='col p-0 s9 pl-3'>
                  <span style={{ color: 'white', fontSize: '10px', fontWeight: '600' }}>{fromCityName}</span>
                </div>
              </div>
              <div className='row m-0 pl-5' style={{ top: '14px', position: 'relative', height: '40px', left: '11px', fontSize: '10px', color: 'white' }}>
                <div className='col p-0 s2'>
                  <span>To</span>
                </div>
                <div className='col p-0 s9 pl-3'>
                  <span style={{ color: 'white', fontSize: '10px', fontWeight: '600' }}>{toCityName}</span>
                </div>
              </div>
              {/* <p className='m-0' style={{ top: '20px', position: 'relative', left: '11px', fontSize: '11px', fontWeight: '600', color: 'white' }}>To<span style={{ marginLeft: '24px' }}>{toCityName}</span></p> */}
              <span className={style.icon}> {t_TransferIcon} </span>
              <span style={{ position: 'absolute', color: '#7f7f7f', top: '24%', left: '13%' }}><span> {statusIcon}</span></span>
            </div>
        }
    </div>
    );
  }
}
