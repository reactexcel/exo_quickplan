import React from 'react';
import Relay from 'react-relay';
import cx from 'classnames';
import ReactTooltip from 'react-tooltip';
import PubSub from 'pubsub-js';
import _ from 'lodash';
import { Modal, Card, Dropdown, Select, Select2 } from '../../Utils/components';
import AddCityMutation from '../../City/mutations/AddCity';
import City from '../../City/containers/City';
import Transfer from '../../Transfer/renderers/TransferRenderer';
import SERVICES from '../../../services';
import BookServicesMutation from '../mutations/BookServices';
import CancelServiceMutation from '../mutations/CancelServices';
import ServicesAvailabilityCheckingMutation from '../../ServiceBooking/mutations/ServicesAvailability';
import styles from '../style.module.scss';
import RemoveLocalTransfer from '../../Transfer/mutations/RemoveLocalTransfer';

export default class Country extends React.Component {
  static propTypes = {
    viewer: React.PropTypes.object.isRequired,
    index: React.PropTypes.number.isRequired,
    country: React.PropTypes.object.isRequired,
    handleAddCountry: React.PropTypes.func.isRequired,
    handleRemoveCountry: React.PropTypes.func.isRequired,
    handleRemoveCity: React.PropTypes.func.isRequired,
    handleUpdateCity: React.PropTypes.func.isRequired,
    activeDetail: React.PropTypes.object,
    activeServiceBookingKey: React.PropTypes.string,
    propTypes: React.PropTypes.object,
    isTaView: React.PropTypes.bool
  };

  state = {
    isCountryModalOpened: false,
    isCityModalOpened: false,
    sBookModalOpened: false,
    isCancelBookModalOpened: false,
    isAvailabilityModalOpened: false,
    sortedCitiesList: [],
    countryUnbookedServices: [],
    count_total_booked_services: 0,
    count_total_on_request_services: 0,
    totalMissingMeals: 0,
    cityBookings: [],
    repeatedCountryWarning: '',
    city: 'Choose city',
    country: ''

  };

  componentWillMount() {
    this.init();
  }
  componentWillReceiveProps(nextProps) {
    const country = nextProps.country;
    // this.setState({ repeatedCountryWarning: '' });
    let repeatedCountryWarning = '';
    let checkRepeatedCountry = false;
    const existingCountries = SERVICES.tripPlannerCountriesOpted;
    if (nextProps.index > 0 && existingCountries.length > 0) {
      const lastCountry = existingCountries[existingCountries.length - 1];
      if (lastCountry === country.countryCode) {
        checkRepeatedCountry = true;
        repeatedCountryWarning = <div style={{ marginTop: '10px', marginBottom: '10px', color: '#e47713', fontSize: '12px' }}>You had added same country side by side</div>;
        // this.setState({ repeatedCountryWarning });
      }
    }
    SERVICES.tripPlannerCountriesOpted.push(country.countryCode);

    let sortedCities = [];
    const unsortedCities = nextProps.cities || [];
    if (unsortedCities.length > 0) {
      sortedCities = _.sortBy(unsortedCities, 'name');
    }


    // START - city status/count of services
    const countryUnbookedServices = [];
    const total_pax_errors = 0;
    let total_booked_services = 0;
    let total_on_request_services = 0;
    let hotel_booked = 0;
    let hotel_on_request = 0;
    let totalMissingMeals = 0;
    if (nextProps.viewer.trips && nextProps.viewer.trips.countryBookings && nextProps.viewer.trips.countryBookings.length > 0) {
      nextProps.viewer.trips.countryBookings.map((country_booking, ccb_key) => { // eslint-disable-line array-callback-return
        if (ccb_key === this.props.index) {
          if (country_booking.cityBookings && country_booking.cityBookings.length > 0) {
            country_booking.cityBookings.map((city_booking, cb_key) => { // eslint-disable-line array-callback-return
                // start - for hotel
              if (city_booking.accommodationPlacements && city_booking.accommodationPlacements.length > 0) {
                city_booking.accommodationPlacements.map((city_accommodationPlacements, hi) => { // eslint-disable-line array-callback-return
                  if (city_accommodationPlacements.serviceBookings) {
                    city_accommodationPlacements.serviceBookings.map((hh, hhi) => { // eslint-disable-line array-callback-return
                      let check_status = '';
                      if (hh.status && hh.status.state) {
                        check_status = hh.status.state;
                      } else {
                        check_status = hh.status;
                      }
                      if (check_status === 'Booked') {
                        hotel_booked += 1;
                      } else {
                        if (check_status === 'On Request') {
                          hotel_on_request += 1;
                        }
                        countryUnbookedServices.push(hh);
                      }
                    });
                  }
                });
              }
                // end - for hotel
                // start - tour and transfer
              if (city_booking.cityDays && city_booking.cityDays.length > 0) {
                city_booking.cityDays.map((day, idx) => { // eslint-disable-line array-callback-return
                  if (day.serviceBookings && day.serviceBookings.length > 0) {
                    day.serviceBookings.map((v, k) => { // eslint-disable-line array-callback-return
                      const stateState = v.status && v.status.state ? v.status.state : '';
                      if (stateState === 'Booked') {
                        total_booked_services += 1;
                      } else {
                        if (stateState === 'On Request') {
                          total_on_request_services += 1;
                        }
                        countryUnbookedServices.push(v);
                      }
                    });
                  }
                });
                totalMissingMeals += _.sumBy(city_booking.cityDays,
                    cityDay => _.sumBy(cityDay.timeSlots, timeSlot => timeSlot.meal.type === 'No meal arranged' ? 1 : 0)); // eslint-disable-line no-confusing-arrow
              }
                // end - tour and transfer
            });
          }
        }
      });
    }
    total_booked_services += hotel_booked;
    total_on_request_services += hotel_on_request;
    // END - city status/count of services

    this.setState({
      sortedCitiesList: sortedCities,
      count_total_booked_services: total_booked_services,
      count_total_on_request_services: total_on_request_services,
      countryUnbookedServices,
      totalMissingMeals,
      cityBookings: nextProps.country.cityBookings,
      repeatedCountryWarning
    });
  }

  init() {
    this.selectedCountries = [];

    // Cities
    this.selectedCities = [];
  }

  handleOnChangeCity = (e) => {
    this.selectedCities = [...e.target.options].filter(city => city.selected).map(city => city.value);
  };

  handleAddCity = (countryIndex, cities, cityOrder, cityIndex, countryBookingKey) => {
    Relay.Store.commitUpdate(new AddCityMutation({
      countryIndex,
      cities: cities.length ? cities : this.selectedCities,
      cityOrder,
      cityIndex,
      countryBookingKey
    }), {
      onSuccess: () => {
        PubSub.publish('TripForceFetch', {});
      }
    });
    this.selectedCities = [];
  };

  handleOnChangeCountry = (e) => {
    this.selectedCountries = [...e.target.options].filter(country => country.selected).map(country => country.value);
  };

  handleAddCountry = () => {
    this.props.handleAddCountry(this.selectedCountries, this.addedCountryOrder, this.addedCountryIndex, this.selectedCountries[0]);
    this.selectedCountries = [];
  };

  changeCountryModalState = (isOpen, addedIndex, addedOrder) => {
    this.setState({ isCountryModalOpened: isOpen });
    this.addedCountryIndex = addedIndex;
    this.addedCountryOrder = addedOrder;
  };

  changeCityModalState = (isOpen, addedCityCountryIndex, addedIndex, addedOrder) => {
    this.setState({ isCityModalOpened: isOpen });
    this.addedCityCountryIndex = addedCityCountryIndex;

    // Specify whether index from order
    if (addedOrder === 'after') {
      this.addedCityIndex = addedIndex + 1;
    } else if (addedOrder === 'before') {
      this.addedCityIndex = addedIndex;
    }

    this.addedCityOrder = addedOrder;
  };

  handleCancelServices = () => {
    Relay.Store.commitUpdate(new CancelServiceMutation({
      countryBookingKey: this.props.country._key
    }), {
      onSuccess: () => {
        PubSub.publish('TripForceFetch');
      }
    });
  };

  handleBookingServices = () => {
    Relay.Store.commitUpdate(new BookServicesMutation({
      countryBookingKey: this.props.country._key
    }), {
      onSuccess: () => {
        PubSub.publish('TripForceFetch');
      }
    });
  };

  handleCheckServicesAvailability = () => {
    Relay.Store.commitUpdate(new ServicesAvailabilityCheckingMutation({
      startNodeId: `countryBookings/${this.props.country._key}`
    }), {
      onSuccess: (res) => {
        PubSub.publish('TripForceFetch', {});
      },
      onFailure: (err) => {
        console.log('CheckServicesAvailability Error:', err);
      }
    });
  };

  changeBookModalState = (isOpen) => {
    this.setState({ isBookModalOpened: isOpen });
  };

  changeCancelBookModalState = (isOpen) => {
    this.setState({ isCancelBookModalOpened: isOpen });
  };

  changeAvailabilityModalState = (isOpen) => {
    this.setState({ isAvailabilityModalOpened: isOpen });
  }

  clearCountryItinerary = () => {
    if (this.state.countryUnbookedServices.length > 0) {
      this.state.countryUnbookedServices.map((serviceBooking, j) => { // eslint-disable-line array-callback-return
        const serviceBookingKey = serviceBooking._key;
        Relay.Store.commitUpdate(new RemoveLocalTransfer({
          transferPlacementKey: serviceBookingKey
        }), {
          // onSuccess: response => this.props.onSuccessClearTransfer(true, response),
          // onFailure: response => this.props.onFailureClearTransfer(false, response)
        });
      });
    }
    PubSub.publish('TripForceFetch', {});
  }

  render() {
    let tpBookingRef = '';
    if (this.props.country && this.props.country.tpBookingRef) {
      tpBookingRef = this.props.country.tpBookingRef;
    }

    const handleBookingServices = this.handleBookingServices;
    const handleCancelServices = this.handleCancelServices;
    const handleCheckServicesAvailability = this.handleCheckServicesAvailability;
    const bookCountryButton = <a className='modal-action modal-close waves-effect waves-green btn' onClick={handleBookingServices}><i className='mdi-editor-attach-money left' />Book Country</a>;
    const cancelBookButton = <a className='modal-action modal-close waves-effect btn red' onClick={handleCancelServices}><i className='mdi-editor-attach-money left' />Cancel Booking</a>;

    let isCheckLastCountry = false;

    if (this.props.totalCountry) {
      if (this.props.totalCountry - 1 === this.props.index) {
        isCheckLastCountry = true;
      }
    }

    let cities;
    const country = this.props.country;

    // start check for repeated country
    const repeatedCountryWarning = '';
    const checkRepeatedCountry = false;
    const existingCountries = SERVICES.tripPlannerCountriesOpted;
    //
    // if (this.props.index > 0 && existingCountries.length > 0) {
    //   const lastCountry = existingCountries[existingCountries.length - 1];
    //   if (lastCountry === country.countryCode) {
    //     checkRepeatedCountry = true;
    //     repeatedCountryWarning = <div style={{ marginTop: '10px', marginBottom: '10px', color: '#e47713', fontSize: '12px' }}>You had added same country side by side</div>;
    //   }
    // }
    // SERVICES.tripPlannerCountriesOpted.push(country.countryCode);// put current country in array
    // end check for repeated country

    const addCountryButton = <a className='modal-action modal-close waves-effect waves-green btn' onClick={this.handleAddCountry}><i className='mdi-action-input left' />Add</a>;
    const addCityButton = <a className='modal-action modal-close waves-effect waves-green btn' onClick={this.handleAddCity.bind(null, this.addedCityCountryIndex, this.selectedCities, this.addedCityOrder, this.addedCityIndex, this.props.country._key)}><i className='mdi-action-input left' />Add</a>;
    const triggerButton = <a><i className={cx('mdi-navigation-more-vert', styles.test)} style={{ fontSize: '1.4em' }} /></a>;
    const checkCountryButton = <a className='modal-action modal-close waves-effect waves-green btn' onClick={handleCheckServicesAvailability}><i className='mdi-editor-attach-money left' />Check availability</a>;

    if (this.state.cityBookings.length) {
      cities = this.state.cityBookings.map((city, index) =>
        <City
          key={index}
          index={index}
          countryIndex={this.props.index}
          viewer={this.props.viewer}
          city={city}
          tripCities={this.state.cityBookings}
          country={this.props.country}
          cities={this.state.sortedCitiesList}
          activeDetail={this.props.activeDetail}
          countryIndex={this.props.index}
          handleAddCity={this.handleAddCity}
          handleRemoveCity={this.props.handleRemoveCity}
          handleUpdateCity={this.props.handleUpdateCity}
          serviceBookings={this.state.serviceBookings}
          activeServiceBookingKey={this.props.activeServiceBookingKey}
          isTaView={this.props.isTaView}
        />
      );
    } else {
      cities = (
        <div>
          <Card className='mt-20'>
            <div className='center-align p-50'>
              <a className='fs-20 cursor' onClick={this.changeCityModalState.bind(null, true, 0, 0, 'before')}><i className='mdi-content-add' /> Add City</a>
            </div>
          </Card>
          {
            this.state.isCityModalOpened ?
              <Modal style={{ width: '60%', overflowY: 'visible' }} actionButton={addCityButton} isModalOpened={this.state.isCityModalOpened} changeModalState={this.changeCityModalState}>
                <h3>Add City</h3>
                <div className={styles.select}>
                  {/* <Select value={this.state.city} onChange={this.handleOnChangeCity}>
                    <option disabled >Choose city</option>
                    {this.state.sortedCitiesList.filter(c => c.country === country.location.tpCode).map((city, index) => <option key={index} value={city.name}>{city.name}</option>)}
                  </Select> */}
                  <Select2
                    value={this.state.city}
                    onChange={this.handleOnChangeCity.bind(this)}
                    data={this.state.sortedCitiesList.filter(c => c.country === country.location.tpCode).sort((a, b) => {
                      if (a.name < b.name) return -1;
                      if (a.name > b.name) return 1;
                      return 0;
                    }).map((obj, index) => ({ text: obj.name, id: obj.name }))}
                  />
                </div>
              </Modal>
              : null
          }
        </div>
      );
    }

    const countryUnbookedServices = [];

    // START - city status/count of services
    const total_pax_errors = 0;

    const total_booked_services = this.state.count_total_booked_services;
    const total_on_request_services = this.state.count_total_on_request_services;
    // END - city status/count of services

    let aggregated_total_booked_services = '';
    if (total_booked_services > 0) {
      aggregated_total_booked_services = <span><i className='mdi mdi-cash-usd' /> {total_booked_services}</span>;
    }
    let aggregated_total_on_request_services = '';
    if (total_on_request_services > 0) {
      aggregated_total_on_request_services = <span><i className='mdi mdi-calendar-blank' style={{ color: '#f2ac17' }} /> {total_on_request_services}</span>;
    }

    let hasBookedService = false;
    if (total_booked_services > 0) {
      hasBookedService = true;
    }

    let btnClearItinerary = <li><a onClick={this.clearCountryItinerary}>Clear {this.props.country.location.name} itinerary</a></li>;
    if (this.state.countryUnbookedServices.length === 0) {
      btnClearItinerary = <li className={styles.linkDisabled}><a>Clear {this.props.country.location.name} itinerary</a></li>;
    }

    const btnDeleteItinerary = hasBookedService ?
      <li className={styles.linkDisabled}><a>Delete {this.props.country.location.name} itinerary</a></li>
      : <li><a onClick={this.props.handleRemoveCountry.bind(null, this.props.index)}>Delete {this.props.country.location.name} itinerary</a></li>;
    const toolTip = 'Action unavailable before active product booking.';
    const countryTitle = [
      <div className='row m-0' key='1'>
        <div className='col s7 p-0'>
          <p key='4' className='left m-0 light' style={{ fontSize: '10px' }}><span style={{ fontSize: '15px', fontWeight: 'bold' }}>{country.countryCode}</span> <br /> {this.props.country.durationDays} Days {this.props.country.durationNights} nights</p>
        </div>
        <div className='col s5 p-0'>
          <div className='row m-0' >
            <div className='col s3 p-0' style={{ textAlign: 'center', fontSize: '15px', marginTop: '2px' }}>
              {/* <i className='mdi mdi-account' style={{'color':'#d51224'}}/> {total_pax_errors}*/}
              <span><i className='mdi mdi-silverware-variant' style={{ marginLeft: '10px', color: '#eea400' }} /> {this.state.totalMissingMeals}</span>
            </div>
            <div className='col s3 p-0' style={{ textAlign: 'center', fontSize: '15px', marginTop: '2px' }}>
              {aggregated_total_booked_services}
            </div>
            <div className='col s2 p-0' style={{ textAlign: 'center', marginTop: '2px', fontSize: '15px' }}>
              {aggregated_total_on_request_services}
            </div>
            <div className='col s2 p-0' style={{ textAlign: 'center' }} >
              { this.props.isTaView ? null : (
                <Dropdown key='2' triggerButton={triggerButton}>
                  <li><a onClick={this.changeAvailabilityModalState.bind(this, true)}>Check availability</a></li>
                  <li><a onClick={this.changeBookModalState.bind(this, true)}>Book</a></li>
                  <li><a onClick={this.changeCancelBookModalState.bind(this, true)}>Cancel Bookings</a></li>
                  <li className='divider' />
                  <li><a onClick={this.changeCountryModalState.bind(null, true, this.props.index, 'before')}>Add country before</a></li>
                  <li><a onClick={this.changeCountryModalState.bind(null, true, this.props.index, 'after')}>Add country after</a></li>
                  {/* {(total_booked_services > 0) ? <li><a data-tip={toolTip} style={{ color: '#8c8c8c' }} >Add country before</a></li>
                      : <li><a onClick={this.changeCountryModalState.bind(null, true, this.props.index, 'before')}>Add country before</a></li>
                  }
                  {
                    (total_booked_services > 0) ? <li><a data-tip={toolTip} style={{ color: '#8c8c8c' }}>Add country after</a></li>
                      :<li><a onClick={this.changeCountryModalState.bind(null, true, this.props.index, 'after')}>Add country after</a></li>
                  }
                  <li className='divider' />
                  {
                    (total_booked_services > 0) ? <li><a data-tip={toolTip} style={{ color: '#8c8c8c' }}>Add city</a></li>
                  : <li><a onClick={this.changeCityModalState.bind(null, true, this.props.index, cities.length - 1, 'after')}>Add city</a></li>
                  } */}
                  <li className='divider' />
                  <li><a onClick={this.changeCityModalState.bind(null, true, this.props.index, cities.length - 1, 'after')}>Add city</a></li>
                  <li><a href='#!'>Add from template</a></li>
                  <li><a href='#!'>Save as template</a></li>
                  <li className='divider' />
                  {btnClearItinerary}
                  {btnDeleteItinerary}
                </Dropdown>)}
              <ReactTooltip />
            </div>
          </div>
        </div>
      </div>

    ];

    const isActive = this.props.activeDetail && this.props.activeDetail.__dataID__ === this.props.country.__dataID__;

    /* eslint-disable no-shadow */

    const cityBookings = _.get(this.props, 'country.cityBookings');
    // const cityBookingId = _.get(cityBookings.reverse(), '[0].id', ''); // this is reversing changes this.props.country.cityBookings so commented
    const cityBookingId = _.get(cityBookings, '[0].id', '');

    return (
      <div style={{ borderLeft: '1px solid #d2d2d2' }}>
        {/* trip arrival added*/}
        {
          this.props.index === 0 && this.props.country && this.props.country.transferPlacements && this.props.country.transferPlacements._key ?
            <Transfer
              proposalKey={this.props.viewer.proposal._key}
              key={this.props.country.transferPlacements._key}
              transferId={this.props.country.transferPlacements.id}
              transferPlacement={this.props.country.transferPlacements}
              tpBookingRef={tpBookingRef}
              country={this.props.country}
              isTripArrival
              tripStartDate={this.props.viewer.trips.startDate}
              isTaView={this.props.isTaView}
            /> : null
        }
        {/* trip arrival added*/}

        {
          this.props.country.transferPlacements && this.props.index !== 0 ?
            <Transfer
              proposalKey={this.props.viewer.proposal._key}
              key={this.props.country.transferPlacements._key}
              transferId={this.props.country.transferPlacements.id}
              transferPlacement={this.props.country.transferPlacements}
              cityBookingId={cityBookingId}
              country={this.props.country}
              tpBookingRef={tpBookingRef}
              isTaView={this.props.isTaView}
            /> : null
        }

        {this.state.repeatedCountryWarning}

        <Card title={countryTitle} titleClassName={cx({ 'active-detail': isActive })} countryPanel noBoxShadow className='country' countryStyle>
          {cities}
        </Card>


        {/* trip deprature */}
        {
          this.props.index !== 0 && isCheckLastCountry && this.props.country && this.props.country.transferPlacements && this.props.country.transferPlacements._key ?
            <Transfer
              proposalKey={this.props.viewer.proposal._key}
              key={`${this.props.country.transferPlacements._key}_1`}
              transferId={this.props.country.transferPlacements.id}
              transferPlacement={this.props.country.transferPlacements}
              tpBookingRef={tpBookingRef}
              country={this.props.country}
              isTaView={this.props.isTaView}
              isTripDeparture
            /> : null
        }
        {/* trip departure */}

        {
          this.state.isCountryModalOpened ?
            <Modal style={{ width: '60%', overflowY: 'visible' }} actionButton={addCountryButton} isModalOpened={this.state.isCountryModalOpened} changeModalState={this.changeCountryModalState}>
              <h3>Add Country(s)</h3>
              <div className={styles.select}>
                {/* <Select value='Choose country' onChange={this.handleOnChangeCountry}>
                  <option disabled >Choose country</option>
                  {this.props.countries.filter(c => c.isEXODestination).map((country, index) => <option key={index} value={country.name}>{country.name}</option>)}
                </Select> */}
                <Select2
                  id='countrySelect'
                  value={this.state.country}
                  onChange={this.handleOnChangeCountry.bind(this)}
                  data={this.props.countries.filter(c => c.isEXODestination).sort((a, b) => {
                    if (a.name < b.name) return -1;
                    if (a.name > b.name) return 1;
                    return 0;
                  }).map((obj, index) => ({ text: obj.name, id: obj.name }))}
                />
              </div>
            </Modal>
            : null

        }
        {
          this.state.isCityModalOpened ?
            <Modal style={{ width: '60%', overflowY: 'visible' }} actionButton={addCityButton} isModalOpened={this.state.isCityModalOpened} changeModalState={this.changeCityModalState}>
              <h3>Add City</h3>
              <div className={styles.select}>
                {/* <Select value={this.state.city} onChange={this.handleOnChangeCity}>
                  <option disabled >Choose city</option>
                  {this.state.sortedCitiesList.filter(c => c.country === country.location.tpCode).map((city, index) => <option key={index} value={city.name}>{city.name}</option>)}
                </Select> */}
                <Select2
                  value={this.state.city}
                  onChange={this.handleOnChangeCity.bind(this)}
                  data={this.state.sortedCitiesList.filter(c => c.country === country.location.tpCode).sort((a, b) => {
                    if (a.name < b.name) return -1;
                    if (a.name > b.name) return 1;
                    return 0;
                  }).map((obj, index) => ({ text: obj.name, id: obj.name }))}
                />
              </div>
            </Modal>
            : null
        }
        { /* BOOK TO TP */ }
        {
          this.state.isBookModalOpened ?
            <Modal actionButton={bookCountryButton} isModalOpened={this.state.isBookModalOpened} changeModalState={this.changeBookModalState}>
              <h3>Book country services</h3>
              <span>This will book all services for </span>
              <h5>{this.props.country.location.name}</h5>
              <span>After booking, cancellation and change fees may apply. Do you want to book all services?</span>
            </Modal>
            : null
        }
        {
          this.state.isCancelBookModalOpened ?
            <Modal actionButton={cancelBookButton} isModalOpened={this.state.isCancelBookModalOpened} changeModalState={this.changeCancelBookModalState}>
              <h3>Cancel country service bookings</h3>
              <span>This will cancel confirmed service bookings for </span>
              <h5>{this.props.country.location.name}</h5>
              <span>Cancellation and change fees may apply. Do you wantt to cancel all services?</span>
            </Modal>
            : null
        }
        { /* CHECK AVAILABILITY */}
        {
          this.state.isAvailabilityModalOpened ?
            <Modal actionButton={checkCountryButton} isModalOpened={this.state.isAvailabilityModalOpened} changeModalState={this.changeAvailabilityModalState}>
              <h3>Check availability for country services</h3>
              <span>This will check all services for </span>
              <h5>{this.props.country.location.name}</h5>
              <span>Do you want to check all services?</span>
            </Modal>
            : null
        }
      </div>
    );

    /* eslint-enable no-shadow */
  }
}
