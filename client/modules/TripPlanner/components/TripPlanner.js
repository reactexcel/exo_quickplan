import React from 'react';
import Relay from 'react-relay';
import PubSub from 'pubsub-js';
import cx from 'classnames';
import { browserHistory } from 'react-router';
import AddCountryMutation from '../../Country/mutations/AddCountry';
import RemoveCountryMutation from '../../Country/mutations/RemoveCountry';
import RemoveCityMutation from '../../City/mutations/RemoveCity';
import UpdateCityMutation from '../../City/mutations/UpdateCity';
import CloneTripMutation from '../../Trip/mutations/Clone';
import DeleteTripMutation from '../../Trip/mutations/Delete';
import UpdateTripMutation from '../../Trip/mutations/Update';
import UpdateProposalDetails from '../../Proposal/mutations/UpdateProposalDetails';
import Country from '../../Country/containers/Country';
import TourInfobox from '../../InfoBox/renderers/TourInfoboxRenderer';
import AccommodationInfobox from '../../InfoBox/renderers/AccommodationInfoboxRenderer';
import TransferInfobox from '../../InfoBox/renderers/TransferInfoboxRenderer';
import LocalTransferInfobox from '../../InfoBox/renderers/LocalTransferInfoboxRenderer';
import PlaceholderInfobox from '../../InfoBox/renderers/PlaceholderInfoboxRenderer';
import TripInfobox from '../../InfoBox/components/TripInfobox';
import ProposalHeader from '../../Proposal/components/ProposalHeader';
import SideNav from '../../Proposal/components/SideNav';
import { Modal, Card, Select, Select2 } from '../../Utils/components';
import './../TripPlanner.scss';
import SERVICES from '../../../services';
import TripHeaderSlide from './TripHeaderSlide';
import DeleteTripModal from '../components/DeleteTripModal';
import { getUserRole } from '../../../services/user';

import ServicesAvailabilityCheckingMutation from '../../ServiceBooking/mutations/ServicesAvailability';
import CancelTourplanTripBooking from '../../Trip/mutations/CancelServices';
import TripBookServiceMutation from '../../Trip/mutations/BookServices';

import Transfer from '../../Transfer/renderers/TransferRenderer';

export default class TripPlanner extends React.Component {
  static propTypes = {
    viewer: React.PropTypes.object.isRequired,
    relay: React.PropTypes.object
  };

  // static countries = ['Cambodia', 'China', 'Indonesia', 'Japan', 'Laos', 'Malaysia', 'Myanmar', 'Thailand', 'Vietnam'];
  // static cities = {
  //   Thailand: ['Bangkok', 'Chiang Mai', 'Chiang Rai', 'Pattaya', 'Phuket'],
  //   Vietnam: ['Da Nang', 'Hanoi', 'Hoi An', 'Ho Chi Minh City']
  // };

  state = {
    activeDetail: null,
    isCountryModalOpened: false,
    isAccommodationModalOpened: false,
    isDeleteTripModalOpened: false,
    isCancelBookedModalOpened: false,
    isCheckModalOpened: false,
    infoBoxData: { type: 'tripinfo' },
    isSideNavOpen: true,
    count_total_booked_services: 0,
    count_total_on_request_services: 0,
    country: 'Choose country',
    cityDays: {},
  };

  componentWillMount() {
    this.init();
    this.psInfobox = PubSub.subscribe('Infobox', (msg, data) => {
      if (data.type !== 'clear') {
        this.props.relay.forceFetch();
        this.setState({ infoBoxData: data });
      } else {
        this.setState({ infoBoxData: null });
      }
    });

    this.psForceFetch = PubSub.subscribe('TripForceFetch', () => {
      this.props.relay.forceFetch();
    });


    PubSub.subscribe('showTripInfobox', (msg, data) => {
      this.showTripInfobox();
    });

    this._extractServicesCount();
    const value = this.props.viewer.proposal && this.props.viewer.proposal.TA && this.props.viewer.proposal.TA.office && this.props.viewer.proposal.TA.office._key;
    const TAOff = this.props.viewer.taOffices.filter(off => off._key === value);
    SERVICES.selectedTAOffice = TAOff[0];
    SERVICES.pax = this.props.viewer.paxs;
  }

  componentWillUpdate() {
    this.init();
  }

  // componentWillUnmount() {
  //   PubSub.unsubscribe(this.psInfobox);
  //   PubSub.unsubscribe(this.psForceFetch);
  //   PubSub.unsubscribe(this.psAddTripArrival);
  // }

  _extractServicesCount() {
    // START - city status/count of services
    let total_booked_services = 0;
    let total_on_request_services = 0;
    let hotel_booked = 0;
    let hotel_on_request = 0;
    if (this.props.viewer.trips && this.props.viewer.trips.countryBookings && this.props.viewer.trips.countryBookings.length > 0) {
      this.props.viewer.trips.countryBookings.map((country_booking, ccb_key) => { // eslint-disable-line array-callback-return
        if (country_booking.cityBookings && country_booking.cityBookings.length > 0) {
          country_booking.cityBookings.map((city_booking, cb_key) => { // eslint-disable-line array-callback-return
            // start - for hotel
            if (city_booking.accommodationPlacements && city_booking.accommodationPlacements.length > 0) {
              city_booking.accommodationPlacements.map((city_accommodationPlacements, hi) => { // eslint-disable-line array-callback-return
                if (city_accommodationPlacements.serviceBookings) {
                  city_accommodationPlacements.serviceBookings.map((hh, hhi) => { // eslint-disable-line array-callback-return
                    if (hh.status && hh.status.state) {
                      if (hh.status.state === 'Booked') {
                        hotel_booked += 1;
                      } else if (hh.status.state === 'On Request') {
                        hotel_on_request += 1;
                      }
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
                    if (v.status && v.status.state) {
                      if (v.status.state === 'Booked') {
                        total_booked_services += 1;
                      } else if (v.status.state === 'On Request') {
                        total_on_request_services += 1;
                      }
                    }
                  });
                }
              });
            }
            // end - tour and transfer
          });
        }
      });
    }
    total_booked_services += hotel_booked;
    total_on_request_services += hotel_on_request;
    // END - city status/count of services
    this.setState({
      count_total_booked_services: total_booked_services,
      count_total_on_request_services: total_on_request_services
    });
  }

  componentWillReceiveProps(nextProps) {
    // //counting citydays for accommodation info box
    if (this.state.infoBoxData != null) {
      if (this.state.infoBoxData.type === 'accommodation') {
        if (nextProps.viewer.trip && nextProps.viewer.trip.countryBookings && nextProps.viewer.trip.countryBookings.length > 0) {
          nextProps.viewer.trip.countryBookings.map((country_booking, ccb_key) => { // eslint-disable-line array-callback-return
            if (country_booking.cityBookings && country_booking.cityBookings.length > 0) {
              country_booking.cityBookings.map((city_booking, cb_knextPropsey) => { // eslint-disable-line array-callback-return
                if (city_booking._key === this.state.infoBoxData.cityBookingKey) {
                  this.setState({ cityDays: city_booking.cityDays });
                }
              });
            }
          });
        }
      }
    }
    // //////////////////////////////////////
    this._extractServicesCount();
  }

  init() {
    this.selectedCountries = [];
    // this.addedCountryOrder;
    // this.addedCountryIndex;
  }

  changeCountryModalState = (isOpen, addedIndex, addedOrder) => {
    this.setState({ isCountryModalOpened: isOpen });
    this.addedCountryIndex = addedIndex;
    this.addedCountryOrder = addedOrder;
  };

  handleOnChangeCountry = (e) => {
    this.selectedCountries = [...e.target.options].filter(country => country.selected).map(country => country.value);
  };

  handleAddCountryModal = () => {
    this.handleAddCountry(this.selectedCountries, this.addedCountryOrder, this.addedCountryIndex, this.selectedCountries[0]);
    this.selectedCountries = [];
  };

  handleAddCountry = (countries, addedCountryOrder, addedCountryIndex, countryCode) => {
    Relay.Store.commitUpdate(new AddCountryMutation({
      tripId: this.props.viewer.trips.id,
      tripKey: this.props.viewer.trips._key,
      countries,
      order: addedCountryOrder,
      addedIndex: addedCountryIndex,
      countryCode
    }), {
      onSuccess: () => {
        this.props.relay.forceFetch();
      }
    });
  };

  shouldOpenDeleteTripModal = () => {
    const { status: tripStatus } = this.props.viewer.trips;
    return !(tripStatus === 'booked');
  };


  changeDeleteTripModalState = (isOpen, idx) => {
    if (this.shouldOpenDeleteTripModal()) {
      this.setState({ isDeleteTripModalOpened: isOpen, tripModalIdx: idx });
    }
  };


  handleRemoveCountry = (removedCountryIndex) => {
    Relay.Store.commitUpdate(new RemoveCountryMutation({
      tripId: this.props.viewer.trips.id,
      tripKey: this.props.viewer.trips._key,
      removedIndex: removedCountryIndex
    }), {
      onSuccess: () => {
        this.props.relay.forceFetch();
      }
    });
  };

  handleRemoveCity = (countryBookingKey, countryIndex, cityBookingKey, cityIndex) => {
    Relay.Store.commitUpdate(new RemoveCityMutation({
      tripId: this.props.viewer.trips.id,
      tripKey: this.props.viewer.trips._key,
      countryIndex,
      cityIndex,
      countryBookingKey,
      cityBookingKey
    }), {
      onSuccess: () => {
        this.props.relay.forceFetch();
      },
      onError: () => {
        this.props.relay.forceFetch();
      }
    });
  };

  handleUpdateCity = (countryIndex, cityIndex, otherProps) => {
    Relay.Store.commitUpdate(new UpdateCityMutation({ tripId: this.props.viewer.trips.id, tripKey: this.props.viewer.trips._key, countryIndex, cityIndex, ...otherProps }));
  };

  handleTripClone = () => {
    const tripKey = this.props.viewer.trips._key;
    const proposalKey = this.props.proposalKey;
    const onCloneSuccess = function onSuccess(res) {
      browserHistory.push(`/trip-planner/${proposalKey}/${res.cloneTrip.tripKey}`);
    };
    Relay.Store.commitUpdate(new CloneTripMutation({
      tripKey
    }), {
      onSuccess: onCloneSuccess,
      onFailure: response => console.log('trip clone failed', response) // eslint-disable-line no-console
    });
  };

  handleTripRemove = () => {
    const tripKey = this.props.viewer.trips._key;
    const proposalKey = this.props.proposalKey;
    const onCloneSuccess = () => {
      browserHistory.replace(`/trip-planner/${proposalKey}`);
      // browserHistory.push(`/trip-planner/${proposalKey}`);
    };
    Relay.Store.commitUpdate(new DeleteTripMutation({
      tripKey
    }), {
      onSuccess: onCloneSuccess,
      onFailure: response => console.log('trip delete failed', response) // eslint-disable-line no-console
    });
  }

  handleTripComplete = () => {
    const id = this.props.viewer.trips.id;
    const _key = this.props.viewer.trips._key;
    Relay.Store.commitUpdate(new UpdateTripMutation({
      id,
      _key,
      status: 'Complete'
    }));
  }

  changeTripBookModalState = (isOpen) => {
    this.setState({ isTripBookModalOpened: isOpen });
  };

  handleTripBook = () => {
    const forceFetch = () => this.props.relay.forceFetch();
    const updateProposalStatus = () => {
      // NOTES, update the proposal to Confirmed when a trip in the proposal moves to the Booked status.
      // or add this mutation in backend logic of trip book.
      const proposalKey = this.props.proposalKey;
      Relay.Store.commitUpdate(new UpdateProposalDetails({
        _key: proposalKey,
        status: 'Confirmed'
      }), {
        onSuccess: forceFetch,
        onError: forceFetch
      });
    };
    Relay.Store.commitUpdate(new TripBookServiceMutation({
      tripBookingKey: this.props.viewer.trips._key,
    }), {
      onSuccess: updateProposalStatus,
      onError: forceFetch
    });
  }

  changeCancelBookedModalState = (isOpen) => {
    this.setState({ isCancelBookedModalOpened: isOpen });
  };

  handleTripCancel = () => {
    Relay.Store.commitUpdate(new CancelTourplanTripBooking({
      tripBookingKey: this.props.viewer.trips._key,
    }), {
      onSuccess: () => {
        this.props.relay.forceFetch();
      },
      onError: () => {
        this.props.relay.forceFetch();
      }
    });
  }

  changeCheckModalState = (isOpen) => {
    this.setState({ isCheckModalOpened: isOpen });
  }

  handleCheckServicesAvailability = () => {
    Relay.Store.commitUpdate(new ServicesAvailabilityCheckingMutation({
      startNodeId: `trips/${this.props.viewer.trips._key}`
    }), {
      onSuccess: (res) => {
        PubSub.publish('TripForceFetch', {});
      },
      onFailure: (err) => {
        console.log('handleCheckServicesAvailability Error:', err);
      }
    });
  };

  showTripInfobox = () => {
    this.setState({
      infoBoxData: {
        type: 'tripinfo'
      }
    });
  }

  renderTripHeader() {
    const {
      trip: {
        _key: tripKey
      },
      proposal: {
        _key: proposalKey
      }
    } = this.props.viewer;
    const userRole = getUserRole() || 'TC';

    return (<div className='row m-0' style={{ border: '1px solid rgba(222,217,220,1)' }} >
      <div className={cx('col p-0', { s4: !SERVICES.isSideNavOpen }, { s2: SERVICES.isSideNavOpen })}>
        <p className='left m-0 light' style={{ fontSize: '10px', paddingLeft: '15px', paddingTop: '7px' }}>
          <span style={{ fontSize: '15px', fontWeight: 'bold', cursor: 'pointer' }} onClick={this.showTripInfobox}>Trip Itinerary</span> <br />
          { this.props.viewer.trip.durationDays ? `${this.props.viewer.trip.durationDays} Days ${this.props.viewer.trip.durationDays - 1} Nights` : null }
        </p>
      </div>
      <div className={cx('col p-0', { s8: !SERVICES.isSideNavOpen }, { s10: SERVICES.isSideNavOpen })}>
        { userRole === 'TA' ? this.renderTATripHeader() : this.renderTCTripHeader() }
      </div>
      <DeleteTripModal
        toggle={this.changeDeleteTripModalState}
        isOpened={this.state.isDeleteTripModalOpened}
        deleteTrip={() => this.handleTripRemove()}
        isModalCloseOnSave={false}
      />
    </div>);
  }

  renderTCTripHeader() {
    const {
      trip: {
        _key: tripKey
      },
      proposal: {
        _key: proposalKey
      }
    } = this.props.viewer;
    return (<div className='row m-0' style={{ fontSize: '10px', textAlign: 'right', color: '#55b493', fontWeight: 'bold', position: 'relative', top: '20px' }}>
      {/*
        <div className='col p-0 s2' style={{ position: 'relative', left: '5%' }} onClick={() => this.handleTripComplete()}>
        <i className='mdi mdi-check' style={{ fontSize: '15px' }} /> <span style={{ color: '#7fc7b3', cursor: 'pointer' }}>COMPLETE</span>
      </div>
      */}
      <div className='col p-0 s2' style={{ position: 'relative', left: '5%' }} onClick={() => this.changeCheckModalState(true)}>
        <i className='mdi mdi-calendar-check' style={{ fontSize: '15px' }} /> <span style={{ color: '#7fc7b3', cursor: 'pointer' }}>CHECK</span>
      </div>
      <div className='col p-0 s2'>
        <i className='mdi mdi-check-all' style={{ fontSize: '15px' }} /> <span style={{ color: '#7fc7b3', cursor: 'pointer' }}>APPROVE</span>
      </div>
      <div className='col p-0 s1' style={{ position: 'relative', left: '2%' }} onClick={() => { window.location.href = `/itinerary_summary/${proposalKey}/${tripKey}`; }}>
        <i className='mdi mdi-arrow-up-bold' style={{ fontSize: '15px' }} /> <span style={{ color: '#7fc7b3', cursor: 'pointer' }}>PUBLISH</span>
      </div>
      <div className='col p-0 s2' style={{ position: 'relative', left: '2%', bottom: '3px' }} onClick={() => this.changeTripBookModalState(true)}>
        <i className='mdi-action-event' style={{ fontSize: '15px' }} /> <span style={{ color: '#7fc7b3', cursor: 'pointer' }}>BOOK AVAILABLE</span>
      </div>
      <div className='col p-0 s2' style={{ position: 'relative', left: '2%' }} onClick={() => this.changeCancelBookedModalState(true)}>
        <i className='mdi mdi-close-circle-outline' style={{ fontSize: '15px' }} /> <span style={{ color: '#7fc7b3', cursor: 'pointer' }}>CANCEL BOOKED</span>
      </div>
      <div className='col p-0 s1' style={{ position: 'relative', left: '4%' }} onClick={() => this.handleTripClone()}>
        <i className='mdi mdi-content-copy' style={{ fontSize: '15px' }} /> <span style={{ color: '#7fc7b3', cursor: 'pointer' }}>CLONE</span>
      </div>
      { this.props.viewer.trips.status === 'Booked' ? (
        <div className='col p-0 s1 exo-colors-text text-label-1' style={{ position: 'relative', left: '6%', bottom: '3px' }}>
          <i className='mdi-action-delete' style={{ fontSize: '15px' }} />
          <span style={{ cursor: 'not-allowed' }}>REMOVE</span>
        </div>
          ) : (
            <div className='col p-0 s1' style={{ position: 'relative', left: '6%', bottom: '3px' }} onClick={() => this.changeDeleteTripModalState(true)}>
              <i className='mdi-action-delete' style={{ fontSize: '15px' }} /> <span style={{ color: '#7fc7b3', cursor: 'pointer' }}>REMOVE</span>
            </div>
          )}
    </div>);
  }

  renderTATripHeader() {
    const {
      trip: {
        _key: tripKey
      },
      proposal: {
        _key: proposalKey
      }
    } = this.props.viewer;
    return (<div className='row m-0 pr-30 right' style={{ fontSize: '10px', textAlign: 'right', color: '#55b493', fontWeight: 'bold', position: 'relative', top: '20px' }}>
      <div className='col p-0 ml-30' onClick={() => this.changeCheckModalState(true)}>
        <i className='mdi mdi-calendar-check' style={{ fontSize: '15px' }} /> <span style={{ color: '#7fc7b3', cursor: 'pointer' }}>CHECK</span>
      </div>
      <div className='col p-0 ml-30'>
        <i className='mdi mdi-check-all' style={{ fontSize: '15px' }} /> <span style={{ color: '#7fc7b3', cursor: 'pointer' }}>APPROVE</span>
      </div>
      <div className='col p-0 ml-30' onClick={() => { window.location.href = `/itinerary_summary/${proposalKey}/${tripKey}`; }}>
        <i className='mdi mdi-arrow-up-bold' style={{ fontSize: '15px' }} /> <span style={{ color: '#7fc7b3', cursor: 'pointer' }}>PUBLISH</span>
      </div>
      <div className='col p-0 ml-30' onClick={() => this.changeTripBookModalState(true)}>
        <i className='mdi mdi-cash-usd' style={{ fontSize: '15px' }} /> <span style={{ color: '#7fc7b3', cursor: 'pointer' }}>BOOK AVAILABLE</span>
      </div>
      <div className='col p-0 ml-30' onClick={() => this.changeCancelBookedModalState(true)}>
        <i className='mdi mdi-close-circle-outline' style={{ fontSize: '15px' }} /> <span style={{ color: '#7fc7b3', cursor: 'pointer' }}>CANCEL BOOKED</span>
      </div>
    </div>);
  }


  // showHideSideNav = () => {

  // }
  render() {
    const value = this.props.viewer.proposal && this.props.viewer.proposal.TA && this.props.viewer.proposal.TA.office && this.props.viewer.proposal.TA.office._key;
    const TAOff = this.props.viewer.taOffices.filter(off => off._key === value);
    SERVICES.selectedTAOffice = TAOff[0];
    // // start --get most latest added accoomodation palcement key
    if (this.props.viewer.trips.countryBookings) {
      this.props.viewer.trips.countryBookings.map((a_con, i) => { // eslint-disable-line array-callback-return
        if (a_con.cityBookings) {
          a_con.cityBookings.map((a_city, j) => { // eslint-disable-line array-callback-return
            if (a_city.accommodationPlacements) {
              a_city.accommodationPlacements.map((a_accm, k) => { // eslint-disable-line array-callback-return
                SERVICES.tripMostLatestAccommodationPlacementKey = a_accm._key; // this is the most latest accomodation added
                if (a_accm.serviceBookings && a_accm.serviceBookings.length > 0) {
                  if (a_accm.serviceBookings[0].roomConfigs) {
                    SERVICES.tripMostLatestAccommodationRoomConfig = a_accm.serviceBookings[0].roomConfigs;
                  }
                }
              });
            }
          });
        }
      });
    }
    // end --get most latest added accoomodation palcement key

    const userRole = getUserRole() || 'TC';

    // start - pax count
    let nrOfAdults = 0;
    let nrOfChildren = 0;
    let nrOfInfants = 0;
    let nrTotalPax = 0;
    if (this.props.viewer.paxs && this.props.viewer.paxs.length > 0) {
      this.props.viewer.paxs.map((px, i) => { // eslint-disable-line array-callback-return
        if (px.ageGroup) {
          if (px.ageGroup === 'children') {
            nrOfChildren += 1;
          } else if (px.ageGroup === 'adults') {
            nrOfAdults += 1;
          } else if (px.ageGroup === 'infants') {
            nrOfInfants += 1;
          }
        }
      });
    }
    nrTotalPax = nrOfAdults + nrOfChildren + nrOfInfants;
    const nrPaxs = {
      nrOfAdults,
      nrOfChildren,
      nrOfInfants,
      nrTotalPax
    };
    // end - pax count


    SERVICES.tripPlannerCountriesOpted = []; // reset it to empty since it is required only for view purpose
    let countries;
    let tripDeparture;
    if (this.props.viewer.trips && this.props.viewer.trips.countryOrder.length) {
      let showTripDeparture = false;
      countries = this.props.viewer.trips.countryBookings.map((country, index) => {
        if (country && country.cityBookings && country.cityBookings.length > 0) {
          showTripDeparture = true; // trip departure will onlu show if atleast 1 country and 1 city is there
        }

        return (<Country
          totalCountry={this.props.viewer.trips.countryBookings.length}
          key={index}
          index={index}
          viewer={this.props.viewer}
          country={country}
          countries={this.props.viewer.locations.filter(c => c.type === 'country')}
          cities={this.props.viewer.locations.filter(c => c.type === 'city')}
          activeDetail={this.state.activeDetail}
          handleAddCountry={this.handleAddCountry}
          handleRemoveCountry={this.handleRemoveCountry}
          handleRemoveCity={this.handleRemoveCity}
          handleUpdateCity={this.handleUpdateCity}
          getServicesByCountryBookingKey={this.props.viewer}
          activeServiceBookingKey={this.state.infoBoxData && this.state.infoBoxData.serviceBookingKey}
          isTaView={userRole === 'TA'}
        />);
      });

      if (showTripDeparture === true && this.props.viewer.trip.departureTransferPlacement && this.props.viewer.trip.departureTransferPlacement._key) {
        const DTP = this.props.viewer.trip.departureTransferPlacement;
        tripDeparture = (<Transfer
          proposalKey={this.props.viewer.proposal._key}
          key={DTP.transferPlacement._key}
          transferId={DTP.transferPlacement._key}
          transferPlacement={DTP.transferPlacement}
          // tpBookingRef={tpBookingRef}
          // country={this.props.country}
          // isTaView={this.props.isTaView}
          isTripDeparture
        />);
      }
    } else {
      const addCountryButton = <a className='modal-action modal-close waves-effect waves-green btn' onClick={this.handleAddCountryModal}><i className='mdi-action-input left' />Add</a>;
      countries = (
        <div>
          <Card className='mt-20'>
            <div className='center-align p-50'>
              <a className='fs-20 cursor' onClick={this.changeCountryModalState.bind(null, true, 0, 'before')}><i className='mdi-content-add' /> Add Country</a>
            </div>
          </Card>
          {
            this.state.isCountryModalOpened ?
              <Modal style={{ width: '60%', overflowY: 'visible' }} actionButton={addCountryButton} isModalOpened={this.state.isCountryModalOpened} changeModalState={this.changeCountryModalState}>
                <h3>Add Country(s)</h3>
                <div className='select'>
                  {/* <Select id='countrySelect' value={this.state.country} onChange={this.handleOnChangeCountry}>
                    <option disabled>Choose country</option>
                    {this.props.viewer.locations.filter(c => c.type === 'country' && c.isEXODestination).map((country, index) => <option key={index} value={country.name}>{country.name}</option>)}
                  </Select> */}
                  <Select2
                    id='countrySelect'
                    value={this.state.country}
                    onChange={this.handleOnChangeCountry.bind(this)}
                    data={this.props.viewer.locations.filter(c => c.type === 'country' && c.isEXODestination).sort((a, b) => {
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


    let activeDetailBox = null;
    if (this.state.infoBoxData) {
      const infoBoxData = { ...this.state.infoBoxData };
      // auto refresh the tpBookingRef in the infoBoxData.
      if (!infoBoxData.tpBookingRef || infoBoxData.tpBookingRef === '') {
        if (infoBoxData.cityBookingKey && this.props.viewer.trips) {
          const countryBookings = this.props.viewer.trips.countryBookings || [];
          const countryBookingOfInfobox = countryBookings.find(countryBooking => countryBooking.cityBookings && countryBooking.cityBookings.find(cityBooking => cityBooking._key === infoBoxData.cityBookingKey));
          if (countryBookingOfInfobox && countryBookingOfInfobox.tpBookingRef && countryBookingOfInfobox.tpBookingRef !== '') {
            infoBoxData.tpBookingRef = countryBookingOfInfobox.tpBookingRef;
          }
        }
      }

      if (infoBoxData.type === 'tour') {
        activeDetailBox = (
          <TourInfobox
            serviceBookingKey={infoBoxData.serviceBookingKey}
            cityDayKey={infoBoxData.cityDayKey}
            cityBookingKey={infoBoxData.cityBookingKey}
            tripKey={this.props.viewer.trips._key}
            paxs={this.props.viewer.paxs}
            infoBoxData={infoBoxData}
          />
        );
      } else if (infoBoxData.type === 'accommodation') {
        activeDetailBox = (
          <AccommodationInfobox
            accommodationPlacementKey={infoBoxData.accommodationPlacementKey}
            tripKey={this.props.viewer.trips._key}
            cityBookingKey={infoBoxData.cityBookingKey}
            paxs={this.props.viewer.paxs}
            infoBoxData={infoBoxData}
            nrPaxs={nrPaxs}
            cityDays={this.state.cityDays}
          />
        );
      } else if (infoBoxData.type === 'transfer') {
        activeDetailBox = (
          <TransferInfobox
            infoBoxData={infoBoxData}
            transferPlacementId={infoBoxData.transferPlacementId}
            nrPaxs={nrPaxs}
          />
        );
      } else if (infoBoxData.type === 'localtransfer') {
        activeDetailBox = (
          <LocalTransferInfobox
            infoBoxData={infoBoxData}
            cityBookingKey={infoBoxData.cityBookingKey}
            transferPlacementId={infoBoxData.transferPlacementId}
            nrPaxs={nrPaxs}
          />
        );
      } else if (infoBoxData.type === 'tripinfo') {
        activeDetailBox = <TripInfobox tripKey={this.props.viewer.trips._key} />;
      } else {
        activeDetailBox = (
          <PlaceholderInfobox
            serviceBookingKey={infoBoxData.serviceBookingKey}
            cityDayKey={infoBoxData.cityDayKey}
            cityBookingKey={infoBoxData.cityBookingKey}
          />
        );
      }
    }


    // START - city status/count of services
    const total_pax_errors = 0;
    const total_booked_services = this.state.count_total_booked_services;
    const total_on_request_services = this.state.count_total_on_request_services;


    let aggregated_total_booked_services = '';
    if (total_booked_services > 0) {
      aggregated_total_booked_services = <span><i className='mdi mdi-cash-usd' style={{ marginLeft: '10px' }} /> {total_booked_services}</span>;
    }
    let aggregated_total_on_request_services = '';
    if (total_on_request_services > 0) {
      aggregated_total_on_request_services = <span><i className='mdi mdi-calendar' style={{ marginLeft: '10px', color: '#f2ac17' }} /> {total_on_request_services}</span>;
    }


    // END - city status/count of services

    let tripHeaderOptions = '';
    let tripItineraryOptions = '';

    if (this.props.viewer.trips && this.props.viewer.trips.countryOrder.length) {
      tripHeaderOptions = this.renderTripHeader();
      tripItineraryOptions = (<div className='row m-0' style={{ border: '1px solid #ccc', borderTop: '0px', paddingTop: '7px' }}>
        <div className='col pl-10 s4'>
          <span style={{ cursor: 'pointer' }} onClick={this.showTripInfobox}>Trip Itinerary</span>
        </div>
        <div className='col p-0 s4'>
          {`${this.props.viewer.trip.durationDays} Days ${this.props.viewer.trip.durationDays > 1 ? this.props.viewer.trip.durationDays - 1 : 0} Nights` }
        </div>
        <div className='col p-0 s4' style={{ textAlign: 'center', fontSize: '15px' }}>
          {/* <i className='mdi mdi-account' style={{'color':'#d51224'}}/> {total_pax_errors}*/}
          {aggregated_total_on_request_services}
          {aggregated_total_booked_services}
        </div>
      </div>);
    }
    const slideWidth = this.state.isSideNavOpen ? '300px' : '50px';
    const proposalTitle = (<div>
      {/* <span className='exo-colors-text text-data-1 fs-20 fw-700'>Proposal</span>
      <span className='exo-colors-text text-data-1 fs-16 fw-600 ml-20 mt-20'>{this.props.viewer.proposal._key}</span> */}
      <span className='exo-colors-text text-data-1 fs-15 fw-600 ml-20 mt-20'>Trip</span>
      <span className='exo-colors-text text-data-1 fs-15 fw-600 ml-20 mt-20'>{this.props.viewer.trip._key}</span>
    </div>);
    const tripHeaderSlide = (<SideNav width={slideWidth} changeSideNavState={(isOpened) => { this.setState({ isSideNavOpen: isOpened }); SERVICES.isSideNavOpen = isOpened; }} isSideNavOpen={this.state.isSideNavOpen} titleInCloseState={proposalTitle}>
      <ProposalHeader proposal={this.props.viewer.proposal} isProposalKeyClick closeProposalHeaderSideNav={() => { this.setState({ isSideNavOpen: false }); SERVICES.isSideNavOpen = false; }} />
      <TripHeaderSlide {...this.props} />
    </SideNav>);

    const cancelBookedButton = <a className='modal-action modal-close waves-effect btn red' onClick={() => this.handleTripCancel()}><i className='mdi-editor-attach-money left' />CANCEL All BOOKED</a>;
    const cancelBookedModal = this.state.isCancelBookedModalOpened ?
      (<Modal actionButton={cancelBookedButton} isModalOpened={this.state.isCancelBookedModalOpened} changeModalState={this.changeCancelBookedModalState}>
        <span>This will cancel all confirmed bookings in the trip</span><br />
        <span>Cancellation and change fees may apply. Do you want to cancel this booking?</span>
      </Modal>)
      : null;

    const tripBookButton = <a className='modal-action modal-close waves-effect waves-green btn' onClick={() => this.handleTripBook()}><i className='mdi-editor-attach-money left' />BOOK ALL AVAILABLE</a>;
    const tripBookModal = this.state.isTripBookModalOpened ? (
      <Modal actionButton={tripBookButton} isModalOpened={this.state.isTripBookModalOpened} changeModalState={this.changeTripBookModalState}>
        <span>This will book all available products in the trip</span><br />
        <span>After the booking cancellation and change fees may apply. Do you want to book this trip?</span>
      </Modal>) : null;

    const checkTripButton = <a className='modal-action modal-close waves-effect waves-green btn' onClick={() => this.handleCheckServicesAvailability()}><i className='mdi-editor-attach-money left' />Check Availability</a>;
    const checkTripModal = this.state.isCheckModalOpened ? (
      <Modal actionButton={checkTripButton} isModalOpened={this.state.isCheckModalOpened} changeModalState={this.changeCheckModalState}>
        <h3>Check availability for trip services</h3>
        <span>This will check all services of this trip. </span><br />
        <span>Do you want to check all services?</span>
      </Modal>) : null;

    return (
      <div style={{ padding: '1.5% 2.5% 0 1%' }}>
        {tripHeaderSlide}
        <div style={{ marginLeft: slideWidth, backgroundColor: 'white', borderRight: '1px solid #d2d2d2' }}>
          {tripHeaderOptions}
          {cancelBookedModal}
          {tripBookModal}
          {checkTripModal}
          <div className='row m-0'>
            <div className='col s8 p-0'>

              {/* sdsd
            <Tabs>
              <Tab title='ITINERARY' active>{countries}</Tab>
              <Tab title='MAP' />
              <Tab title='STRUCTURE'><Structure /></Tab>
            </Tabs>
          **/}

              {/* {tripItineraryOptions} */}
              {countries}
              {tripDeparture}
            </div>
            <div className='col s4 p-0'>
              {activeDetailBox}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
