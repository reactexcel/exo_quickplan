import React, { Component, PropTypes } from 'react';
import _ from 'lodash';
import cx from 'classnames';
import moment from 'moment';
import { Select2, Dropdown, Modal } from '../../Utils/components';
import Slot from '../../City/components/Slot';
import InfoOverlay from '../../InfoOverlay/components/InfoOverlay';
import PlaceholderOverlay from './PlaceholderOverlay';
import styles from '../tourmodal.module.scss';

export default class TourModal extends Component {
  static propTypes = {
    modalId: PropTypes.string,
    services: PropTypes.array,
    cityDayKey: PropTypes.string.isRequired,
    viewer: PropTypes.object.isRequired,
    relay: PropTypes.object,
    isModalOpened: PropTypes.bool.isRequired,
    changeModalState: PropTypes.func.isRequired,
    handleSaveAndRemoveTours: PropTypes.func,
    unavailableSlots: PropTypes.array,
  };

  static styles = [{
    text: 'Active',
    id: 1
  }, {
    text: 'Adventure',
    children: [{
      text: 'Challenge',
      id: 2
    }, {
      text: 'Cycling',
      id: 3
    }, {
      text: 'Kayaking',
      id: 4
    }, {
      text: 'Multi-activity',
      id: 5
    }, {
      text: 'Rafting',
      id: 6
    }, {
      text: 'Skiing',
      id: 7
    }, {
      text: 'Trekking',
      id: 8
    }]
  }, {
    text: 'Art & Architecture',
    id: 9
  }, {
    text: 'Beach',
    id: 10
  }, {
    text: 'Classic journeys',
    id: 11
  }, {
    text: 'Cruising',
    id: 12
  }, {
    text: 'Culinary',
    id: 13
  }, {
    text: 'Family',
    children: [{
      text: 'Family with teenagers',
      id: 14
    }, {
      text: 'Multi-generational',
      id: 15
    }, {
      text: 'Young family',
      id: 16
    }]
  }, {
    text: 'Festivals',
    id: 17
  }, {
    text: 'Heritage & Culture',
    id: 18
  }, {
    text: 'Homestay',
    id: 19
  }, {
    text: 'Honeymoon',
    id: 20
  }, {
    text: 'Nature & Wildlife',
    id: 21
  }, {
    text: 'Overland journeys',
    id: 22
  }, {
    text: 'Photography',
    id: 23
  }, {
    text: 'Promotion & Green season',
    id: 24
  }, {
    text: 'Small group journeys',
    id: 25
  }, {
    text: 'Sustainable',
    id: 26
  }, {
    text: 'Wellness & Spirit',
    id: 27
  }];

  static langs = ['English', 'French', 'Spanish', 'German', 'Italian'];

  state = {
    accessibleTours: this.props.viewer.accessibleTours,
    selectedTours: this.props.services,
    isOverlayOpened: false,
    isPlaceholderModal: false,
    service: {},
    placeholderId: 0,
    placeholderSlot: 1,
    placeholderKey: 0,
    addedPlaceholder: false,
    focusOn: '',
    removeTourButton: false
  };

  componentWillMount() {
    // start added to show custom tour
    const accessibleTours = this.prepareAccessibleTours(this.state.accessibleTours);
    // end added to show custom tour

    this.filterTours(this.props.viewer.accessibleTours, (accessibleTours) => {
      // Sort tours by preselection
      let sortedAccessibleTours = _.orderBy(accessibleTours, ['tour.isPreselected'], ['desc']);
      // FIXME Find a better way to take the place holders to the end of the error
      sortedAccessibleTours = [...sortedAccessibleTours.slice(3), ...sortedAccessibleTours.slice(0, 3)];
      this.setState({
        accessibleTours: sortedAccessibleTours
      });
    });
  }

  componentWillReceiveProps(newProps) {
    // Remap the accessibleTours whenever the pin is clicked
    if (this.props.viewer.accessibleTours !== newProps.viewer.accessibleTours) {
      const accessibleTours = [...this.state.accessibleTours];
      for (let i = 0; i < accessibleTours.length; i++) {
        if (accessibleTours[i].tour) accessibleTours[i] = newProps.viewer.accessibleTours.find(tour => tour.id === accessibleTours[i].id);
      }
      this.filterTours(accessibleTours);
    }
  }

  componentWillUpdate(nextProps, nextState) {
    if (nextState.selectedTours.length > 0) {
      this.toggleBar(true);
    }
  }

  componentDidUpdate() {
    const $tourSlider = $('.tour-slider');
    if (this.state.focusOn !== '') {
      const theID = `#${this.state.focusOn}`;
      $tourSlider.scrollLeft(($tourSlider.scrollLeft() - $tourSlider.offset().left) + $(theID).offset().left);
    }
  }

  handleOpenOverlay = (isOpen, test, service, e) => {
    if (e) e.stopPropagation();
    const $tourModal = $('.tour-modal');
    $tourModal.toggleClass('hide-scrollbar');
    $tourModal.scrollTop(0);

    if (test) {
      this.setState({ removeTourButton: true });
    } else {
      this.setState({ removeTourButton: false });
    }
    if (isOpen && service && service.tour) service.tour.type = 'tour'; // eslint-disable-line no-param-reassign
    this.setState({ isOverlayOpened: isOpen, service });
  };

  /**
   * Search accessible tours by name or productId
   * @param e
   */
  handleSearchTours = (e) => {
    let accessibleTours = [...this.props.viewer.accessibleTours];
    accessibleTours = this.prepareAccessibleTours(accessibleTours);
    const keyword = e.target.value.toLowerCase();
    this.setState({ accessibleTours: _.filter(accessibleTours, service =>
      (service.placeholder || service.tour.title.toLowerCase().indexOf(keyword) !== -1)
      || (service.tour && service.tour.description && service.tour.description.toLowerCase().indexOf(keyword) !== -1) || service.tour.productOptCode.indexOf(keyword) !== -1) });
  };

  handleSelectTour = (addedTour) => {
    let accessibleTours = [...this.state.accessibleTours];
    const selectedTours = [...this.state.selectedTours];
    accessibleTours = accessibleTours.filter(service => service._key !== addedTour._key);
    selectedTours.push(addedTour);
    this.setState({ accessibleTours, selectedTours, focusOn: `${addedTour._key}_${addedTour.startSlot}` });
  };

  handleSelectPlaceholder = (addPlaceholder) => {
    let accessibleTours = [...this.state.accessibleTours];
    const selectedTours = [...this.state.selectedTours];
    accessibleTours = accessibleTours.filter(service => service._key !== addPlaceholder._key);
    addPlaceholder.durationSlots = Number(addPlaceholder.durationSlots); // eslint-disable-line no-param-reassign
    selectedTours.push(addPlaceholder);
    accessibleTours.push({
      _key: `placeholder_${this.state.placeholderKey}`,
      durationSlots: 1,
      id: `placeholder_${this.state.placeholderKey}`,
      startSlot: addPlaceholder.startSlot,
      placeholder: {
        _key: `placeholder_${this.state.placeholderKey}`,
        type: '',
        title: 'Placeholder',
        duration: 0,
        notes: ''
      },
      tour: {
        _key: `placeholder_${this.state.placeholderKey}`,
        title: 'Placeholder',
        productOptCode: '-1'
      }
    });
    this.setState({ accessibleTours, selectedTours, placeholderKey: this.state.placeholderKey + 400, focusOn: `${addPlaceholder._key}_${addPlaceholder.startSlot}` });
  };

  handleClickPlaceholder = (isOpen, service) => {
    const tourModal = $('.tour-modal');
    tourModal.toggleClass('hide-scrollbar');
    tourModal.scrollTop(0);
    this.setState({ isPlaceholderModal: isOpen, service });
  };

  handleUnSelectedTour = (removedTour) => {
    const accessibleTours = [...this.state.accessibleTours];
    let selectedTours = [...this.state.selectedTours];
    selectedTours = selectedTours.filter(service => service._key !== removedTour._key);
    accessibleTours.push(removedTour);
    this.setState({ accessibleTours, selectedTours, focusOn: '' });
  };

  handleUnselectPlaceholder = (__, removedTour) => {
    let selectedTours = [...this.state.selectedTours];
    selectedTours = selectedTours.filter(service => service._key !== removedTour._key);
    this.setState({ selectedTours, focusOn: '' });
  };

  handleOnChangeLanguage = (selectName, e) => {
    this[selectName] = Select2.getSelect2Values(e.currentTarget);
    this.filterTours(this.props.viewer.accessibleTours);
  };

  hasTourSelected = service => this.state.selectedTours.indexOf(service) !== -1;

  toggleBar(forceActive = false) {
    const slider = $('.tour-slider');
    const selection = $('.tour-selection');
    const active = 'active';

    if (forceActive && !slider.hasClass(active)) {
      slider.toggleClass(active);
    } else if (!forceActive) {
      slider.toggleClass(active);
    }

    if (slider.hasClass(active)) {
      slider.css({ width: '25%' });
      selection.css({ width: '70%' });
    } else {
      const selectionWidth = slider.width() + selection.width() - 50; // eslint-disable-line no-mixed-operators
      slider.css({ width: '50px' });
      selection.css({ width: `${selectionWidth}px` });
    }
  }

  /**
   * Filter accessible tours based on the current selected filters,
   * it also automatically filters out the selected tours
   */
  filterTours = (accessibleTours, cb) => {
    /* eslint-disable no-param-reassign */
    accessibleTours = [...accessibleTours];

    // Filter based on selected filters
    // Between filter types, using AND operator
    // Inside the same filter (Styles, Language), using OR operator
    // If an array filter, styles and languages, is empty, it won't be applied
    /* eslint arrow-body-style: 0 */
    accessibleTours = _.filter(accessibleTours, (tour) => {
      return this.isPreferred === tour.isPreferred
        && this.hasPromotions === tour.hasPromotions
        && (!this.isAgentSpecific || this.isAgentSpecific === tour.isAgentSpecific)
        && (this.styles.length === 0 || this.styles.some(style => tour.styles.indexOf(style) !== -1))
        && (this.langs.length === 0 || this.langs.indexOf(tour.guideLanguage) !== -1);
    });
    accessibleTours = this.prepareAccessibleTours(accessibleTours);

    if (cb) cb(accessibleTours);
    else this.setState({ accessibleTours, placeholderId: this.state.placeholderId + 4 });
    /* eslint-enable no-param-reassign */
  };

  prepareAccessibleTours(accessibleTours) {
    // Filter selected tours out of the tour selection
    // eslint-disable-next-line no-param-reassign
    accessibleTours = _.filter(accessibleTours, tour => !_.find(this.state.selectedTours.filter(tours => !tours.placeholder), service => service.tour._key === tour._key));

    // Bind name, startSlot, and durationSlots
    const newAccessibleTours = accessibleTours.map((tour) => {
      const service = { tour };

      // In case of accessible tours
      if (!service.startSlot) {
        service.id = tour.id;
        service.startSlot = tour.startSlot;
      }

      service._key = tour._key;
      service.durationSlots = tour.durationSlots;

      return service;
    });

    for (let i = 1; i < 4; i++) {
      const placeholderId = this.state.placeholderId + i;
      newAccessibleTours.push({
        _key: `placeholder_${placeholderId}`,
        durationSlots: 1,
        id: `placeholder_${placeholderId}`,
        startSlot: i,
        placeholder: {
          _key: `placeholder_${placeholderId}`,
          type: 'non-selected',
          title: 'Placeholder'
        }
      });
    }

    return newAccessibleTours;
  }

  /**
   * Toggle a boolean value of a given filter
   * @param filterField
   */
  handleFilterTours = (filterField) => {
    this[filterField] = !this[filterField];
    this.filterTours(this.props.viewer.accessibleTours);
  };

  // check if all the slots of the services is available
  isServiceSlotsAvailable(service) {
    const unavailableSlots = this.props.unavailableSlots || [];
    const { startSlot, durationSlots } = service;
    const slotsOfService = [];
    for (let i = 0; i < durationSlots; i++) {
      const slot = startSlot + i;
      if (slot === 1) slotsOfService.push('am');
      else if (slot === 2) slotsOfService.push('pm');
      else if (slot === 3) slotsOfService.push('eve');
    }
    return _.intersection(slotsOfService, unavailableSlots).length === 0;
  }

  isPreferred = true;
  hasPromotions = false;
  isAgentSpecific = false;
  styles = [];
  langs = [];

  render() {
    const saveTourButton = <a className='modal-action modal-close waves-effect waves-green btn-flat exo-colors-text modal-action-button' onClick={this.props.handleSaveAndRemoveTours.bind(null, this.state.selectedTours)}><i className='mdi mdi-cloud-upload left' style={{ fontSize: '1.5em' }} />Save</a>;
    const cancelTourButton = <a className='modal-action modal-close waves-effect waves-red btn-flat exo-colors-text ml-10 modal-action-button'><i className='mdi mdi-close left' style={{ fontSize: '1.5em' }} />Cancel</a>;
    const triggerMorning = <a><i className='mdi-hardware-keyboard-control small' /></a>;
    const triggerAfternoon = <a><i className='mdi-hardware-keyboard-control small' /></a>;
    const triggerEvening = <a><i className='mdi-hardware-keyboard-control small' /></a>;
    const unavailableSlots = this.props.unavailableSlots || [];
    const isAmDisabled = unavailableSlots.includes('am');
    const isPmDisabled = unavailableSlots.includes('pm');
    const isEveDisabled = unavailableSlots.includes('eve');

    let overlaySelectDisabled = false;
    let overlayWarningInfo = null;
    if (this.state.isOverlayOpened && !this.isServiceSlotsAvailable(this.state.service)) {
      overlaySelectDisabled = true;
      overlayWarningInfo = 'product cannot be added to an unavailable slot';
    }
    return (
      <Modal className='tour-modal exo-colors modal-bgr1' actionButton={saveTourButton} cancelButton={cancelTourButton} isModalOpened={this.props.isModalOpened} changeModalState={this.props.changeModalState} dismissible={false}>
        <div className='tour-modal-header exo-colors modal-bgr1 exo-colors-text text-data-1'>
          <h3>Add Tour(s)</h3>
        </div>
        <div className='tour-modal-filter'>
          <div className='row m-0'>
            <div className='col s1 pt-10'>
              <h4 className={cx('exo-colors-text text-label-1', styles.filter)}>Filters</h4>
            </div>
            <div className='col s11 p-0'>
              <div className={cx('tour-modal-filter-top', styles.tourModalFilter)}>
                <a className='cursor' onClick={this.handleFilterTours.bind(null, 'isPreferred')}><span className={cx({ 'exo-colors-text text-accent-4': this.isPreferred })}><i className='mdi-action-thumb-up' /> EXO Recommended</span></a>
                <a className='cursor' onClick={this.handleFilterTours.bind(null, 'hasPromotions')}><span className={cx({ 'exo-colors-text text-accent-4': this.hasPromotions })}><i className='mdi-maps-local-offer' /> Promotions</span></a>
                <a className='cursor' onClick={this.handleFilterTours.bind(null, 'isAgentSpecific')}><span className={cx({ 'exo-colors-text text-accent-4': this.isAgentSpecific })}><i className='mdi mdi-flag' /> Agent Specific</span></a>
              </div>
            </div>
          </div>
          <div className='row m-0'>
            <div className='col s1 pt-5'>
              <h4 className={cx('exo-colors-text text-label-1', styles.filter)}>Style</h4>
            </div>
            <div className='col s3'>
              <div className={cx('tour-modal-filter-top', styles.tourModalFilter)}>
                <Select2 multiple data={TourModal.styles} value={this.styles} onSelect={this.handleOnChangeLanguage.bind(null, 'styles')} onUnselect={this.handleOnChangeLanguage.bind(null, 'styles')} />
              </div>
            </div>
            <div className='col s1 pt-5'>
              <h4 className={cx('exo-colors-text text-label-1', styles.filter)}>Language</h4>
            </div>
            <div className='col s3'>
              <div className={cx('tour-modal-filter-top', styles.tourModalFilter)}>
                <Select2 multiple data={TourModal.langs} value={this.langs} onSelect={this.handleOnChangeLanguage.bind(null, 'langs')} onUnselect={this.handleOnChangeLanguage.bind(null, 'langs')} />
              </div>
            </div>
          </div>
        </div>
        <div className='tour-modal-content'>
          <div className='col s12 tour-canvas p-0'>
            <div className='tour-slider' ref='tourSlider'>
              <div className='date-title align-center'>
                <h5> {moment(this.props.date).format('YYYY,MMMM Do')} <span className='exo-colors-text text-label-1'>Day {this.props.day}</span></h5>
              </div>
              <div className='pl-20'>
                <div className='slot' style={{ backgroundColor: isAmDisabled ? '#f2f2f2' : '#ffffff' }}>
                  <label htmlFor='checkbox-morning' className='timeSlot fs-16' style={{ top: '100px', color: isAmDisabled ? '#ffb340' : '#999999' }}>AM</label>
                  { isAmDisabled ? <div style={{ width: '245px', height: '240px', left: '100px', top: '100px', fontSize: '24px', color: '#ffb340', position: 'absolute' }}>Unavailable</div> : null }
                </div>
                <div className='slot' style={{ backgroundColor: isPmDisabled ? '#f2f2f2' : '#ffffff' }}>
                  <label htmlFor='checkbox-afternoon' className='timeSlot fs-16' style={{ top: '100px', color: isPmDisabled ? '#ffb340' : '#999999' }}>PM</label>
                  { isPmDisabled ? <div style={{ width: '245px', height: '240px', left: '100px', top: '100px', fontSize: '24px', color: '#ffb340', position: 'absolute' }}>Unavailable</div> : null }
                </div>
                <div className='slot' style={{ backgroundColor: isEveDisabled ? '#f2f2f2' : '#ffffff' }}>
                  <label htmlFor='checkbox-evening' className='timeSlot fs-16' style={{ top: '100px', color: isEveDisabled ? '#ffb340' : '#999999' }}>EVE</label>
                  { isEveDisabled ? <div style={{ width: '245px', height: '240px', left: '100px', top: '100px', fontSize: '24px', color: '#ffb340', position: 'absolute' }}>Unavailable</div> : null }
                </div>
              </div>
              <div style={{ position: 'absolute', top: '70px', left: '50px' }}>
                <Slot width={245} height={240} selectedTour handleClickPlaceholder={this.handleUnselectPlaceholder} services={this.state.selectedTours} cityDayKey={this.props.cityDayKey} handleClickTour={this.handleUnSelectedTour} handleOpenOverlay={this.handleOpenOverlay} unavailableSlots={unavailableSlots} type='selection' isSelected />
              </div>
            </div>
            <div className='exo-colors-text text-label-1 center-align togglebar cursor'>
              <i className='mdi-hardware-keyboard-arrow-right small' />
            </div>
            <div className='tour-selection'>
              <div className='search-box h-70 pl-24 pt-10 exo-colors modal-bgr1'>
                <div className='row m-0' style={{ position: 'fixed' }}>
                  <div className='input-field col s4 pr-0'>
                    <input style={{ width: '270px' }} id='search' type='text' className='validate' onChange={this.handleSearchTours} placeholder='Search Tour' />
                  </div>
                  <div className='col s3' style={{ marginLeft: '116px' }}>
                    <a href='#'><i className='mdi-action-search small' /></a>
                  </div>
                </div>
              </div>
              <div style={{ position: 'absolute', marginLeft: '10px' }}>
                <Slot width={245} height={240} addPlaceholder handleClickPlaceholder={this.handleClickPlaceholder} services={this.state.accessibleTours} cityDayKey={this.props.cityDayKey} handleClickTour={this.handleSelectTour} handleOpenOverlay={this.handleOpenOverlay} unavailableSlots={unavailableSlots} type='selection' />
              </div>
            </div>
          </div>
        </div>
        {this.state.isOverlayOpened ? <InfoOverlay removeTourButton={this.state.removeTourButton} isOverlayOpened={this.state.isOverlayOpened} handleClick={this.handleSelectTour} handleUnSelectedTour={this.handleUnSelectedTour} handleOpenOverlay={this.handleOpenOverlay} service={this.state.service} hasSelected={this.hasTourSelected} isSelectDisabled={overlaySelectDisabled} warningInfo={overlayWarningInfo} /> : null}
        {this.state.isPlaceholderModal ? <PlaceholderOverlay handleClick={this.handleSelectPlaceholder} handleOpenOverlay={this.handleClickPlaceholder} hasSelected={this.hasTourSelected} service={this.state.service} /> : null}
      </Modal>
    );
  }
}
