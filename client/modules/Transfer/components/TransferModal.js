import React, { Component, PropTypes } from 'react';
import Relay from 'react-relay';
import cx from 'classnames';
import _ from 'lodash';
import PubSub from 'pubsub-js';
import moment from 'moment';
import shortId from 'shortid';
import { Select, Select2, Modal, DateRangePicker } from '../../Utils/components';
import styles from '../style.module.scss';
import TransferPlacement from './TransferPlacementHoverable';
import TransferSelection from './TransferSelection';
import UpdateTransferPlacementMutation from '../mutations/Update';
import TransferOverlay from './TransferOverlay/TransferOverlay';
import TransferPlaceholderSelection from './TransferPlaceholderSelection';

export default class TransferModal extends Component {
  static propTypes = {
    isModalOpened: PropTypes.bool.isRequired,
    changeModalState: PropTypes.func.isRequired,
    viewer: PropTypes.object,
    relay: PropTypes.object,
    transferPlacement: PropTypes.object,
    city: PropTypes.object,
    selectedTransfers: PropTypes.array,
    origin: PropTypes.string,
    destination: PropTypes.string
  };

  constructor(props) {
    super(props);
    this.state = {
      selectedTransfersArray: [],
      selectedTransfersArrayOptedKey: 0,
      selectedTransfers: props.selectedTransfers,
      isOverlayOpened: false,
      isToBeEdited: false,
      filters: {
        Car: true,
        Taxi: true,
        Van: true,
        Train: true,
        Bus: true,
        Boat: true,
        'Public transport': true,
        Plane: true,
        Helicopter: true,
        'Multi-vehicle': true,
        Other: true,
      },
      origin: props.origin,
      destination: props.destination,
      filterClass: [],
      uniqueLocationsList: [],
      originCityName: '',
      destinationCityName: '',
      filterGuide: [],
      originCity: '',
      destinationCity: props.destination,
      manualDurationDays: 1,
      manualDurationStartDate: false,
      manualDurationEndDate: false,
      transferStartDate: '',
      transferEndDate: '',
      unavailableSlots: []
    };
  }


  componentWillMount() {
    const locationList = [];

    _.each(this.props.viewer.location, (ul) => {
      locationList.push(ul);
      if (ul.type === 'city' && ul.airports && ul.airports.length > 0) {
        _.each(ul.airports, (airport) => {
          if (typeof airport.name !== 'undefined' && airport.name != null) {
            const newLocation = {
              tpCode: airport.code,
              name: `${airport.name} Airport`,
              country: `${ul.name} , ${ul.country}`,
              type: ul.type
            };
            locationList.push(newLocation);
          }
        });
      }
    });
    const uniqueLocationsList = _.uniqBy(locationList, 'tpCode');
    this.setState({ uniqueLocationsList });
    if (this.props.isTripDeparture) {
      this.setState({ origin: this.state.destinationCity, destination: this.state.destinationCity });
    }
    // show transfer in green div in case of action button "change local transfer"
    if (this.props.isLocalTransferModal === true && this.props.localtransfer_change_opted_transfer_key !== false && this.props.localtransfer_change_opted_transfer_key !== '') {
      const change_opted_transfer_key = this.props.localtransfer_change_opted_transfer_key;
      const accessibleTransfers = [...this.props.viewer.accessibleTransfers];
      let toShowTransfer = false;
      _.forEach(accessibleTransfers, (value) => {
        if (value._key && value._key === change_opted_transfer_key) {
          toShowTransfer = value;
        }
      });
      if (toShowTransfer !== false) {
        const aa = [];
        aa.push(toShowTransfer);
        const bb = [];
        bb.push(aa);
        this.setState({
          selectedTransfersArray: bb
        });
      }
    }

    // to show existing transfers when change transfer is cliked
    if (this.state.selectedTransfersArray.length === 0 && this.props.selectedTransfers && this.props.selectedTransfers.length > 0) {
      const aa = [];
      aa.push(this.props.selectedTransfers);
      this.setState({
        selectedTransfersArray: aa
      });
    }
    //------


    // start manipulate transfer start date
    let transferStartDate = '';
    let unavailableSlots = [];
    const isLocalTransferModal = this.props.isLocalTransferModal || false;
    const isTripArrival = this.props.isTripArrival || false;
    const isTripDeparture = this.props.isTripDeparture || false;
    if (isLocalTransferModal) {
      if (this.props.optedDayIdForLocalTransfer && this.props.city && this.props.city.cityDays) {
        this.props.city.cityDays.map((ccd, ii) => { // eslint-disable-line array-callback-return
          if (ccd._key === this.props.optedDayIdForLocalTransfer) {
            transferStartDate = ccd.startDate;
            unavailableSlots = ccd.unavailableSlots || [];
          }
        });
      }
    } else if (isTripArrival === false && isTripDeparture === false) {
      let transfer_start_date = '';
      if (this.props.completeTransferPlacement && this.props.completeTransferPlacement.startDate) {
        const cDD = this.props.completeTransferPlacement.startDate;
        if (cDD !== null && cDD !== '') {
          transfer_start_date = cDD;
        }
      }

      if (transfer_start_date === '') {
        transfer_start_date = this.props.city.startDate;
        if (transfer_start_date === null || transfer_start_date === '' && this.props.city.cityDays && this.props.city.cityDays.length > 0) { // eslint-disable-line no-mixed-operators
          if (this.props.city.cityDays[0] && this.props.city.cityDays[0].startDate) {
            transfer_start_date = this.props.city.cityDays[0].startDate;
          }
        }
      }
      transferStartDate = moment(transfer_start_date).format('YYYY-MM-DD');
    } else if (isTripArrival) {
      transferStartDate = this.props.tripStartDate || '';
    }


    let manualDurationDays = 1;
    let transferEndDate = '';
    if (this.props.completeTransferPlacement && this.props.completeTransferPlacement.durationDays) {
      const mDD = this.props.completeTransferPlacement.durationDays;
      if (mDD !== null && mDD !== '' && mDD > 0) {
        manualDurationDays = mDD;
      }

      if (manualDurationDays > 0) {
        transferEndDate = moment(transferStartDate, 'YYYY-MM-DD').add(manualDurationDays - 1, 'days').format('YYYY-MM-DD');
      }
    }

    this.setState({
      transferStartDate,
      unavailableSlots,
      manualDurationDays,
      transferEndDate
    });

    // end manipulate transfer start date
  }

  handleChangeRelayVariable = (e) => {
    this.props.relay.setVariables({
      [e.target.name]: e.target.value
    });
    this.setState({ [e.target.name]: e.target.value });
  };

  handleChangeOriginCity(e) {
    const aa = Select2.getSelect2Values(e.currentTarget);
    this.setState({ originCity: aa[0] });
  }

  handleChangeOrigin(e) {
    // this.origin = [...e.target.options].filter(country => country.selected).map(country => country.value);
    const aa = Select2.getSelect2Values(e.currentTarget);
    this.setState({ origin: aa[0] });
    // this.setState({origin:this.origin});
    // const temp = this.state.uniqueLocationsList;
    // const list = temp.filter(l => (l.tpCode === this.state.origin[0]));
    // this.setState({ originCityName: list[0].name });
    const reqVariables = {
      origin: this.state.origin,
      destination: this.state.destination,
      dateFrom: this.state.transferStartDate
    };
    this.props.relay.setVariables(reqVariables);
  }
  handleChangeDestination(e) {
    // this.origin = [...e.target.options].filter(country => country.selected).map(country => country.value);
    const aa = Select2.getSelect2Values(e.currentTarget);
    this.setState({ destination: aa[0] });
    // this.setState({origin:this.origin});
    // const temp = this.state.uniqueLocationsList;
    // const list = temp.filter(l => (l.tpCode === this.state.destination[0]));
    // this.setState({ destinationCityName: list[0].name });
    const reqVariables = {
      origin: this.state.origin,
      destination: this.state.destination,
      dateFrom: this.state.transferStartDate
    };
    this.props.relay.setVariables(reqVariables);
  }

  handleClickFilter = (e, name) => {
    let filters = this.state.filters;
    let check_all_true = true;
    _.mapValues(filters, (o) => {
      if (o === false) {
        check_all_true = false;
      }
    });
    if (check_all_true === true) { // means previously all are selected i.e all are true
      filters = _.mapValues(filters, false);
    }
    filters[name] = !filters[name];
    this.setState({ filters });
  }

  // this will delete the currentlly opted tab
  handleDeleteTab = () => {
    const existingTransfersArray = this.state.selectedTransfersArray;
    existingTransfersArray.splice(this.state.selectedTransfersArrayOptedKey, 1);
    this.setState({
      selectedTransfersArray: existingTransfersArray,
      selectedTransfersArrayOptedKey: 0 // reset opted key to first tab
    });
  }

  // this will create new option which will be duplicate of the currently selected
  handleDuplicateNewOption = () => {
    const existingTransfersArray = this.state.selectedTransfersArray;
    existingTransfersArray.push(existingTransfersArray[this.state.selectedTransfersArrayOptedKey]);
    this.setState({
      selectedTransfersArray: existingTransfersArray
    });
  }

  handleFilter = (e) => {
    this.setState({ [e.target.name]: Select2.getSelect2Values(e.currentTarget) });
  };

  handleOpenOverlay = (isOpen, service, isToBeEdited = false, e) => {
    if (e) e.stopPropagation();
    const modal = $('.tour-modal');
    modal.toggleClass('hide-scrollbar');
    modal.scrollTop(0);
    //
    this.setState({ isOverlayOpened: isOpen, service: _.cloneDeep(service), isToBeEdited });
  };

  handleSaveFromOverlay = (selected) => {
    this.selectTransfer(selected);
  };


  handleSaveTransferPlacement = () => {
    const { id, _key, durationDays } = this.props.transferPlacement;
    // Relay.Store.commitUpdate(new UpdateTransferPlacementMutation({
    //   transferPlacementId: id,
    //   transferPlacementKey: _key,
    //   selectedTransferKeys: this.state.selectedTransfers.map(transfer => transfer._key),
    //   serviceBookingData: this.state.selectedTransfers.map(transfer => { if (transfer._key.substring(0, 4) !== 'sBK_') return transfer.serviceBooking; return {}; }),
    //   durationDays
    // }));

    const isLocalTransferModal = this.props.isLocalTransferModal || false;

    // since selectedTransfers is changed to selectedTransfersArray
    if (this.state.selectedTransfersArray.length === 0) {
      alert('Empty Transfers. Plz select transfers!!');
    } else {
      // start - this is for long distance transfer placement
      const durationDays = this.state.manualDurationDays;
      // end - this is for long distance transfer placement

      if (isLocalTransferModal) { // eslint-disable-line no-lonely-if
        const d_selectedTransferKeys = [];
        _.forEach(this.state.selectedTransfersArray, (d_transfers) => {
          _.forEach(d_transfers, (transfer) => {
            d_selectedTransferKeys.push(transfer._key);
          });
        });

        const d_serviceBookingData = [];
        _.forEach(this.state.selectedTransfersArray, (d_transfers) => {
          _.forEach(d_transfers, (transfer) => {
            if (transfer._key.substring(0, 4) !== 'sBK_') {
              const d_n = transfer.serviceBooking;
              // start - default pick and drop off -
              d_n.pickUp = {
                time: '',
                location: 'Hotel lobby',
                remarks: ''
              };
              d_n.dropOff = {
                time: '',
                location: 'Hotel lobby',
                remarks: ''
              };
              // end - default pick and drop off -
              d_serviceBookingData.push(d_n);
            }
          });
        });

        Relay.Store.commitUpdate(new UpdateTransferPlacementMutation({
          isLocaltransfer: true,
          proposalKey: this.props.proposalKey,
          n_city_key: this.props.city._key,
          n_day_id: this.props.optedDayIdForLocalTransfer,
          n_remove_local_transferPlacementKey: this.props.remove_local_transferPlacementKey,
          transferPlacementId: id,
          transferPlacementKey: _key,
          selectedTransferKeys: d_selectedTransferKeys,
          serviceBookingData: d_serviceBookingData,
          durationDays,
          startDate: this.state.transferStartDate
        }), {
          onSuccess: (response) => {
            this.props.onSuccessSave(response);
            PubSub.publish('TripForceFetch', {});
          },
          onFailure: (response) => {
            this.props.onFailureSave(response);
            PubSub.publish('TripForceFetch', {});
          }

        });
      } else {
        Relay.Store.commitUpdate(new UpdateTransferPlacementMutation({
          isLocaltransfer: false,
          proposalKey: this.props.proposalKey,
          n_city_key: '',
          n_day_id: '',
          n_remove_local_transferPlacementKey: '',
          transferPlacementId: id,
          transferPlacementKey: _key,
          selectedTransferKeys: this.state.selectedTransfersArray[0].map(transfer => transfer._key),
          serviceBookingData: this.state.selectedTransfersArray[0].map((transfer) => {
            if (transfer._key.substring(0, 4) !== 'sBK_' && transfer && transfer.serviceBooking) {
              const d_n = transfer.serviceBooking;
              // start - default pick and drop off -
              d_n.pickUp = {
                time: '',
                location: 'Hotel lobby',
                remarks: ''
              };
              d_n.dropOff = {
                time: '',
                location: 'Hotel lobby',
                remarks: ''
              };
              // end - default pick and drop off -
              return d_n;
            } else { // eslint-disable-line no-else-return
              return {};
            }
          }),
          durationDays,
          startDate: this.state.transferStartDate
        }), {
          onSuccess: (response) => {
            // PubSub.publish('TripForceFetch', {});
            // start open infobox when transfer is added
            PubSub.publish('Infobox', { type: 'clear' });

            const d_transferInfoboxData = {
              tpBookingRef: '',
              transferPlacementId: response.updateTransferPlacement.transferPlacement.id,
              type: 'transfer'
            };
            PubSub.publish('Infobox', d_transferInfoboxData);
            PubSub.publish('TripForceFetch', {});
            // end open infobox when transfer is added
          },
        });
      }
    }
  };

  // this will select tab
  handleSelectTabOption = (optedTab) => {
    this.setState({
      selectedTransfersArrayOptedKey: optedTab
    });
  }

  handleUnSelectFromOverlay = (selected) => {
    const transferKeyToRemove = selected._key;
    const optedKey = this.state.selectedTransfersArrayOptedKey;
    const new_selectedKey_transfers = _.remove(this.state.selectedTransfersArray[optedKey], { _key: transferKeyToRemove });
    this.setState({
      selectedTransfersArray: this.state.selectedTransfersArray
    });
  }

  isAllSelected = () => {
    for (const key in this.state.filters) { // eslint-disable-line no-restricted-syntax
      if (!this.state.filters[key]) return false;
    }
    return true;
  };

  leftClickHandler = (order) => {
    if (order === 0) return;
    // new code, since now it selected transfers is a multidimensional array
    const optedKey = this.state.selectedTransfersArrayOptedKey;
    const selectedTransfers = this.state.selectedTransfersArray[optedKey];
    const temp = selectedTransfers[order - 1];
    selectedTransfers[order - 1] = selectedTransfers[order];
    selectedTransfers[order] = temp;

    // old code
    // const selectedTransfers = Object.assign([], this.state.selectedTransfers);
    // const temp = selectedTransfers[order - 1];
    // selectedTransfers[order - 1] = selectedTransfers[order];
    // selectedTransfers[order] = temp;
    this.setState({ selectedTransfers });
  };

  rightClickHandler = (order) => {
    const optedKey = this.state.selectedTransfersArrayOptedKey;
    const selectedTransfers = this.state.selectedTransfersArray[optedKey];

    if (order === (selectedTransfers.length - 1)) return;
    // new code, since now it selected transfers is a multidimensional array

    const temp = selectedTransfers[order + 1];
    selectedTransfers[order + 1] = selectedTransfers[order];
    selectedTransfers[order] = temp;

    // old code
    // const selectedTransfers = Object.assign([], this.state.selectedTransfers);
    // const temp = selectedTransfers[order + 1];
    // selectedTransfers[order + 1] = selectedTransfers[order];
    // selectedTransfers[order] = temp;
    this.setState({ selectedTransfers });
  };

  removeClickHandler = (order) => {
    const selectedTransfers = Object.assign([], this.state.selectedTransfers);
    selectedTransfers.splice(order, 1);
    this.setState({ selectedTransfers });
  };

  resetFilter = () => {
    const filters = {
      Car: true,
      Taxi: true,
      Van: true,
      Train: true,
      Bus: true,
      Boat: true,
      'Public transport': true,
      Plane: true,
      Helicopter: true,
      'Multi-vehicle': true,
      Other: true,
    };

    this.setState({
      filters
    });
  }


  selectTransfer = (obj) => {
    const isLocalTransferModal = this.props.isLocalTransferModal || false;

    const objKey = obj._key;
    const optedKey = this.state.selectedTransfersArrayOptedKey;
    let existingTransfersArray = this.state.selectedTransfersArray;
    const selectedTabTransfers = [];
    if (existingTransfersArray.length > 0) {
      if (existingTransfersArray[optedKey]) {
        if (isLocalTransferModal) {
          existingTransfersArray[this.state.selectedTransfersArrayOptedKey] = [];
          existingTransfersArray[this.state.selectedTransfersArrayOptedKey].push(obj);
        } else {
          existingTransfersArray[optedKey].push(obj);
          // to remove which is added in rest other then opted
          let new_existingTransfersArray = [];
          new_existingTransfersArray = existingTransfersArray.map((obj, i) => { // eslint-disable-line no-shadow
            if (i == optedKey) { // eslint-disable-line eqeqeq
              if (this.state.isToBeEdited === true) {
                return obj.slice(0, -1);
              } else { // eslint-disable-line no-else-return
                return obj;
              }
            } else if (objKey === obj[obj.length - 1]._key) {
              return obj.slice(0, -1);
            }
            return obj;
          });
          existingTransfersArray = new_existingTransfersArray;
        }
      }
    } else {
      selectedTabTransfers.push(obj);
      existingTransfersArray[this.state.selectedTransfersArrayOptedKey] = selectedTabTransfers;
    }
    this.setState({
      selectedTransfersArray: existingTransfersArray
    });


    // start check if it is custom transfer then directly save the treansfer when overlay is select
    if (obj.isPlaceholder) {
      // this.handleSaveTransferPlacement();
      // this.props.changeModalState(false);
    }
    // end check if it is custom transfer then directly save the treansfer when overlay is select
  };


  onDateChange = (startDate, endDate) => {
    let transferStartDate = startDate;

    // Don't allow user to change the new start date.
    // TODO for now we ignore the new start date, need to disable changing the start date in UI in future.
    if (this.state.transferStartDate && this.state.transferStartDate !== '') {
      transferStartDate = moment(this.state.transferStartDate, 'YYYY-MM-DD');
    }
    const dayDiff = endDate.diff(transferStartDate, 'day') + 1;
    this.setState({
      manualDurationDays: dayDiff,
      manualDurationStartDate: transferStartDate,
      manualDurationEndDate: endDate,
      transferStartDate: transferStartDate.format('YYYY-MM-DD'),
      transferEndDate: endDate.format('YYYY-MM-DD')
    });
  };

  render() {
    const vehicleClassList = [
      { id: 'Economy', text: 'Economy' },
      { id: '2nd', text: '2nd' },
      { id: 'Business', text: 'Business' },
      { id: '1st', text: '1st' },
    ];

    // trip arrival and departure
    let isTripArrival = false;
    let isTripDeparture = false;
    if (this.props.isTripArrival) {
      isTripArrival = this.props.isTripArrival;
    }
    if (this.props.isTripDeparture) {
      isTripDeparture = this.props.isTripDeparture;
    }


    const isLocalTransferModal = this.props.isLocalTransferModal || false;

    let detailsOrigin = '';
    let detailsDestination = '';

    const disableFiltersFrom = false;
    const disableFiltersTo = false;
    if (isLocalTransferModal || isTripArrival) {
      // disableFiltersFrom = true;
      // disableFiltersTo = true;
    }
    if (isTripArrival === true || isTripDeparture === true) {
      detailsOrigin = '';
      detailsDestination = '';
    } else {
      detailsOrigin = (<span className='fs-16 fw-600'>{isLocalTransferModal ? `${this.props.city.location.name}, ${this.props.city.location.tpCode}`
      : `${this.props.city.transferPlacements.fromCity.name}, ${this.props.city.transferPlacements.fromCity.country}`}</span>);

      detailsDestination = (<span className='fs-16 fw-600'>{isLocalTransferModal ? `${this.props.city.location.name}, ${this.props.city.location.tpCode}`
      : `${this.props.city.transferPlacements.toCity.name}, ${this.props.city.transferPlacements.toCity.country}`}</span>);
    }

    const saveTransferButton = <a className='modal-action modal-close waves-effect waves-green btn-flat exo-colors-text modal-action-button' onClick={this.handleSaveTransferPlacement}><i className='mdi mdi-cloud-upload left' style={{ fontSize: '1.5em' }} />Save</a>;
    // save button will be only displayed if has opted transfers
    // if( this.state.selectedTransfersArray.length == 0 ){
      // saveTransferButton = ""
    // }

    const cancelTransferButton = <a className='modal-action modal-close waves-effect waves-red btn-flat exo-colors-text ml-10 modal-action-button'><i className='mdi mdi-close left' style={{ fontSize: '1.5em' }} />Cancel</a>;
    const { filters } = this.state;
    const { city, viewer } = this.props;

    // added to cover error scenerio with trip arrival and departure
    let city_fromCity = '';
    if (city && city.transferPlacements && city.transferPlacements.fromCity && city.transferPlacements.fromCity.country) {
      city_fromCity = city.transferPlacements.fromCity.country;
    }
    let city_startDate = '';
    if (city && city.startDate) {
      city_startDate = city.startDate;
    }


    const datesToshow = '';

    const accessibleTransfers = [...this.props.viewer.accessibleTransfers];

    // origin filter
    Object.getPrototypeOf(accessibleTransfers).filterOrigin = function filterGuide(origin) {
      if (origin.length === 0) return this;

      const finalArray = [];
      for (let x = 0; x < this.length; x++) {
        if (_.includes(origin, this[x].route.from.cityName)) finalArray.push(this[x]);
      }
      return finalArray;
    };
    // origin filter
    Object.getPrototypeOf(accessibleTransfers).filterDestination = function filterGuide(destination) {
      if (destination.length === 0) return this;

      const finalArray = [];
      for (let x = 0; x < this.length; x++) {
        if (_.includes(destination, this[x].route.to.cityName)) finalArray.push(this[x]);
      }
      return finalArray;
    };
    // Add filter type chainable method
    Object.getPrototypeOf(accessibleTransfers).filterType = function filterType(filterState) {
      const finalArray = [];
      for (let x = 0; x < this.length; x++) {
        if (filterState[this[x].type.description] || this[x].type.description === null) finalArray.push(this[x]);
      }
      return finalArray;
    };

    // Add filter class method
    Object.getPrototypeOf(accessibleTransfers).filterClass = function filterClass(classes) {
      if (classes.length === 0) return this;

      const finalArray = [];
      for (let x = 0; x < this.length; x++) {
        if (_.includes(classes, this[x].class.description)) finalArray.push(this[x]);
      }
      return finalArray;
    };

    // Add filter guide method
    Object.getPrototypeOf(accessibleTransfers).filterGuide = function filterGuide(guides) {
      if (guides.length === 0) return this;

      const finalArray = [];
      for (let x = 0; x < this.length; x++) {
        if (_.includes(guides, this[x].guideLanguage)) finalArray.push(this[x]);
      }
      return finalArray;
    };

    // show option of remove or create duplicate
    let removeAndCreateDuplicate = '';


    if (this.state.selectedTransfersArray.length > 0) {
      removeAndCreateDuplicate = (<div>
        <div style={{ float: 'left', width: '50%', textAlign: 'left', paddingLeft: '20px' }}>
          {datesToshow}
        </div>

        {/*
          no need of duplicates righ now. uncomment this line when needed US - 2177
          <div style={{ float: 'right', width: '50%', textAlign: 'right', paddingRight: '20px' }}>
            <a onClick={this.handleDeleteTab} style={{ marginLeft: '20px', cursor: 'pointer' }} >
              <i className='mdi mdi-minus' /> REMOVE OPTION
            </a>
            <a onClick={this.handleDuplicateNewOption} style={{ marginLeft: '20px', cursor: 'pointer' }} >
              <i className='mdi mdi-pin' /> DUPLICATE AS NEW OPTION
            </a>
          </div>
         */}
        <div style={{ clear: 'both' }} />
      </div>);
    }

    let modalWindowHeaderText = 'Add Transfer';
    if (isTripArrival === true) {
      modalWindowHeaderText = 'Add Trip Arrival';
    }

    // ////////final dates manipulations////////////////
    let finalDatesToShow = null;
    let dateRangeValue = null;
    if (this.state.transferStartDate && this.state.transferStartDate !== '') {
      const transferStartDate = moment(this.state.transferStartDate, 'YYYY-MM-DD');
      const transferEndDate = !this.state.transferEndDate || this.state.transferEndDate === '' ? moment(this.state.transferStartDate, 'YYYY-MM-DD') : moment(this.state.transferEndDate, 'YYYY-MM-DD');
      finalDatesToShow = <span className='exo-colors-text text-data-1 pr-20'>{transferStartDate.format('MMM DD')} - {transferEndDate.format('MMM DD')}, <b>{this.state.manualDurationDays}</b> Days </span>;
      dateRangeValue = moment.range(transferStartDate, transferEndDate);
    }

    const editDateButton = <i className='mdi mdi-pencil' />;
    const changeDurationDiv = (<div className='pt-5'>
      <span className='exo-colors-text text-label-1'>Duration</span><br />
      <i className='mdi mdi-calendar mr-5' />
      {finalDatesToShow}
      { isLocalTransferModal === false && this.state.selectedTransfersArray.length > 0 ?
        <span className='exo-colors-text' style={{ textAlign: 'left' }}>
          <DateRangePicker triggerButton={editDateButton} onDateChange={this.onDateChange} singleDateRange value={dateRangeValue} />
        </span> : null
      }
    </div>);
    // end change duration structure

    // start put back airport as a city
    const rawLocations = [];

    _.each(viewer.location, (ul) => {
      rawLocations.push(ul);
      if (ul.type === 'city' && ul.airports && ul.airports.length > 0) {
        _.each(ul.airports, (airport) => {
          if (typeof airport.name !== 'undefined' && airport.name != null) {
            const newLocation = {
              tpCode: airport.code,
              name: `${`${airport.name} Airport` + ', '}${airport.code}`, // eslint-disable-line no-useless-concat
              country: `${ul.name} , ${ul.country}`,
              type: ul.type
            };
            rawLocations.push(newLocation);
          }
        });
      }
    });
    let uniqueLocations;
    // end put back airport as a city
    // filer exo destination location
    const exoDest = [];

    _.each(viewer.location, (ul) => {
      if (ul.type === 'city' && ul.isEXODestination) {
        if (ul.airports && ul.airports.length > 0) {
          ul.airports.map((air) => {  // eslint-disable-line array-callback-return
            if (air.code) {
              ul.airportsCodeManual = air.code; // eslint-disable-line no-param-reassign
              exoDest.push(ul);
            }
          });
        } else {
          exoDest.push(ul);
        }
      }
    });
    // let  uniqueLocations = _.uniqBy(viewer.location, 'tpCode'); // ono tpcode basis
    if (isTripArrival || isTripDeparture) {
      uniqueLocations = _.uniqBy(rawLocations, 'tpCode');
    } else {
      uniqueLocations = _.uniqBy(exoDest, 'tpCode');
    }

    let default_from_text = '';
    let default_to_text = '';
    if (isLocalTransferModal && this.props.city && this.props.city.location) { // for local transfer
      default_from_text = this.props.city.location.name;
      if (this.props.city.location.country) {
        default_from_text += `, ${this.props.city.location.country}`;
      }
      default_to_text = default_from_text; // from and to are same since this is for local transfer
    }

    if (isTripArrival === true) {
      detailsDestination = (<div style={{ width: '25%' }}><Select2
        name='destinationCity'
        value={this.state.destinationCity}
        disabled={disableFiltersFrom}
        data={uniqueLocations.filter(l => (l.type === 'city' && l.tpCode !== null)).sort((a, b) => {
          if (a.name < b.name) return -1;
          if (a.name > b.name) return 1;
          return 0;
        }).map((obj) => {
          let airportsCode = '';
          if (obj.airportsCodeManual && obj.airportsCodeManual !== '') {
            airportsCode = `, (${obj.airportsCodeManual})`;
          }
          return ({ id: obj.tpCode, text: `${obj.name}, ${obj.country} ${airportsCode}` });
        })}
      /></div>);
    }

    return (

      <Modal className='tour-modal exo-colors modal-bgr1' actionButton={saveTransferButton} cancelButton={cancelTransferButton} isModalOpened={this.props.isModalOpened} changeModalState={this.props.changeModalState} dismissible={false}>

        <div className={cx('exo-colors modal-bgr1 exo-colors-text text-data-1 valign-wrapper', styles.transferHeader)}>
          <span className='fs-26 fw-600 pr-20'>{modalWindowHeaderText}</span>
          {
            isTripArrival ?
              <div style={{ width: '25%' }}><Select2
                name='originCity'
                value={this.state.originCity}
                onSelect={this.handleChangeOriginCity.bind(this)}
                disabled={isLocalTransferModal}
                data={uniqueLocations.filter(l => (l.type === 'city' && l.tpCode !== null)).sort((a, b) => {
                  if (a.name < b.name) return -1;
                  if (a.name > b.name) return 1;
                  return 0;
                }).map((obj) => {
                  let airportsCode = '';
                  if (obj.airportsCodeManual && obj.airportsCodeManual !== '') {
                    airportsCode = `, (${obj.airportsCodeManual})`;
                  }
                  return ({ id: obj.tpCode, text: `${obj.name}, ${obj.country} ${airportsCode}` });
                })}
              /></div>
            : detailsOrigin
          }
          {
            isTripDeparture ?
              <div style={{ width: '25%' }}><Select2
                name='originCity'
                value={this.state.destinationCity}
                onSelect={this.handleChangeOriginCity.bind(this)}
                disabled={isLocalTransferModal}
                data={uniqueLocations.filter(l => (l.type === 'city' && l.tpCode !== null)).sort((a, b) => {
                  if (a.name < b.name) return -1;
                  if (a.name > b.name) return 1;
                  return 0;
                }).map((obj) => {
                  let airportsCode = '';
                  if (obj.airportsCodeManual && obj.airportsCodeManual !== '') {
                    airportsCode = `, (${obj.airportsCodeManual})`;
                  }
                  return ({ id: obj.tpCode, text: `${obj.name}, ${obj.country} ${airportsCode}` });
                })}
              /></div>
          : null
          }
          <i className='mdi mdi-ray-start-end small green-text pl-10 pr-10' />
          {
            isTripDeparture ?
              <div style={{ width: '25%' }}><Select2
                name='destinationCity'
                value=''
                disabled={isLocalTransferModal}
                data={uniqueLocations.filter(l => (l.type === 'city' && l.tpCode !== null)).sort((a, b) => {
                  if (a.name < b.name) return -1;
                  if (a.name > b.name) return 1;
                  return 0;
                }).map((obj) => {
                  let airportsCode = '';
                  if (obj.airportsCodeManual && obj.airportsCodeManual !== '') {
                    airportsCode = `, (${obj.airportsCodeManual})`;
                  }
                  return ({ id: obj.tpCode, text: `${obj.name}, ${obj.country} ${airportsCode}` });
                })}
              /></div>
            : detailsDestination
          }
        </div>

        <div className={styles.accommodationModalFilter}>
          <div className='row m-0'>
            <div className='col s1 pt-10'>
              <span className='fs-16 fw-600'>Route</span>
            </div>
            <div className='col s3'>
              <div className={styles.destinationFilter}>
                <span className='p-0 m-0'>From</span>
                {/* TODO:: When using locations object in cityBookings, change static country*/}
                <Select2
                  name='origin'
                  value={this.state.origin}
                  // onChange={this.handleChange.bind(this)}
                  onSelect={this.handleChangeOrigin.bind(this)}
                  disabled={disableFiltersFrom}
                  data={uniqueLocations.filter(l => (l.type === 'city' && l.tpCode !== null)).sort((a, b) => {
                    if (a.name < b.name) return -1;
                    if (a.name > b.name) return 1;
                    return 0;
                  }).map((obj) => {
                    const airportsCode = '';
                    // no need in from
                    // if (obj.airportsCodeManual && obj.airportsCodeManual !== '') {
                    //   airportsCode = `, (${obj.airportsCodeManual})`;
                    // }
                    return ({ id: obj.tpCode, text: `${obj.name}, ${obj.country} ${airportsCode}` });
                  })}
                />
              </div>
            </div>
            <div className='col s3'>
              <div className={styles.destinationFilter}>
                <span className='p-0 m-0'>To</span>
                <Select2
                  name='destination'
                  value={this.state.destination}
                  onSelect={this.handleChangeDestination.bind(this)}
                  disabled={disableFiltersFrom}
                  data={uniqueLocations.filter(l => (l.type === 'city' && l.tpCode !== null)).sort((a, b) => {
                    if (a.name < b.name) return -1;
                    if (a.name > b.name) return 1;
                    return 0;
                  }).map((obj) => {
                    const airportsCode = '';
                    // no need in to
                    // if (obj.airportsCodeManual && obj.airportsCodeManual !== '') {
                    //   airportsCode = `, (${obj.airportsCodeManual})`;
                    // }
                    return ({ id: obj.tpCode, text: `${obj.name}, ${obj.country} ${airportsCode}` });
                  })}
                />
              </div>
            </div>
          </div>
          <div className='row m-0'>
            <div className='col s1 pt-10'>
              <span className='fs-16 fw-600'>Type</span>
            </div>
            <div className='col s10 p-0 valign-wrapper fs-12'>
              <div className={cx('pr-10', styles.selectAll, { [`${styles.active}`]: this.isAllSelected() })} style={{ borderRight: '1px solid #cccccc' }}>
                <a onClick={this.resetFilter}>  All </a>
              </div>
              <div className={cx(styles.typeBlock, { [`${styles.active}`]: filters.Car })}>
                <a onClick={e => this.handleClickFilter(e, 'Car')} name='Car' style={{ fontSize: '12px' }} ><i className='mdi mdi-car' style={{ fontSize: '20px' }} /> Car / Limo</a>
              </div>
              <div className={cx(styles.typeBlock, { [`${styles.active}`]: filters.Van })}>
                <a onClick={e => this.handleClickFilter(e, 'Van')} name='Van' style={{ fontSize: '12px' }} ><i className='mdi mdi-truck' style={{ fontSize: '20px' }} />Van</a>
              </div>
              <div className={cx(styles.typeBlock, { [`${styles.active}`]: filters.Bus })}>
                <a onClick={e => this.handleClickFilter(e, 'Bus')} name='Bus' style={{ fontSize: '12px' }} ><i className='mdi mdi-bus' style={{ fontSize: '20px' }} /> Bus</a>
              </div>
              <div className={cx(styles.typeBlock, { [`${styles.active}`]: filters['Public transport'] })}>
                <a onClick={e => this.handleClickFilter(e, 'Public transport')} name='Public transport' style={{ fontSize: '12px' }} ><i className='mdi mdi-tram' style={{ fontSize: '20px' }} /> Public transport</a>
              </div>
              <div className={cx(styles.typeBlock, { [`${styles.active}`]: filters.Plane })}>
                <a onClick={e => this.handleClickFilter(e, 'Plane')} name='Plane' style={{ fontSize: '12px' }}><i className='mdi mdi-airplane' style={{ fontSize: '20px' }} /> Plane</a>
              </div>
              <div className={cx(styles.typeBlock, { [`${styles.active}`]: filters.Taxi })}>
                <a onClick={e => this.handleClickFilter(e, 'Taxi')} name='Taxi' style={{ fontSize: '12px' }}><i className='mdi mdi-car' style={{ fontSize: '20px' }} /> Taxi</a>
              </div>
              <div className={cx(styles.typeBlock, { [`${styles.active}`]: filters.Train })}>
                <a onClick={e => this.handleClickFilter(e, 'Train')} name='Train' style={{ fontSize: '12px' }} ><i className='mdi mdi-train' style={{ fontSize: '20px' }} /> Train</a>
              </div>
              <div className={cx(styles.typeBlock, { [`${styles.active}`]: filters.Boat })}>
                <a onClick={e => this.handleClickFilter(e, 'Boat')} name='Boat' style={{ fontSize: '12px' }} ><i className='mdi mdi-ferry' style={{ fontSize: '20px' }} /> Boat</a>
              </div>
              <div className={cx(styles.typeBlock, { [`${styles.active}`]: filters.Helicopter })}>
                <a onClick={e => this.handleClickFilter(e, 'Helicopter')} name='Helicopter' style={{ fontSize: '12px' }} ><i className='mdi mdi-fan' style={{ fontSize: '20px' }} /> Helicopter</a>
              </div>
              <div className={cx(styles.typeBlock, { [`${styles.active}`]: filters['Multi-vehicle'] })}>
                <a onClick={e => this.handleClickFilter(e, 'Multi-vehicle')} name='Multi-vehicle' style={{ fontSize: '12px' }}><i className='mdi mdi-jeepney' style={{ fontSize: '20px' }} />Multi-Vehicle</a>
              </div>
              <div className={cx(styles.typeBlock, { [`${styles.active}`]: filters.Other })}>
                <a onClick={e => this.handleClickFilter(e, 'Other')} name='Other' style={{ fontSize: '12px' }}><i className='mdi mdi-label-outline' style={{ fontSize: '20px' }} /> Other</a>
              </div>
            </div>
          </div>
          <div className='row m-0'>
            <div className='col s1 p-0'>
              <span className='fs-16 fw-600'>Class</span>
            </div>
            <div className='col s4 p-0'>
              <Select2
                multiple
                data={vehicleClassList}
                value={this.state.filterClass}
                onSelect={this.handleFilter}
                onUnselect={this.handleFilter}
                name='filterClass'
              />
            </div>
            <div className='col offset-s1 s1 p-0'>
              <span className='fs-16 fw-600'>Guide</span>
            </div>
            <div className='col s4 p-0'>
              <Select2
                multiple
                data={[
                  { id: 'English', text: 'English' },
                  { id: 'French', text: 'French' },
                ]}
                value={this.state.filterGuide}
                onSelect={this.handleFilter}
                onUnselect={this.handleFilter}
                name='filterGuide'
              />
            </div>
          </div>
        </div>

        <div className={cx(styles.accommodationModalBuilder)}>
          {/* below is commente as no need US - 2177 */}
          {/*
            <div style={{ float: 'left', width: '15%', marginBottom: '20px', marginTop: '10px' }}>
              {
                this.state.selectedTransfersArray.map((obj1, ii) => {
                  const optionNumber = ii + 1;
                  let icon = 'mdi mdi-buffer';
                  if (Number(optionNumber) === 1) {
                    icon = 'mdi mdi-directions';
                  }

                  let font_weight = '';
                  if (ii == this.state.selectedTransfersArrayOptedKey) { // eslint-disable-line eqeqeq
                    font_weight = 'bold';
                  }

                  return (
                    <div key={optionNumber}>
                      <a
                        onClick={() => { this.handleSelectTabOption(ii); }}
                        style={{
                          marginLeft: '20px',
                          cursor: 'pointer',
                          fontWeight: `${font_weight}`
                        }}
                      >
                        <i className={icon} /> Option {optionNumber}
                      </a>
                    </div>
                  );
                })
              }
            </div>
          */}


          <div style={{ width: '100%' }}>
            <div style={{ paddingLeft: '25px' }}>
              {changeDurationDiv}
              {removeAndCreateDuplicate}
            </div>
            <div style={{ overflowX: 'scroll', overflowY: 'hidden', display: 'flex', height: '180px' }}>
              <div style={{ paddingLeft: '25px' }}>
                {
                this.state.selectedTransfersArray.map((obj1, ii) => {
                  if (ii == this.state.selectedTransfersArrayOptedKey) { // eslint-disable-line eqeqeq
                    return obj1.map((obj, i) => {
                      let mgLeft = '';
                      if (i > 0) {
                        mgLeft = '-30px';
                      }
                      return (<span style={{ marginLeft: `${mgLeft}` }}>
                        <TransferPlacement
                          isLocalTransferModal={isLocalTransferModal}
                          data={obj}
                          key={i}
                          leftClickHandler={this.leftClickHandler.bind(null, i)}
                          rightClickHandler={this.rightClickHandler.bind(null, i)}
                          disableLeft={i === 0}
                          disableRight={i === (this.state.selectedTransfers.length - 1)}
                          dataLength={this.state.selectedTransfers.length}
                          removeClickHandler={this.removeClickHandler.bind(null, i)}
                          zIndex={i}
                          openOverlay={this.handleOpenOverlay.bind(null, true, obj, true)}
                          transferWrapperStyle={{ paddingLeft: '0' }}
                        />
                      </span>);
                    });
                  }

                  return null;
                })
              }
              </div>
            </div>
          </div>
        </div>

        {
          isLocalTransferModal ?
            <div style={{ paddingLeft: '20px', paddingTop: '10px' }}>
              <i>In local transfer single transfer product can be selected</i>
            </div> : null
        }

        <div className={styles['transfer-selection']} >
          <div className={styles['transfer-selection-items']} >
            {
            accessibleTransfers
              .filter(obj => !_.find(this.state.selectedTransfers, { _key: obj._key }))
              .filterOrigin(this.state.originCityName)
              .filterDestination(this.state.destinationCityName)
              .filterType(this.state.filters)
              .filterClass(this.state.filterClass)
              .filterGuide(this.state.filterGuide)
              .map(obj => (
                <TransferSelection
                  data={obj}
                  onClick={this.handleOpenOverlay.bind(null, true, obj)}
                  key={obj.id}
                />))
          }
            <TransferPlaceholderSelection onClick={this.handleOpenOverlay.bind(null, true, { isPlaceholder: true, _key: `placeholder_${shortId.generate()}` })} />
          </div>
        </div>

        {this.state.isOverlayOpened ? <TransferOverlay
          isLocalTransferModal={isLocalTransferModal}
          vehicleType={Object.keys(this.state.filters)}
          isOverlayOpened={this.state.isOverlayOpened}
          handleClick={this.handleSaveFromOverlay}
          handleOpenOverlay={this.handleOpenOverlay}
          service={this.state.service}
          hasSelected={this.hasAccommodationSelected}
          handleUnSelect={this.handleUnSelectFromOverlay}
          isToBeEdited={this.state.isToBeEdited}
          fromText={default_from_text}
          toText={default_to_text}
          vehicleClass={vehicleClassList}
          unavailableSlots={this.state.unavailableSlots}
        /> : null}
      </Modal>
    );
  }
}
