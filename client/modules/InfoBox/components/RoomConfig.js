import React, { Component, PropTypes } from 'react';
import Relay from 'react-relay';
import cx from 'classnames';
import shortId from 'shortid';
import { Select } from '../../Utils/components';
import style from '../style.module.scss';
import Pax from './Pax';
import SupplierPaxStatus from '../renderers/SupplierPaxStatusRenderer';
import UpdateRoomConfigMutation from '../mutations/UpdateRoomConfig';

export default class RoomConfig extends Component {
  static propTypes = {
    viewer: PropTypes.object.isRequired,
    handleRemoveRoom: PropTypes.func.isRequired,
    roomConfig: PropTypes.object.isRequired,
    totalRoom: PropTypes.number.isRequired,
    relay: PropTypes.object,
    tripKey: PropTypes.string,
    cityBookingKey: PropTypes.string,
    paxs: PropTypes.array
  };

  state = {
    roomType: this.props.roomConfig.roomType,
    paxStatusKey: shortId.generate()
  };

  componentDidMount() {
    this.paxKeys = this.props.roomConfig.paxs.map(pax => pax._key);
  }

  handleOnChangeRoomType = (e) => {
    this.setState({ roomType: e.target.value }, () => {
      this.handleUpdateRoom(this.props.roomConfig.id, this.state.roomType, this.paxKeys || []);
    });
  };

  handleUpdateRoom = (roomConfigId, roomType, paxKeys) => {
    Relay.Store.commitUpdate(new UpdateRoomConfigMutation({
      roomType,
      paxKeys,
      roomConfigId
    }), {
      onSuccess: () => {
        this.setState({ paxStatusKey: shortId.generate() });
      }
    });
  };

  handleOnChangePaxs = (paxKeys) => {
    this.handleUpdateRoom(this.props.roomConfig.id, this.state.roomType, paxKeys);
  };

  render() {
    const { handleRemoveRoom, totalRoom, paxs, roomConfig, roomNo } = this.props;
    let paxSelected = 0;
    if (roomConfig.paxs) {
      paxSelected = roomConfig.paxs.length;
    }

    return (
      <div className={style.roomConfigWrapper}>
        <div className='row m-0 fw-700'>
          <div className='col s6 p-0 m-0'>
            <span>Room {roomNo}</span>
          </div>
          <div className='col s6 p-0 m-0 align-right'>
            {
              totalRoom > 0 ?
                <a style={{ fontSize: '11px', cursor: 'pointer' }} onClick={handleRemoveRoom.bind(null, roomConfig.id)}><i className='mdi-action-delete align-right' style={{ fontSize: '16px', paddingBottom: '2px', marginRight: '2px' }} />REMOVE</a>
              : null
            }
          </div>
        </div>
        <div className='row m-0 '>
          <div className='col s12 p-0'>
            <span style={{ color: '#bfbfbf', fontWeight: '700', fontSize: '10px' }}>Room type</span>
            <div className='row m-0'>
              <div className='col s2 p-0'>
                <i style={{ fontSize: '16px', color: '#bfbfbf' }} className='mdi mdi-hotel' />
              </div>
              <div className='col s9 p-0'>
                <div className={style.select} style={{ width: '95%' }}>
                  <Select value={this.state.roomType} onChange={this.handleOnChangeRoomType}>
                    <option value=''>Select Type</option>
                    <option value='Double'>Double</option>
                    <option value='Single'>Single</option>
                    <option value='Triple'>Triple</option>
                  </Select>
                </div>
                <span style={{ color: '#bfbfbf', fontWeight: '700', fontSize: '10px' }}>Max 3 people</span>
              </div>
            </div>
          </div>
        </div>
        <div className='row m-0 '>
          <div className='col s12 p-0'>
            <span style={{ color: '#bfbfbf', fontWeight: '700', fontSize: '10px' }}>Travellers in room</span>
            <div className='row m-0'>
              <div className='col s2 p-0'>
                <i style={{ fontSize: '16px', color: '#bfbfbf' }} className='mdi mdi-account' />
              </div>
              <div className='col s9 p-0'>
                <div className={style.select} style={{ width: '95%' }}>
                  <Pax key={shortId.generate()} availablePaxs={paxs} selectedPaxs={roomConfig.paxs} handleOnChange={this.handleOnChangePaxs} />
                </div>
                <span style={{ color: '#bfbfbf', fontWeight: '700', fontSize: '10px' }}>{paxSelected} people selected</span>
              </div>
            </div>
          </div>
        </div>

        <div className='row m-0'>
          <div className='col s12 p-0'>
            <SupplierPaxStatus key={this.props.roomConfig._key} theKey={this.state.paxStatusKey} cityBookingKey={this.props.cityBookingKey} tripKey={this.props.tripKey} roomConfigKey={this.props.roomConfig._key} />
          </div>
        </div>
      </div>
    );
  }
}
