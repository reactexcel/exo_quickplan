import React, { Component, PropTypes } from 'react';
import Relay from 'react-relay';
import cx from 'classnames';
import PubSub from 'pubsub-js';
import { Card, Dropdown } from '../../Utils/components';
import TransferPlacement from './TransferPlacement';
import style from '../style.module.scss';
import TransferModal from '../renderers/TransferModalRenderer';
import ClearTransferPlacementMutation from '../mutations/ClearTransferPlacement';
import logo from '../../../assets/logo.png';
import SERVICES from '../../../services';

export default class Transfer extends Component {
  static propTypes = {
    transfer: PropTypes.object,
    transferPlacement: PropTypes.object,
    cityBookingId: PropTypes.string,
    isTaView: PropTypes.bool,
    proposalKey: PropTypes.string
  };

  state = {
    isModalOpened: false
  };

  componentWillMount() {
    if (this.props.transfer && this.props.transfer._key) {
      this.token = PubSub.subscribe(`ChangeTransfer_${this.props.transfer._key}`, (msg, data) => {
        if (data.type === 'change') {
          this.changeModalState(data.isOpen);
        }
      });
    }
  }
  componentWillUnmount() {
    PubSub.unsubscribe(this.token);
  }

  changeModalState = (isOpen) => {
    this.setState({ isModalOpened: isOpen });
  };

  clearTransferPlacement = () => {
    let transferPlacementKey = this.props.transfer && this.props.transfer._key;
    let transferPlacementId = this.props.transfer && this.props.transfer.id;
    if (!transferPlacementKey && this.props.transferPlacement && this.props.transferPlacement._key) {
      transferPlacementKey = this.props.transferPlacement && this.props.transferPlacement._key;
      transferPlacementId = this.props.transferPlacement && this.props.transferPlacement.id;
    }

    Relay.Store.commitUpdate(new ClearTransferPlacementMutation({
      transferPlacementKey,
      transferPlacementId
    }), {
      onSuccess: () => {
        PubSub.publish('Infobox', { type: 'clear' });
        PubSub.publish('TripForceFetch', {});
      }
    });
  };

  render() {
    let border = '1px solid #e8e8e8';
    let padding = '15px 40px 15px 68px';
    if (this.props.isCityTransfer) {
      padding = '15px 0px';
      border = '';
    }
    let isTripArrival = false;
    let isTripDeparture = false;
    let tripStartDate = '';

    if (this.props.isTripArrival) {
      isTripArrival = true;
    }
    if (this.props.isTripDeparture) {
      isTripDeparture = true;
    }
    if (this.props.tripStartDate) {
      tripStartDate = this.props.tripStartDate;
    }

    if (tripStartDate === '' && this.props.transfer_start_date) {
      tripStartDate = this.props.transfer_start_date;
    }

    const { transfer, transferPlacement } = this.props;
    let hasError = transfer && transfer.transferStatus && !!transfer.transferStatus.severity;
    const triggerButton = <a><i className={cx('mdi-navigation-more-vert', style.actionMenu)} style={{ fontSize: '1.5em' }} /></a>;

    let durationDays = false;
    if (transfer && transfer.durationDays) {
      durationDays = transfer.durationDays;
    }

    let transferTitle = [];
    let dropdownButtonStyle = {};
    if (transfer && transfer.serviceBookings && transfer.serviceBookings.length > 0) {
      // if serviceBookings is in the Booked status state, disable the romove and change
      if (transfer.serviceBookings.find(serviceBooking => serviceBooking.status && serviceBooking.status.state === 'Booked')) {
        dropdownButtonStyle = { pointerEvents: 'none', cursor: 'default', color: '#CCCCCC' };
      }
    }
    if (isTripArrival === true) {
      transferTitle = [
        <div key='8' className='row m-0'>
          <div key='9' className='col p-0 s10 align-left'>
            <img key='1' src={logo} alt='logo' style={{ height: '30px', paddingBottom: '2px', paddingRight: '8px', verticalAlign: 'middle' }} />
            <span key='2' style={{ fontSize: '15px', fontWeight: 'bold' }}>Welcome to EXO Travel</span>
          </div>
          {this.props.isTaView ? null : (<div key='7' className='col p-0 s1'>
            <span key='5' style={{ marginLeft: '50%' }}>
              <Dropdown key='3' triggerButton={triggerButton}>
                <li><a style={dropdownButtonStyle} href='#!' onClick={() => this.setState({ isModalOpened: true })}>Change transfer</a></li>
                <li><a style={dropdownButtonStyle} href='#!' onClick={this.clearTransferPlacement}>Clear transfer</a></li>
              </Dropdown>
            </span>
          </div>)}
        </div>];
    } else if (isTripDeparture === true) {
      transferTitle = [
        <div key='8' className='row m-0'>
          <div key='9' className='col p-0 s10 align-left'>
            <img key='1' src={logo} alt='logo' style={{ height: '30px', paddingBottom: '2px', paddingRight: '8px', verticalAlign: 'middle' }} />
            <span key='2' style={{ fontSize: '15px', fontWeight: 'bold' }}>Thank you for travelling with EXO Travel</span>
          </div>
          {this.props.isTaView ? null : (<div key='7' className='col p-0 s1'>
            <span key='5' style={{ marginLeft: '50%' }}>
              <Dropdown key='3' triggerButton={triggerButton}>
                <li><a style={dropdownButtonStyle} href='#!' onClick={() => this.setState({ isModalOpened: true })}>Change transfer</a></li>
                <li><a style={dropdownButtonStyle} href='#!' onClick={this.clearTransferPlacement}>Clear transfer</a></li>
              </Dropdown>
            </span>
          </div>)}
        </div>];
    } else {
      transferTitle = [
        <span key='1' className='left m-0 light' style={{ fontSize: '10px' }}><span style={{ fontSize: '15px', fontWeight: 'bold' }}>{transferPlacement.fromCity.name} </span> <br /> {transferPlacement.fromCity.country}</span>,
        <i key='7' className='mdi mdi-ray-start-end small green-text ml-20 pl-10 pr-10' />,
        <span key='6' className='left light' style={{ fontSize: '10px', marginLeft: '6%', position: 'absolute' }}><span style={{ fontSize: '15px', fontWeight: 'bold' }}>{transferPlacement.toCity.name} </span><br /> {transferPlacement.toCity.country}</span>,

        this.props.isTaView ? null : (<span key='5' className='right' style={{ marginRight: '9%' }}>
          <Dropdown key='2' triggerButton={triggerButton}>
            <li><a style={dropdownButtonStyle} href='#!' onClick={() => this.setState({ isModalOpened: true })}>Change transfer</a></li>
            <li><a style={dropdownButtonStyle} href='#!' onClick={this.clearTransferPlacement}>Clear transfer</a></li>
          </Dropdown></span>)
      ];
    }

    if (isTripArrival === true || isTripDeparture === true) {
      hasError = false;
    }

    if (hasError) {
      const errorMessage = <h6 className='light' key='4'>{transfer.transferStatus.message}</h6>;
      transferTitle.push(errorMessage);
    }

    let product_pre_selection_count = 0;

    let transferPlacements;
    // if ( transfer && transfer.serviceBookings && transfer.serviceBookings.length > 0 && isTripDeparture !== true) {

    let transferPlacementServiceBookings = transfer && transfer.serviceBookings && transfer.serviceBookings || [];  // eslint-disable-line no-mixed-operators
    if (isTripDeparture && this.props.transferPlacement && this.props.transferPlacement.serviceBookings && this.props.transferPlacement.serviceBookings.length > 0) {
      transferPlacementServiceBookings = this.props.transferPlacement.serviceBookings;
    }
    if (transferPlacementServiceBookings.length > 0) {
      if (isTripDeparture) {
        transferPlacements = transferPlacementServiceBookings.map((data, i) => {
          product_pre_selection_count++;
          let ret = '';
          if (data.placeholder) {
            const passData = {};
            passData.isPlaceholder = true;
            passData.serviceBooking = { ...data };
            ret = <TransferPlacement completeTransferSB={data} key={`${i}_${data._key}`} transferPlacementId={transferPlacement.id} data={passData} tpBookingRef={this.props.tpBookingRef} country={this.props.country} bindInfobox />;
          } else {
            ret = <TransferPlacement completeTransferSB={data} key={data.transfer._key} transferPlacementId={transferPlacement.id} data={data.transfer} tpBookingRef={this.props.tpBookingRef} country={this.props.country} bindInfobox />;
          }
          if (i === 0) {
            return <div key={i} style={{ float: 'left' }}>{ret}</div>;
          }
          return (<div key={i} style={{ float: 'left', marginLeft: '4px' }}>
            <TransferPlacement completeTransferSB={data} key={data.transfer._key} transferPlacementId={transferPlacement.id} data={data.transfer} tpBookingRef={this.props.tpBookingRef} country={this.props.country} bindInfobox />
          </div>);
        }
        );
      } else {
        transferPlacements = transferPlacementServiceBookings.map((data, i) => {
          product_pre_selection_count++;
          let ret = '';
          if (data.placeholder) {
            const passData = {};
            passData.isPlaceholder = true;
            passData.serviceBooking = { ...data };
            ret = <TransferPlacement completeTransferSB={data} key={`${i}_${data._key}`} transferPlacementId={transferPlacement.id} data={passData} tpBookingRef={this.props.tpBookingRef} country={this.props.country} bindInfobox />;
          } else {
            ret = <TransferPlacement completeTransferSB={data} key={data.transfer._key} transferPlacementId={transferPlacement.id} data={data.transfer} tpBookingRef={this.props.tpBookingRef} country={this.props.country} bindInfobox />;
          }
          if (i === 0) {
            return <div key={i} style={{ float: 'left' }}>{ret}</div>;
          }
          return (<div key={i} style={{ float: 'left', marginLeft: '4px' }}>
            <TransferPlacement completeTransferSB={data} key={data.transfer._key} transferPlacementId={transferPlacement.id} data={data.transfer} tpBookingRef={this.props.tpBookingRef} country={this.props.country} bindInfobox />
          </div>);
        }
        );
      }
    } else {
      transferPlacements = (
        <div>
          <Card className='m-10'>
            <div className='center-align p-50'>
              <a className='fs-20 cursor' onClick={() => this.setState({ isModalOpened: true })}><i className='mdi-content-add' /> Add Transfer</a>
            </div>
          </Card>
        </div>
      );
    }

    let show_product_pre_selection_count = '';
    if (product_pre_selection_count > 0) {
      show_product_pre_selection_count = <p className={style.preselectionIcon}><i className='mdi mdi-layers' />{product_pre_selection_count}</p>;
    }


    // -- calculate selectedTransfers;
    let selectedTransfers = [];
    if (transferPlacementServiceBookings && transferPlacementServiceBookings.length > 0) {
      selectedTransfers = transferPlacementServiceBookings.map((data) => {
        if (data.isPlaceholder) {
          const passData = {};
          passData.isPlaceholder = true;
          passData.serviceBooking = { ...data };
          passData._key = `sBK_${data._key}`;
          return passData;
        }
        return data.transfer;
      });
    }


    return (
      <div style={{ borderRight: border, padding }}>
        <Card style={{ border: '1px solid rgb(212, 212, 212)', backgroundColor: '#f2f2f2' }} title={transferTitle} className={cx(style.wrapper, { [style.error]: hasError })} noBoxShadow countryStyle>

          {/* <div className={cx(style.date)}>
            <div className='valign center-align'>
              {
                isTripArrival ? null :
                <span>
                  { durationDays ? <div> {durationDays} Days </div> : null }
                </span>
              }
              <div style={{ position: 'absolute', bottom: '0px', marginLeft: '-10px' }}>
                {show_product_pre_selection_count}
              </div>
            </div>
          </div> */}
          <div className={cx(style.transferWrapper)}>
            {transferPlacements}
          </div>


          {
          /* TODO:: Change origin & destination to use locations node  */
          this.state.isModalOpened ?
            <TransferModal
              proposalKey={this.props.proposalKey || ''}
              isModalOpened={this.state.isModalOpened}
              changeModalState={this.changeModalState}
              transferPlacementId={transferPlacement && transferPlacement.id}
              cityBookingId={this.props.cityBookingId}
              selectedTransfers={selectedTransfers}
              origin={this.props.transferPlacement && this.props.transferPlacement.fromCity && this.props.transferPlacement.fromCity.tpCode || ''} // eslint-disable-line no-mixed-operators
              destination={this.props.transferPlacement && this.props.transferPlacement.toCity && this.props.transferPlacement.toCity.tpCode || ''} // eslint-disable-line no-mixed-operators
              dateFrom={tripStartDate}
              isTripArrival={isTripArrival}
              isTripDeparture={isTripDeparture}
              tripStartDate={tripStartDate}
              completeTransferPlacement={this.props.transferPlacement || null}
            /> : null
        }

        </Card>
      </div>
    );
  }
}
