import React, { Component, PropTypes } from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import _ from 'lodash';
import TransferIcon from '../TransferIcon';
import styles from './TransferOverlay.module.scss';
import { Select, Select2, ExoTimePicker } from '../../../Utils/components';

export default class TransferOverlay extends Component {
  static propTypes = {
    handleOpenOverlay: PropTypes.func.isRequired,
    handleClick: PropTypes.func,
    service: PropTypes.object,
    vehicleType: PropTypes.array,
  };

  constructor(props) {
    super(props);
    this.handleLocalDeparture = this.handleLocalDeparture.bind(this);
  }

  state = {
    typeDescription: 'Select type of tour placeholder to insert into iternary.',
    patchData: { transferKey: this.props.service._key },
    fromText: '',
    toText: '',
    timeDeparture: '',
    timeArrival: ''
  };

  componentWillMount() {
    let from_text = (this.props.service.route && (this.props.service.route.from.place || this.props.service.route.from.localityName || this.props.service.route.from.cityName)) || (this.state.patchData.route && this.state.patchData.route.from) || '';
    let to_text = (this.props.service.route && (this.props.service.route.to.place || this.props.service.route.to.localityName || this.props.service.route.to.cityName)) || (this.state.patchData.route && this.state.patchData.route.to) || '';

    if (from_text === '' && this.props.fromText) {
      from_text = this.props.fromText;
    }
    if (to_text === '' && this.props.toText) {
      to_text = this.props.toText;
    }
    this.setState({
      fromText: from_text,
      toText: to_text
    });
    this.setDefaultType();
  }

  handleDepartureTimeChange = (time, AMPM) => {
    this.setState({
      timeDeparture: time
    });
  }

  handleArrivalTimeChange = (time, AMPM) => {
    this.setState({
      timeArrival: time
    });
  }

  setDefaultType = () => {
    const patchData = { ...this.state.patchData };
    if (patchData.placeholder) {
      if (patchData.placeholder.type && patchData.placeholder.type !== '') { // eslint-disable-line no-empty
      } else {
        patchData.placeholder.type = 'Car';
      }
    } else {
      patchData.placeholder = {};
      patchData.placeholder.type = 'Car';
    }
    this.setState({ patchData });
  }

  handleChange = (e) => {
    const name = e.target.name;
    const value = (e.target.type === 'checkbox' ? e.target.checked : e.target.value);
    const patchData = { ...this.state.patchData };
    // change from and to when changed
    if (name === 'route.from') {
      this.setState({
        fromText: value
      });
    }
    if (name === 'route.to') {
      this.setState({
        toText: value
      });
    }
    _.set(patchData, name, value);
    this.setState({ patchData });
  };

  handleSelect = () => {
    const { handleClick, handleOpenOverlay, service } = this.props;

    if (this.props.service.isPlaceholder) {
      // if (!(this.state.patchData.placeholder && this.state.patchData.placeholder.type)) return;
    }

    service.serviceBooking = this.state.patchData;
    if (!service.serviceBooking.startSlot) {
      service.serviceBooking.startSlot = 1;  // default to morning
      service.serviceBooking.durationSlots = 1;
    }
    service.serviceBooking.isPlaceholder = this.props.service.isPlaceholder || false;
    handleOpenOverlay(false);
    handleClick(service);
  };

  handleUnSelect = () => {
    const { handleUnSelect, handleOpenOverlay, service } = this.props;
    handleOpenOverlay(false);
    handleUnSelect(service);
  }

  changeDuration(e) {
    this.setState({
      durationSlots: e.target.value
    });
  }

  // this will select departure handle
  handleLocalDeparture(e) {
    const patchData = this.state.patchData;
    if (e.target.value) {
      patchData.startSlot = e.target.value;
      patchData.durationSlots = 1;
    } else {
      patchData.startSlot = '';
      patchData.durationSlots = '';
    }
    this.setState({
      patchData
    });
  }

  render() {
    const { handleOpenOverlay } = this.props;
    const isPlaceholder = this.props.service.isPlaceholder;

    // for local transfer show - (US 1936) save and unselect button
    let is_for_update = false;
    if (this.props.isLocalTransferModal) {
      if (this.props.service.serviceBooking) {
        is_for_update = true;
      }
    }
    if (this.props.isToBeEdited && this.props.isToBeEdited === true) {
      is_for_update = true;
    }
    return (
      <div>
        <ReactCSSTransitionGroup transitionName='tour-modal-overlay' transitionAppear transitionAppearTimeout={300} transitionEnterTimeout={500} transitionLeaveTimeout={300}>
          <div className='tour-modal-overlay-bg' onClick={handleOpenOverlay.bind(null, false)}>
            <div className='btn-close exo-colors-text cursor'><i className='mdi-navigation-close' /></div>
          </div>
          <div className='tour-modal-overlay-content'>
            <div className='row mr-0'>
              <div className='col s12'>
                <h4 className='exo-colors-text text-data-1' style={{ fontSize: '24px' }}>{isPlaceholder ? 'Custom' : ''} Transfer</h4>

                <div className='row' style={{ paddingTop: '20px' }}>
                  <div className='col s1' style={{ width: '50px' }} />
                  <div className='col s4'>
                    <div className='input-field'>
                      {
                        !isPlaceholder ?
                          <input id='type' type='text' name='type.description' value={(this.props.service && this.props.service.type && this.props.service.type.description) || ''} disabled />
                        :
                          <Select onChange={this.handleChange} name='placeholder.type'>
                            {this.props.vehicleType.map((theType, index) => <option key={index} value={theType}>{theType}</option>)}
                          </Select>
                      }
                    </div>
                  </div>
                  <div className='col s1' style={{ width: '50px' }}>
                    {
                      !isPlaceholder ?
                        <div className={styles.typeIcon} style={{ fontSize: '30px' }}><TransferIcon typeDescription={this.props.service.type.description} /></div>
                      :
                        <div className={styles.typeIcon}><TransferIcon typeDescription={(this.state.patchData.placeholder && this.state.patchData.placeholder.type) || 'Custom'} /></div>
                    }
                  </div>
                  <div className='col s1' />
                  <div className='col s5'>
                    <div className='input-field'>
                      <input style={{ fontSize: '14px' }} id='price' type='number' name='price.amount' value={(this.state.patchData.price && this.state.patchData.price.amount) || ''} onChange={this.handleChange} />
                      <label style={{ fontSize: '12px' }} htmlFor='price'>Price</label>
                    </div>
                  </div>
                </div>


                <div className='row'>
                  <div className='col s1' style={{ width: '50px' }}>
                    <div className={styles.title} style={{ fontSize: '25px' }}><i className='mdi mdi-car' /> </div>
                  </div>
                  <div className='col s5' style={{ paddingTop: '6px' }}>
                    <span style={{ fontSize: '18px' }}>Vehicle</span>
                  </div>
                  <div className='col s1' style={{ width: '50px' }}>
                    <div className={styles.title} style={{ fontSize: '25px' }}><i className='mdi mdi-directions' /></div>
                  </div>
                  <div className='col s5' style={{ paddingTop: '6px' }}>
                    <span style={{ fontSize: '18px' }}>Route</span>
                  </div>
                </div>

                <div className='row pt-20'>
                  <div className='col s1' style={{ width: '50px' }} />
                  <div className='col s5'>
                    <div className='input-field'>
                      <input style={{ fontSize: '14px' }} type='text' id='vehicleCategory' name='placeholder.vehicleCategory' value={(this.props.service.vehicle && this.props.service.vehicle.category) || (this.state.patchData.placeholder && this.state.patchData.placeholder.vehicleCategory) || ''} onChange={this.handleChange} disabled={!isPlaceholder} />
                      <label style={{ fontSize: '12px' }} htmlFor='vehicleCategory' style={{ fontSize: '12px' }}>Vehicle Category</label>
                    </div>
                  </div>
                  <div className='col s1' style={{ width: '50px' }} />
                  <div className='col s3'>
                    <div className='input-field'>
                      <input style={{ fontSize: '14px' }} type='text' id='from' name='route.from' value={this.state.fromText} onChange={this.handleChange} disabled={!isPlaceholder} />
                      <label style={{ fontSize: '12px' }} htmlFor='from'>From</label>
                    </div>
                  </div>
                  <div className='col s2'>
                    <div className='input-field'>
                      <input style={{ fontSize: '14px' }} type='text' id='to' name='route.to' value={this.state.toText} onChange={this.handleChange} disabled={!isPlaceholder} />
                      <label style={{ fontSize: '12px' }} htmlFor='to'>To</label>
                    </div>
                  </div>
                </div>


                <div className='row pt-20'>
                  <div className='col s1' style={{ width: '50px' }} />
                  <div className='col s5'>
                    <div className='input-field'>
                      <input style={{ fontSize: '14px' }} id='vehicleModel' type='text' name='placeholder.vehicleModel' value={(this.props.service.vehicle && this.props.service.vehicle.model) || (this.state.patchData.placeholder && this.state.patchData.placeholder.vehicleModel) || ''} onChange={this.handleChange} disabled={!isPlaceholder} />
                      <label style={{ fontSize: '12px' }} htmlFor='vehicleModel' style={{ fontSize: '12px' }}>Vehicle Model</label>
                    </div>
                  </div>
                  <div className='col s1' style={{ width: '50px' }} />
                  {
                    this.props.isLocalTransferModal ?
                      <div className='col s3'>
                        <label style={{ fontSize: '12px' }} htmlFor='departureTime'>Travel Time</label>
                        <Select2
                          data={[
                            { id: '', text: '--Select--' },
                            { id: 1, text: 'Morning', disabled: this.props.unavailableSlots.includes('am') },
                            { id: 2, text: 'Afternoon', disabled: this.props.unavailableSlots.includes('pm') },
                            { id: 3, text: 'Evening', disabled: this.props.unavailableSlots.includes('eve') }
                          ]}
                          value={this.state.patchData.startSlot || 1}
                          onSelect={this.handleLocalDeparture}
                        />
                      </div> : <div className='col s3'>
                        <div className='input-field'>
                          {/*
                          <ExoTimePicker
                            time={this.state.timeDeparture}
                            timeMode="12"
                            onTimeChange={this.handleDepartureTimeChange}
                          />
                          */}
                          <input style={{ fontSize: '14px' }} id='departureTime' type='time' name='route.departureTime' value={(this.state.patchData.route && this.state.patchData.route.departureTime) || ''} onChange={this.handleChange} />

                          <label style={{ fontSize: '12px' }} htmlFor='departureTime'>Departure Time</label>
                        </div>
                      </div>
                  }

                  {
                    this.props.isLocalTransferModal ?
                      null : <div className='col s2'>
                        <div className='input-field'>
                          {/*
                          <ExoTimePicker
                            time={this.state.timeArrival}
                            timeMode="12"
                            onTimeChange={this.handleArrivalTimeChange}
                          />
                          */}
                          <input style={{ fontSize: '14px' }} id='arrivalTime' type='time' name='route.arrivalTime' value={(this.state.patchData.route && this.state.patchData.route.arrivalTime) || ''} onChange={this.handleChange} />

                          <label style={{ fontSize: '12px' }} htmlFor='arrivalTime'>Arrival Time</label>
                        </div>
                      </div>
                  }
                </div>

                <div className='row pt-20'>
                  <div className='col s1' style={{ width: '50px' }} />
                  <div className='col s5'>
                    {
                        !isPlaceholder ?
                          <div className='input-field'>
                            <input style={{ fontSize: '14px' }} id='class' type='text' name='placeholder.class' value={(this.props.service.class && this.props.service.class.description) || (this.state.patchData.placeholder && this.state.patchData.placeholder.class) || ''} onChange={this.handleChange} disabled={!isPlaceholder} />
                            <label style={{ fontSize: '12px' }} htmlFor='class'>Class</label>
                          </div>
                        :
                          <Select onChange={this.handleChange} name='placeholder.class'>
                            <option >Choose Class</option>
                            {this.props.vehicleClass.map((theClass, index) => <option key={index} value={theClass.text}>{theClass.text}</option>)}
                          </Select>
                      }
                  </div>
                  <div className='col s1' style={{ width: '50px' }} />
                  <div className='col s3'>
                    <div className='input-field'>
                      <input style={{ fontSize: '14px' }} id='reference' type='text' name='route.refNo' value={(this.state.patchData.route && this.state.patchData.route.refNo) || ''} onChange={this.handleChange} />
                      <label style={{ fontSize: '12px' }} htmlFor='reference'>Reference #</label>
                    </div>
                  </div>
                  <div className='col s2'>
                    <div className='input-field'>
                      <input style={{ fontSize: '14px' }} id='guide' type='text' name='guide' value={(this.props.service.guide && this.props.service.guide.hasGuide) || ''} disabled />
                      <label style={{ fontSize: '12px' }} htmlFor='guide'>With Guide</label>
                    </div>
                  </div>
                </div>

                <div className='row'>
                  <div className='row'>
                    <div className='col s1' style={{ width: '50px', fontSize: '25px' }}>
                      <i className='mdi mdi-file-document' />
                    </div>
                    <div className='col s11'>
                      <div className={styles.title} style={{ fontSize: '18px', paddingTop: '6px' }}>
                         Description
                      </div>
                    </div>
                  </div>
                  <div className='row'>
                    <div className='col s1' style={{ width: '50px' }} />
                    <div className='col s11'>
                      <p>{this.props.service.title}</p>
                      <p>{this.props.service.comment}</p>
                      <p>{this.props.service.descipriton}</p>
                      <div className='input-field'>
                        <textarea style={{ padding: '0px', minHeight: '2.2rem', height: '2rem' }} type='text' id='notes' name='notes' placeholder='Notes' className='materialize-textarea' onChange={this.handleChange} value={this.state.patchData.notes || ''} />
                      </div>

                    </div>
                  </div>
                </div>

              </div>
            </div>
            {
              is_for_update ? (
                <div>
                  <a
                    className='modal-action modal-close waves-effect waves-green btn-flat exo-colors-text btn-select right mt-40'
                    onClick={this.handleUnSelect}
                  >
                    <i className='mdi-action-exit-to-app left' style={{ fontSize: '1.5em' }} />UNSELECT
                  </a>
                  <a
                    className='modal-action modal-close waves-effect waves-green btn-flat exo-colors-text btn-select right mt-40'
                    onClick={this.handleSelect}
                  >
                    <i className='mdi mdi-cloud-upload left' style={{ fontSize: '1.5em' }} />SAVE
                  </a>
                </div>
              ) :
              (
                <a className='modal-action modal-close waves-effect waves-green btn-flat exo-colors-text btn-select right mt-40' onClick={this.handleSelect}><i className='mdi-action-exit-to-app left' style={{ fontSize: '1.5em' }} />Select</a>
              )
            }

          </div>
        </ReactCSSTransitionGroup>
      </div>
    );
  }
}
