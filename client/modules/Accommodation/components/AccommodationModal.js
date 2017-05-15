import React, { Component, PropTypes } from 'react';
import Relay from 'react-relay';
import _ from 'lodash';
import cx from 'classnames';
import moment from 'moment';
import PubSub from 'pubsub-js';
import { Select2, Modal, DateRangePicker } from '../../Utils/components';
import style from '../style.module.scss';
import AccommodationSelection from './AccommodationSelection';
import AccommodationPlacement from './AccommodationPlacement';
import InfoOverlay from '../../InfoOverlay/components/InfoOverlay';
import UpdateAccommodationPlacementMutation from '../mutations/Update';
import UpdateServiceMutation from '../../ServiceBooking/mutations/UpdateService';
import Placeholder from './Placeholder';
import PlaceholderSelection from './PlaceholderSelection';
import PlaceholderOverlay from './PlaceholderOverlay';
import AddCityDayMutation from '../../City/mutations/AddCityDay';
import SERVICES from '../../../services';
import AddRoomConfigMutation from '../../InfoBox/mutations/AddRoomConfig';


export default class AccommodationModal extends Component {
  static propTypes = {
    viewer: PropTypes.object,
    relay: PropTypes.object,
    selectedSupplier: PropTypes.object,
    isModalOpened: PropTypes.bool.isRequired,
    changeModalState: PropTypes.func.isRequired,
    cityBookingKey: PropTypes.string.isRequired,
    cityBookingId: PropTypes.string.isRequired,
    date: PropTypes.string,
    startDay: PropTypes.number
  };

  static stars = [{
    id: 6,
    text: '★★★★★★'
  }, {
    id: 5,
    text: '★★★★★'
  }, {
    id: 4,
    text: '★★★★'
  }, {
    id: 3,
    text: '★★★'
  }, {
    id: 2,
    text: '★★'
  }];

  state = {
    accessibleSuppliers: [],
    selectedSupplier: this.props.selectedSupplier,
    isOverlayOpened: false,
    isPlaceholderModalOpened: false,
    service: {},
    startDate: moment(this.props.date),
    endDate: moment(this.props.date).add(1, 'day'),
    finalSaveStartDay: this.props.startDay,
    numOfDaysToAddInCity: false,
    index_numOfDaysToAddInCity: this.props.startDay
  };

  allSuppliers: [];

  componentWillMount() {
    this.filterSuppliers(this.props.viewer.accessibleSuppliers, this.state.selectedSupplier, this.isPreferred, this.hasPromotions, this.searchKeyword, this.stars, (accessibleSuppliers) => {
      accessibleSuppliers = this.orderSuppliers(accessibleSuppliers); // eslint-disable-line no-param-reassign
      this.setState({ accessibleSuppliers });
    });
  }

  componentDidMount() {
    // this component default use local db hotel data. (relay variables, useRemoteDataOnly: fasle)
    this.allSuppliers = [...this.state.accessibleSuppliers];

    // however some other information(availablity, cheapestRoomRate, accommdation.rate, accomdation.promtions)
    // only available via remote server, this may take a long time,
    // start a query to call the remote server data after component mounted.
    // after the query return back, plugin those information into all suppliers.
    this.props.relay.setVariables({
      useRemoteDataOnly: true
    });
  }

  componentWillReceiveProps(newProps) {
    if (newProps.durationNights) {
      const endDate = moment(newProps.date).add(newProps.durationNights, 'day');
      this.setState({ endDate });
    }
    if (this.props.viewer.accessibleSuppliers !== newProps.viewer.accessibleSuppliers) {
      if (newProps.relay.variables.useRemoteDataOnly) {
        // update the available, price, promotions information when get date from remote.
        this.updateAccessibleSuppliers(newProps.viewer.accessibleSuppliers);
      }

      this.filterSuppliers(this.allSuppliers, this.state.selectedSupplier, this.isPreferred, this.hasPromotions, this.searchKeyword, this.stars);
      this.setState({ shouldForceFetch: false });
    }
  }

  // merge the new accessible suppliers information into the supplier info.
  updateAccessibleSuppliers(accessibleSuppliers) {
    // loop all suppliers, update the (availablity, cheapestRoomRate, accommdation.rate, accomdation.promtions) by using the latest accessible supplier.
    this.allSuppliers.forEach((supplier) => {
      supplier.isPreselected = _.some(supplier.accommodations, acc => acc.isPreselected); // eslint-disable-line no-param-reassign
      const accessibleSupplier = accessibleSuppliers.find(accessibleSupplier => supplier._key === accessibleSupplier._key);
      if (accessibleSupplier) {
        supplier.cheapestRoomRate = accessibleSupplier.cheapestRoomRate; // eslint-disable-line no-param-reassign
        supplier.currency = accessibleSupplier.currency; // eslint-disable-line no-param-reassign
        supplier.accommodations = accessibleSupplier.accommodations; // eslint-disable-line no-param-reassign
        supplier.isPreselected = supplier.accommodations.some(acc => acc.isPreselected); // eslint-disable-line no-param-reassign
        supplier.isAvaiable = true; // eslint-disable-line no-param-reassign
      } else {
        supplier.isAvaiable = false; // eslint-disable-line no-param-reassign
      }
    });
    this.allSuppliers = this.orderSuppliers(this.allSuppliers);
  }

  orderSuppliers(suppliers) {
    suppliers.map(supplier => // eslint-disable-line no-return-assign
      supplier.isPreselected = supplier.accommodations.some(acc => acc.isPreselected)); // eslint-disable-line no-param-reassign

    // return _.orderBy(suppliers, ['isPreselected', 'cheapestRoomRate', 'title'], ['desc', 'asc', 'asc']);
    return _.orderBy(suppliers, ['isPreselected', 'title'], ['desc', 'asc']);
  }

  /**
   * Refetch the accessible accommodations
   * @param startDate moment object
   * @param endDate moment object
   */
  onDateChange = (startDate, endDate) => {
    // start - to calculate startDay
    const org_opted_date = this.props.date;
    const change_start_date = moment(startDate).format('YYYY-MM-DD');
    const change_end_date = moment(endDate).format('YYYY-MM-DD');
    let finalSaveStartDay = this.props.startDay; // start day should be from props IMPORTANT
    if (org_opted_date !== change_start_date) {
      // change startDay if dates are not same
      const diff_in_dates_in_days = moment(change_start_date).diff(moment(org_opted_date), 'days');
      if (diff_in_dates_in_days > 0) {
        finalSaveStartDay += diff_in_dates_in_days;
      }
    }
    // end - to calculate startDay


    // start - if start date is not in city then add days in city
    let numOfDaysToAddInCity = false;
    let index_numOfDaysToAddInCity = false;

    if (this.props.cityDays) {
      const city_last_date = this.props.cityDays[this.props.cityDays.length - 1].startDate;
      const diff_d = moment(change_start_date).diff(moment(city_last_date), 'days');

      if (diff_d > 0) {
        numOfDaysToAddInCity = diff_d + endDate.diff(startDate, 'day');
        index_numOfDaysToAddInCity = this.props.cityDays[this.props.cityDays.length - 1].startDay;
      } else if (diff_d === 0) {
        numOfDaysToAddInCity = moment(change_end_date).diff(moment(change_start_date), 'days');
        index_numOfDaysToAddInCity = this.props.cityDays[this.props.cityDays.length - 1].startDay;
      }
    }
    // end - if start date is not in city then add days in city
    // console.log(startDate,
    // endDate,
    // finalSaveStartDay,
    // numOfDaysToAddInCity,
    // index_numOfDaysToAddInCity);

    // console.log(startDate, endDate, finalSaveStartDay, numOfDaysToAddInCity, index_numOfDaysToAddInCity);
    this.setState({
      startDate,
      endDate,
      finalSaveStartDay,
      numOfDaysToAddInCity,
      index_numOfDaysToAddInCity
    });

    this.props.relay.setVariables({
      countryName: this.props.countryName,
      cityCode: this.props.cityCode,
      date: this.formatDate(startDate),
      duration: endDate.diff(startDate, 'day')
    });
  };

  /**
   * Filter accessible hotels based on the current selected filters.
   */
  filterSuppliers = (allSuppliers, selectedSupplier, isPreferred, hasPromotions, keyword, stars, cb) => {
    let accessibleSuppliers = [...allSuppliers]; // eslint-disable-line no-param-reassign
    // Filter based on selected filters
    // Between filter types, using AND operator
    // Inside the same filter (Stars), using OR operator
    // If an array filter, stars, is empty, it won't be applied
    accessibleSuppliers = _.filter(accessibleSuppliers, supplier => // eslint-disable-line no-param-reassign
        (keyword === '' || supplier.title.toLowerCase().indexOf(keyword.toLowerCase()) !== -1 || supplier.supplierCode.toLowerCase().indexOf(keyword.toLowerCase()) !== -1 || supplier.description.toLowerCase().indexOf(keyword.toLowerCase()) !== -1) &&
        (!this.stars.length || _.some(supplier.accommodations, acc => stars.indexOf(acc.class.stars) !== -1)) &&
        (!hasPromotions || _.some(supplier.accommodations, acc => hasPromotions === acc.hasPromotions)) &&
        (!isPreferred || _.some(supplier.accommodations, acc => isPreferred === acc.isPreferred)) &&
        (!this.hasAvailable || supplier.isAvaiable)
    );
    accessibleSuppliers = this.prepareAccessibleSuppliers(accessibleSuppliers, selectedSupplier); // eslint-disable-line no-param-reassign
    if (cb) cb(accessibleSuppliers);
    else this.setState({ accessibleSuppliers });
  };

  formatDate(date) {
    return date.format('YYYY-MM-D');
  }

  handleClickPlaceholder = (isOpen) => {
    this.setState({ isPlaceholderModalOpened: isOpen });
  };

  handleFilterClass = (e) => {
    this.stars = Select2.getSelect2Values(e.currentTarget).map(star => Number.parseInt(star, 10));
    this.filterSuppliers(this.allSuppliers, this.state.selectedSupplier, this.isPreferred, this.hasPromotions, this.searchKeyword, this.stars);
  };

  /**
   * Toggle a boolean value of a given filter
   * @param filterField
   */
  handleFilterSuppliers = (filterField) => {
    // NOTES, now we will get all suppliers when init,
    // and will also startup another call to remote server for available hotels information after the components mounted.
    // after the remote date return back, plugin the availablity infromation into the supplier list.
    // will no need to force fetch everytime switch between All/Availabe filter.

    // if (filterField === 'hasAvailable') { // this is since either availablel or all will be selected
    //   this.hasAvailable = !this.hasAvailable;
    //
    //   if (this.hasAvailable) {
    //     this.props.relay.setVariables({
    //       useRemoteDataOnly: true
    //     });
    //   } else {
    //     this.props.relay.setVariables({
    //       useRemoteDataOnly: false
    //     });
    //   }
    //   this.props.relay.forceFetch();
    // } else {
    //   this[filterField] = !this[filterField];
    // }
    this[filterField] = !this[filterField];
    this.filterSuppliers(this.allSuppliers, this.state.selectedSupplier, this.isPreferred, this.hasPromotions, this.searchKeyword, this.stars);
  };

  handleOpenOverlay = (isOpen, service, e) => {
    if (e) e.stopPropagation();
    const accommodationModal = $(`.${style['accommodation-modal']}`);
    accommodationModal.toggleClass('hide-scrollbar');
    accommodationModal.scrollTop(0);

    if (service) {
      service.type = 'accommodation'; // eslint-disable-line no-param-reassign

      if (service.supplier) service.description = service.supplier.description; // eslint-disable-line no-param-reassign
    }

    this.setState({ isOverlayOpened: isOpen, service: _.cloneDeep(service) });
  };

  handleSaveAndRemoveAccommodation = () => { // eslint-disable-line consistent-return
    // start add missing Days
    let numOfDaysToAddInCity = this.state.numOfDaysToAddInCity;

    if (numOfDaysToAddInCity !== false && this.state.index_numOfDaysToAddInCity !== false) {
      if (numOfDaysToAddInCity > 0) {
        _.times(numOfDaysToAddInCity, (k) => {
          Relay.Store.commitUpdate(new AddCityDayMutation({
            cityBookingKey: this.props.cityBookingKey,
            dayIndex: this.state.index_numOfDaysToAddInCity,
            id: this.props.cityBookingId,
            cityBooking: null
          }), {
            onSuccess: () => {
              PubSub.publish('TripForceFetch', {});
            }
          });
        });
      }
    } else if (numOfDaysToAddInCity === false) {
      numOfDaysToAddInCity = 1;
      if (this.props.cityDays) {
        this.props.cityDays.map((day) => { // eslint-disable-line array-callback-return
          if (day.startDay === this.props.startDay + 1) {
            numOfDaysToAddInCity = 0;
          }
        });
      }
      // if (this.props.cityDays.length >= this.props.startDay + 1) {
      //   numOfDaysToAddInCity = 0;
      // } else {
      //   numOfDaysToAddInCity = 1;
      // }

      _.times(numOfDaysToAddInCity, (k) => {
        Relay.Store.commitUpdate(new AddCityDayMutation({
          cityBookingKey: this.props.cityBookingKey,
          dayIndex: this.state.index_numOfDaysToAddInCity,
          id: this.props.cityBookingId,
          cityBooking: null
        }), {
          onSuccess: () => {
            PubSub.publish('TripForceFetch', {});
          }
        });
      });
    }
    // end add missing days

    const { selectedSupplier, cityBookingKey, cityBookingId } = this.props;
    const { startDate, endDate, accessibleSuppliers } = this.state;
    const startDay = this.state.finalSaveStartDay;
    const durationNights = endDate.diff(startDate, 'day');
    const accommodationPlacementKey = selectedSupplier ? selectedSupplier._key : undefined;
    const selectedAccommodationKeys = [];
    const preselectedAccommodationKeys = [];

    // Collect all selected/preselected accommodation keys from selectedSupplier
    _.each(this.state.selectedSupplier.accommodations, (acc) => {
      if (acc.isSelected) selectedAccommodationKeys.push(acc._key);
      if (acc.isPreselected) preselectedAccommodationKeys.push(acc._key);
    });

    // Collect all preselected from other accommodations
    _.each(accessibleSuppliers, (supplier) => {
      _.each(supplier.accommodations, (acc) => {
        if (acc.isPreselected) preselectedAccommodationKeys.push(acc._key);
      });
    });

    const placeholders = [];
    if (this.state.selectedSupplier.placeholder) {
      if (this.state.selectedSupplier._key.substring(0, 11) !== 'placeholder') {
        placeholders.push({
          serviceBookingKey: this.state.selectedSupplier._key
        });
      } else {
        const obj = this.state.selectedSupplier.placeholder;
        delete obj._key;
        placeholders.push(obj);
      }
    }

    this.state.accessibleSuppliers.filter(service => service.placeholder).map((service) => {
      if (service._key.substring(0, 11) !== 'placeholder') {
        placeholders.push({
          serviceBookingKey: service._key
        });
      } else {
        const obj = service.placeholder;
        delete obj._key;
        placeholders.push(obj);
      }
      return null;
    });

    if (accommodationPlacementKey && placeholders.length > 0) {
      PubSub.publish('Infobox', { type: 'clear' });

      return Relay.Store.commitUpdate(new UpdateServiceMutation({
        serviceBookingId: this.state.selectedSupplier._key,
        serviceBookingKey: accommodationPlacementKey,
        patchData: {
          notes: this.state.selectedSupplier.placeholder.notes
        }
      }), {
        onSuccess: () => {
          PubSub.publish('Infobox', { type: 'clear' });
        }
      });
    }

    let acc_service_key = '';
    let final_inserted_serviceBookingKey = '';
    Relay.Store.commitUpdate(new UpdateAccommodationPlacementMutation({
      cityBookingId,
      cityBookingKey,
      accommodationPlacementKey,
      selectedAccommodationKeys,
      preselectedAccommodationKeys,
      startDay,
      placeholders,
      durationNights,
      startDate: moment(startDate).format('YYYY-MM-DD')
    }), {
      onSuccess: (retData) => {
        // start --update prices in service booking
        selectedAccommodationKeys.map((a) => { // eslint-disable-line array-callback-return
          if (retData && retData.updateAccommodationPlacement && retData.updateAccommodationPlacement.cityBooking && retData.updateAccommodationPlacement.cityBooking.accommodationPlacements) {
            retData.updateAccommodationPlacement.cityBooking.accommodationPlacements.map((b) => { // eslint-disable-line array-callback-return
              if (b.serviceBookings) {
                b.serviceBookings.map((c) => { // eslint-disable-line array-callback-return
                  if (c.productId === a) {
                    const inserted_serviceBookingKey = c._key;
                    acc_service_key = b._key;
                    // check price
                    if (this.state.selectedSupplier && this.state.selectedSupplier.accommodations) {
                      this.state.selectedSupplier.accommodations.map((d) => { // eslint-disable-line array-callback-return
                        if (a === d._key && d.rate && d.rate.doubleRoomRate) {
                          final_inserted_serviceBookingKey = inserted_serviceBookingKey;
                          Relay.Store.commitUpdate(new UpdateServiceMutation({
                            serviceBookingKey: inserted_serviceBookingKey,
                            patchData: {
                              price: {
                                currency: '',
                                amount: d.rate.doubleRoomRate
                              }
                            }
                          }), {
                          });
                        }
                      });
                    }
                  }
                });
              }
            });
          }
        });
        // end -- update prices in service booking
        PubSub.publish('Infobox', { type: 'clear' });

        // start add room config
        if (SERVICES.tripMostLatestAccommodationRoomConfig.length > 0) {
          SERVICES.tripMostLatestAccommodationRoomConfig.map((roomConfig, i) => { // eslint-disable-line array-callback-return
            const r_config_save = {
              serviceBookingKey: final_inserted_serviceBookingKey,
              roomType: roomConfig.roomType,
              paxKeys: []
            };

            const paxKeys = [];
            roomConfig.paxs.map((pax, i) => { // eslint-disable-line array-callback-return
              paxKeys.push(pax._key);
            });

            Relay.Store.commitUpdate(new AddRoomConfigMutation({
              serviceBookingKey: final_inserted_serviceBookingKey,
              roomType: roomConfig.roomType,
              paxKeys
            }));
          });
        }
        // end add room config


        // start show infobox when hotel is added
        const d_infoboxData = {
          accommodationPlacementKey: acc_service_key,
          cityBookingKey,
          serviceBookingKey: acc_service_key,
          tpBookingRef: '',
          type: 'accommodation'
        };
        // end show infobox when hotel is added
        if (acc_service_key !== '') {
          PubSub.publish('Infobox', d_infoboxData);
        }
      }
    });

    this.props.relay.forceFetch();
  };

  handleSaveFromOverlay = (selectedSupplier) => {
    // Reassign the selectedSupplier, only if some of its accommodations are selected.
    // Also set the selectedSupplier to null, if all of its accommodations are unselected
    // If only preselection is select then change accessibleSuppliers
    if (selectedSupplier.accommodations.some(acc => acc.isSelected)) this.setState({ selectedSupplier, accessibleSuppliers: this.prepareAccessibleSuppliers(this.state.accessibleSuppliers, selectedSupplier) });
    else if (selectedSupplier._key === this.state.selectedSupplier._key) this.setState({ selectedSupplier: null });
    else {
      this.allSuppliers.splice(_.indexOf(this.allSuppliers, _.find(this.allSuppliers, { _key: selectedSupplier._key })), 1, selectedSupplier);
      this.allSuppliers = this.orderSuppliers(this.allSuppliers);
      this.filterSuppliers(this.allSuppliers, this.state.selectedSupplier, this.isPreferred, this.hasPromotions, this.searchKeyword, this.stars);
    }
  };

  /**
   * Search accessible suppliers by name or supplierId
   * @param e
   */
  handleSearchTours = (e) => {
    this.searchKeyword = e.target.value;
    this.filterSuppliers(this.allSuppliers, this.state.selectedSupplier, this.isPreferred, this.hasPromotions, this.searchKeyword, this.stars);
  };

  handleSelectPlaceholder = (addedPlaceholder) => {
    this.setState({
      selectedSupplier: {
        ...addedPlaceholder
      }
    });
  };

  hasAccommodationSelected = service => this.state.selectedSupplier && this.state.selectedSupplier._key === service._key;


  // Filters
  isPreferred = false;
  hasPromotions = false;
  hasAvailable = false; // default to show all accommodations, when has available is on, only show available accommodations.
  stars = [];
  searchKeyword = '';

  // Filter selected tours out of the tour selection
  prepareAccessibleSuppliers(accessibleSuppliers, selectedSupplier) {
    if (!selectedSupplier) return accessibleSuppliers;

    // In case of updating Accommodation placement
    if (selectedSupplier.supplier) {
      const idx = accessibleSuppliers.findIndex(supplier => supplier._key === selectedSupplier.supplier._key);

      // If the selectedSupplier doesn't exist in the accessibleSupplier
      if (idx === -1) return accessibleSuppliers;

      // Else merge rooms of AccommodationPlacement and AccessibleSupplier together,
      // and exclude the selectedSupplier in accessibleSupplier
      // eslint-disable-next-line no-param-reassign
      selectedSupplier.accommodations = _.unionWith(selectedSupplier.accommodations, accessibleSuppliers[idx].accommodations, (select, available) => select._key === available._key);

      // Set isPreferred and hasPromotions
      selectedSupplier.isPreferred = selectedSupplier.accommodations.some(acc => acc.isPreferred); // eslint-disable-line no-param-reassign
      selectedSupplier.hasPromotions = selectedSupplier.accommodations.some(acc => acc.hasPromotions); // eslint-disable-line no-param-reassign

      return [...accessibleSuppliers.slice(0, idx), ...accessibleSuppliers.slice(idx + 1, accessibleSuppliers.length)];
    }
    return _.filter(accessibleSuppliers, supplier => supplier._key !== selectedSupplier._key);
  }


  toggleBar() {
    // below code is commented - 2482 - Hotel picker: remove sliding functionality from slider panel
    // const slider = $(`.${style['accommodation-slider']}`);
    // const selection = $(`.${style['accommodation-selection']}`);
    // const date = $('#datePicker');
    // const active = 'active';
    // slider.toggleClass(active);

    // if (slider.hasClass(active)) {
    //   date.css({ display: '' });
    //   slider.css({ width: '20%' });
    //   selection.css({ width: '110%' });
    // } else {
    //   date.css({ display: 'none' });
    //   slider.css({ width: 0 });
    //   selection.css({ width: '128%' });
    // }
  }

  renderSelectedSupplier() {
    const test = 500;
    const { selectedSupplier } = this.state;
    if (selectedSupplier) {
      if (selectedSupplier.placeholder) {
        return <PlaceholderSelection className={style['accommodation-selection-item']} handleClickPlaceholder={this.handleClickPlaceholder} style={{ width: '185px', height: test, margin: '0 auto' }} service={this.state.selectedSupplier} />;
      }
      return <AccommodationPlacement country={this.props.country} className={style['accommodation-selection-item']} service={this.state.selectedSupplier} handleOpenOverlay={this.handleOpenOverlay} style={{ width: '185px', height: test, margin: '0 auto' }} imageHeight='195px' />;
    }
    return null;
  }

  render() {
    const { accessibleSuppliers } = this.state;
    const { isModalOpened, changeModalState } = this.props;

    const saveTourButton = <a className='modal-action modal-close waves-effect waves-green btn-flat exo-colors-text fs-15' onClick={this.handleSaveAndRemoveAccommodation.bind(null, this.state.selectedSupplier)}><i className='mdi-file-cloud-upload left' />Save</a>;
    const cancelTourButton = <a className='modal-action modal-close waves-effect waves-red btn-flat exo-colors-text ml-10 fs-15'><i className='mdi-content-clear left' />Cancel</a>;
    const datePickerButton = <a className='cursor'><i className='mdi-editor-mode-edit small mr-0 fw-600' /></a>;

    const suppliers = accessibleSuppliers.map(supplier => <AccommodationSelection key={supplier.id} className={style['accommodation-selection-item']} supplier={supplier} handleOpenOverlay={this.handleOpenOverlay} style={{ boxShadow: '2px 2px 4px #888888' }} />);

    const date_range_start = this.state.startDate.format('YYYY-MM-DD');
    const date_range_end = this.state.endDate.format('YYYY-MM-DD');
    const date_range = moment.range(moment(date_range_start, 'YYYY-MM-DD'), moment(date_range_end, 'YYYY-MM-DD'));

    return (
      <Modal className={cx(style['accommodation-modal'], 'exo-colors modal-bgr1')} actionButton={saveTourButton} cancelButton={cancelTourButton} isModalOpened={isModalOpened} changeModalState={changeModalState} dismissible={false}>
        <div className={cx(style['accommodation-modal-header'], 'exo-colors-text text-data-1')}>
          <h3>Add Hotel</h3>
        </div>
        <div className={style['accommodation-modal-filter']}>
          <div className='row m-0'>
            <div className='col s2 p-0 pt-5'>
              <h4 className='exo-colors-text text-label-1'>Filter</h4>
            </div>
            <div className='col s10 p-0'>
              <div className={style['accommodation-modal-filter-top']}>
                <a className='cursor' onClick={this.handleFilterSuppliers.bind(null, 'hasAvailable')}><span className={cx({ 'exo-colors-text text-accent-4': this.hasAvailable })}><i className='mdi-maps-local-offer' /> Available</span></a>
                <a className='cursor' onClick={this.handleFilterSuppliers.bind(null, 'isPreferred')}><span className={cx({ 'exo-colors-text text-accent-4': this.isPreferred })}><i className='mdi-action-thumb-up' /> EXO Recommended</span></a>
                <a className='cursor' onClick={this.handleFilterSuppliers.bind(null, 'hasPromotions')}><span className={cx({ 'exo-colors-text text-accent-4': this.hasPromotions })}><i className='mdi-maps-local-offer' /> Promotions</span></a>
              </div>
            </div>
          </div>
          <div className='row m-0'>
            <div className='col s2 p-0 pt-5'>
              <h4 className='exo-colors-text text-label-1'>Style</h4>
            </div>
            <div className='col s4 p-0'>
              <div className={style['accommodation-modal-filter-bottom']}>
                <Select2 multiple data={AccommodationModal.stars} value={this.stars} onSelect={this.handleFilterClass} onUnselect={this.handleFilterClass} />
              </div>
            </div>
          </div>
        </div>
        <div className={style['accommodation-modal-content']}>
          <div className={cx(style['accommodation-canvas'], 'col s12  p-0')}>
            <div className='row m-0'>
              <div className={cx(style['accommodation-slider'], 'col s3 p-0', 'active')} style={{ boxShadow: '2px 1px 4px #888888', minHeight: '645px' }}>
                <div className={cx(style['date-title'], 'align-center')}>
                  <i className='mdi-action-today small exo-colors-text text-label-1 mr-12' />
                  <span className='fs-12 fw-600 mr-6'>{this.state.startDate.format('MMM D')} - {this.state.endDate.format('MMM D')}</span>
                  <span className='fs-12 mr-12'>{this.state.endDate.diff(this.state.startDate, 'day')} Nights</span>
                  <span className={style.dateRangePicker} id='datePicker'>
                    <DateRangePicker
                      triggerButton={datePickerButton}
                      onDateChange={this.onDateChange}
                      minimumDate={moment(this.props.date).toDate()}
                      value={date_range}
                    />
                  </span>

                </div>
                <div className='pt-24 mb-18'>
                  {this.renderSelectedSupplier()}
                </div>
              </div>
              {/*
              <div className={cx(style.togglebar, 'col s0.1 p-0', 'exo-colors-text text-label-1 center-align cursor')} onClick={this.toggleBar}>
                <i className='mdi-hardware-keyboard-arrow-right small' />
              </div>
              */}
              <div className='col s9 p-0'>
                <div className='h-70 pl-24 pt-10 exo-colors modal-bgr1'>
                  <div className='row m-0'>
                    <div className='input-field col s4 pr-0'>
                      <input id='search' type='text' className='validate' onChange={this.handleSearchTours} placeholder='Search Hotel' />
                    </div>
                    <div className='col s1'>
                      <a href='#'><i className='mdi-action-search small' /></a>
                    </div>
                  </div>
                </div>
                <div className={style['accommodation-selection']}>
                  <div className={style['accommodation-selection-items']}>
                    {suppliers}
                    <Placeholder className={style['accommodation-selection-item']} handleClickPlaceholder={this.handleClickPlaceholder} style={{ width: '165px', height: '260px' }} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {this.state.isOverlayOpened ? <InfoOverlay isOverlayOpened={this.state.isOverlayOpened} handleClick={this.handleSaveFromOverlay} handleOpenOverlay={this.handleOpenOverlay} service={this.state.service} hasSelected={this.hasAccommodationSelected} /> : null}
        {this.state.isPlaceholderModalOpened ? <PlaceholderOverlay handleClick={this.handleSelectPlaceholder} handleOpenOverlay={this.handleClickPlaceholder} hasSelected={this.hasTourSelected} service={this.state.selectedSupplier} /> : null}
      </Modal>
    );
  }
}
