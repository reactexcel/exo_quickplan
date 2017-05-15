import React, { Component, PropTypes } from 'react';
import _ from 'lodash';
import cx from 'classnames';
import { MdTimelapse, MdConfirmationNumber } from 'react-icons/lib/md';
import { Select2, Dropdown, Modal, Card } from '../../Utils/components';
import Slot from '../../City/components/Slot';
import InfoOverlay from '../../InfoOverlay/components/InfoOverlay';
import PlaceholderOverlay from './PlaceholderOverlay';
import ScrollHandler from '../../Utils/ScrollHandler';
import styles from '../tourmodal.module.scss';

const dotsHorizontal = require('../../../assets/tpl/images/dots-horizontal.svg');

const startSlotTitles = ['', 'Morning', 'Afternoon', 'Evening'];
const startSlotIcons = [null,
  <div><i className='mdi mdi-weather-sunset mdi-24px mr-10' />Morning</div>,
  <div><i className='mdi mdi-weather-sunny mdi-24px mr-10' />Afternoon</div>,
  <div><i className='mdi mdi-weather-night mdi-24px mr-10' />Evening</div>
];

export default class TATourModal extends Component {
  static propTypes = {
    modalId: PropTypes.string,
    services: PropTypes.array,
    cityDayKey: PropTypes.string.isRequired,
    viewer: PropTypes.object.isRequired,
    relay: PropTypes.object,
    isModalOpened: PropTypes.bool.isRequired,
    changeModalState: PropTypes.func.isRequired,
    handleSaveAndRemoveTours: PropTypes.func,
    handleTASelectTour: PropTypes.func,
    service: PropTypes.object, // the tour service to change
  };
  state = {
    selectedIdx: -1,
    tours: [],
    defaultTours: []
  }

  componentWillMount() {
    this.prepareTours(this.props.viewer.accessibleTours);
  }

  componentDidMount() {
    const contentHeight = $('.ta-tour-modal').height() - $('.ta-tour-modal-header').height() - 100;
    $('.ta-tour-modal-content').height(contentHeight);
    $('.ta-tour-selection').height(contentHeight);
    $('.ta-tour-details').height(contentHeight);
    if (this.props.isModalOpened) {
      $('.ta-tour-selection').on('mousewheel DOMMouseScroll', ScrollHandler);
      $('.ta-tour-details .card .content').on('mousewheel DOMMouseScroll', ScrollHandler);
    }
  }

  componentWillReceiveProps(newProps) {
    if (this.props.isModalOpened !== newProps.isModalOpened) {
      if (newProps.isModalOpened) {
        $('.ta-tour-selection').on('mousewheel DOMMouseScroll', ScrollHandler);
        $('.ta-tour-details .card .content').on('mousewheel DOMMouseScroll', ScrollHandler);
      }
    }
  }

  // filter preselect tours and sort by isDefault
  prepareTours(accessibleTours) {
    const services = this.props.services || [];
    const serviceOnChange = this.props.service;
    if (serviceOnChange.isImplicitFreeTime) {
      this.prepareImplicitFreeTimeTours(accessibleTours);
      return;
    }

    // placeholders
    const placeHolderServices = services.filter(service => service.placeholder);

    const defaultTours = [];
    const defaultTourIds = [];
    // default tours. (selected by TC)
    services.filter(service => service.tour).map((service) => {
      const tour = accessibleTours.find(accessibleTour =>
          accessibleTour._key === service.tour._key
          && accessibleTour.startSlot === service.startSlot
          && accessibleTour.durationSlots === service.durationSlots);
      if (tour) {
        defaultTourIds.push(tour.id);
        defaultTours.push({ ...tour, isDefault: true, inactive: service.inactive, serviceBookKey: service._key });
      }
      return service;
    });

    // preselect tours (filter the default tours in preselect tours).
    const preselectedTours = accessibleTours.filter(tour => tour.isPreselected).filter(tour => !defaultTourIds.includes(tour.id));
    let tours = defaultTours.sort((a, b) => a.startSlot > b.startSlot).concat(preselectedTours);
    // filter the preselected tours by the current tour startSlot, durationSlots
    if (serviceOnChange) {
      const { startSlot, durationSlots } = serviceOnChange;
      let availableDurationSlots = 4 - startSlot;
      if (startSlot === 1) {
        if (services.some(service => service.inactive !== true && service.startSlot === 3)) availableDurationSlots = 2;
        if (services.some(service => service.inactive !== true && service.startSlot === 2)) availableDurationSlots = 1;
      } else if (startSlot === 2) {
        if (services.some(service => service.inactive !== true && service.startSlot === 3)) availableDurationSlots = 1;
      }
      // only show tours start in the same startSlot and duration slot not greater than the available duration slots.
      tours = tours.filter(tour => tour.startSlot === startSlot && tour.durationSlots <= availableDurationSlots);
    }

    const orderedTours = placeHolderServices.concat(tours);

    // get the tour TA selected last time
    let selectedIdx = -1;
    const serviceLen = placeHolderServices.length + defaultTours.length;
    for (let idx = 0; idx < serviceLen; idx++) {
      if (orderedTours[idx].inactive !== true) {
        selectedIdx = idx;
        break;
      }
    }

    this.setState({
      tours: orderedTours,
      defaultTours,
      selectedIdx
    });
  }

  prepareImplicitFreeTimeTours(accessibleTours) {
    const { service, defaultTours } = this.props;
    // default preselect tours
    let tours = accessibleTours.filter(tour => defaultTours.includes(`tours/${tour._key}`));
    if (service) {
      const { startSlot, durationSlots } = service;
      // filter the preselected tours by the current tour startSlot, durationSlots
      tours = tours.filter(tour => tour.startSlot === startSlot && tour.durationSlots === durationSlots);
    }

    this.setState({
      tours
    });
  }

  handleClickTour(idx) {
    this.setState({ selectedIdx: idx });
  }

  handleSelectTour() {
    const { handleTASelectTour } = this.props;
    const { selectedIdx, tours } = this.state;
    if (selectedIdx < 0) {
      return;
    }
    const tour = tours[selectedIdx];

    // NOTES, need to use select sevice instead, need to inactive the old selection.
    // if (tour.placeholder) {
    //   // Select the placeholder
    //   handleTASelectTour({ selectedServiceBookingKeys: [tour._key] });
    // } else if (tour.serviceBookKey) {
    //   // select the default Tour,
    //   handleTASelectTour({ selectedServiceBookingKeys: [tour.serviceBookKey] });
    // } else {
    //   // Select from the preselection Tour.
    //   const tourKey = { tourKey: tour._key, startSlot: tour.startSlot, durationSlots: tour.durationSlots };
    //   handleTASelectTour({ tourKeys: [tourKey] });
    // }

    const param = this.props.service || {};
    if (tour.placeholder) {
      param.placeholder = tour.placeholder;
    } else {
      param.tour = tour;
    }
    this.props.handleSaveAndRemoveTours([param]);
  }

  renderBasic(tourToRender, idx) {
    const tour = tourToRender.placeholder ? this.renderPlaceholder(tourToRender) : this.renderTour(tourToRender);
    const { id, title, startSlot, durationSlots, isDefault, isPlaceholder, image } = tour;
    const style = { height: '272px', paddingTop: '10px' };
    const endSlot = startSlot + durationSlots - 1; // eslint-disable-line no-mixed-operators
    const tourDuration = durationSlots && durationSlots > 1 ? `${startSlotTitles[startSlot]} - ${startSlotTitles[endSlot]}` : startSlotTitles[startSlot];
    if (idx === this.state.selectedIdx) style.backgroundColor = '#f2f2f2';
    return (
      <div key={id} style={style} onClick={() => this.handleClickTour(idx)}>
        { isPlaceholder ? image
          : <div className={'cursor exo-colors darken-2 mt-10 ml-40'} style={{ height: '200px', width: '180px', position: 'relative', backgroundImage: `url(${image})`, backgroundSize: 'cover', border: '1px solid #CCC' }} />
        }
        <div className='row p-0 m-0'>
          <div className='col offset-s1 s10 p-0 m-0 center-align'>
            <span id='title' className='pt-5'>{title}</span><br />
            <label htmlFor='title' className='pt-5'>{tourDuration}</label>
          </div>
          <div className='col s1 pt-10' >
            { isDefault || isPlaceholder ? <i className='mdi mdi-star-outline small' style={{ verticalAlign: 'bottom' }} /> : null }
          </div>
        </div>
      </div>
    );
  }

  renderTour(tour) {
    const { id, startSlot, durationSlots, isDefault } = tour;
    // take the first image, other the default image.
    const image = tour.images ? tour.images[0].url : require('../../TripPlanner/components/u4114.jpg');
    const title = $('<textarea/>').html(tour.title).text();
    return { id, title, startSlot, durationSlots, isDefault, image };
  }

  renderPlaceholder(service) {
    const { id, placeholder, startSlot, durationSlots, isDefault } = service;

    let placeholderIcon = null;
    if (service.placeholder.type === 'freeTime') {
      placeholderIcon = <MdTimelapse size={80} />;
    } else if (service.placeholder.type === 'customTour') {
      placeholderIcon = <MdConfirmationNumber size={80} />;
    } else if (service.placeholder.type === 'considerThis') {
      placeholderIcon = <div style={{ paddingTop: '20px' }}><img src={dotsHorizontal} role='presentation' className={{ width: '64px !important', height: 'auto !important', marginTop: '20px' }} /></div>;
    }

    const image = <div className='placeholder'><div style={{ verticalAlign: 'middle' }}>{placeholderIcon}</div></div>;
    return { id: `serviceBookings/${service._key}`, title: placeholder.title, startSlot, durationSlots, isPlaceholder: true, image };
  }

  renderTourDetail(tour) {
    let images = null;
    if (tour.images) {
      images = tour.images.map((image, idx) =>
        <li key={`${tour.id}_image_${idx}`}>
          <img src={image.url} role='presentation' />
        </li>
      );
    }

    const imageUrl = tour.images ? tour.images[0].url : require('../../TripPlanner/components/u4114.jpg');
    let styles = [];
    if (tour.styles && tour.styles.length) {
      styles = (
        <div className='col s12'>
          {tour.styles.map(style => [<div className='chip exo-colors darken-2 mt-5 mr-5'><span className='exo-colors-text text-accent-2'>{style}</span></div>])}
        </div>
      );
    }

    const promotionTitle = <h5 className='exo-colors-text text-data-1'><i className='mdi-maps-local-offer small left' />Promotion</h5>;
    const detailTitle = <h5 className='exo-colors-text text-data-1'><i className='mdi-av-repeat small left' />Inclusions / Exclusions</h5>;
    const descriptionTitle = <h5 className='exo-colors-text text-data-1'><i className='mdi-action-description small left' />Description</h5>;
    const title = $('<textarea/>').html(tour.title).text();
    // const description = $('<textarea/>').html(tour.description).text();

    const details = $('<textarea/>').html(tour.details).text();
    const introduction = tour.introduction;
    const highlights = tour.highlights && tour.highlights.map((cc, i) => <li key={i}>{cc}</li>);
    const inclusions = tour.inclusions && tour.inclusions.map((cc, i) => <li key={i}>{cc}</li>);
    const exclusions = tour.exclusions && tour.exclusions.map((cc, i) => <li key={i}>{cc}</li>);
    // material slides boxed
    // <div className='slider p-20'>
    // <ul className='slides'>
    // {images}
    // </ul>
    // </div>

    return (
      <div className='p-0 m-0'>
        <div className='pl-20 pt-10 pb-10'><h5>{title}</h5></div>
        <div className='card-image pl-40 pr-40'>
          <img src={imageUrl} role='presentation' style={{ width: '100%', maxHeight: '185px', objectFit: 'cover' }} />
        </div>
        <div className='row m-5 pl-20'>
          {styles}
        </div>
        <div className='row m-5 pl-20'>
          { tour.isPreferred ? <h5 className='exo-colors-text text-data-1 mb-15'><i className='mdi-action-thumb-up exo-colors-text text-darken-2 small left' />Exo recommended</h5> : null }
          { tour.isResponsible ? <h5 className='exo-colors-text text-data-1 mt-15'><i className='mdi-maps-local-florist exo-colors-text text-darken-2 small left' />ECO Friendly</h5> : null }
        </div>
        {
          tour.hasPromotions ? (<Card title={promotionTitle} className='fs-14 m-1' titleClassName='exo-colors modal-bgr3' minimized>
            <div className='row exo-colors-text text-data-1'>
              <div className='col s12 pl-20 pr-20'>
                {tour.promotion}
              </div>
            </div>
          </Card>) : null
        }
        <Card title={detailTitle} className='fs-14 m-1' titleClassName='exo-colors modal-bgr3' minimized>
          <div className='row exo-colors-text text-data-1'>
            <div className='col s12 pl-20 pr-20'>
              <span style={{ color: '#b1b1b1' }}>Inclusions</span>
              <ol style={{ listStyleType: 'disc', padding: '0px' }}>
                {inclusions}
              </ol>
              <span style={{ color: '#b1b1b1' }}>Exclusions</span>
              <ol style={{ listStyleType: 'disc', padding: '0px' }}>
                {exclusions}
              </ol>
            </div>
          </div>
        </Card>
        <Card title={descriptionTitle} className='fs-14 m-1' titleClassName='exo-colors modal-bgr3'>
          <div className='row exo-colors-text text-data-1'>
            <div className='col s12 pl-20 pr-20 m-5'>
              <span style={{ color: '#b1b1b1' }}>Highlights</span>
              <ol style={{ listStyleType: 'disc', padding: '0px' }}>
                {highlights}
              </ol>
              <span style={{ color: '#b1b1b1' }}>Introduction</span><br /><br />
              {introduction}<br /><br />
              <span style={{ color: '#b1b1b1' }}>Details</span><br /><br />
              {details}
            </div>
          </div>
        </Card>

      </div>
    );
  }

  renderPlaceholderDetail(service) {
    return (<div className='p-0 m-0'>
      <div className='pl-20 pt-10 pb-10'><h5>{service.placeholder.title}</h5></div>
      <div className='row exo-colors-text text-data-1'>
        <div className='col s12 pl-20 pr-20 m-5'>
          {service.notes}
        </div>
      </div>
    </div>);
  }

  renderDetails() {
    if (this.state.selectedIdx < 0) {
      return null;
    }
    const tour = this.state.tours[this.state.selectedIdx];
    const tourInfo = { serviceBooking: { tour } };
    return tour.placeholder ? this.renderPlaceholderDetail(tour) : this.renderTourDetail(tour); // <TourInfo viewer={tourInfo} />;
  }

  render() {
    const { tours, selectedIdx } = this.state;
    const startSlot = this.props.service ? this.props.service.startSlot : 1;
    const selectButton = <a className='modal-action modal-close waves-effect waves-green btn-flat exo-colors-text btn-select right' onClick={() => this.handleSelectTour()}><i className='mdi-action-exit-to-app left' style={{ fontSize: '1.5em' }} />Select</a>;
    const cancelTourButton = <a className='modal-action modal-close waves-effect waves-red btn-flat exo-colors-text ml-10 modal-action-button'><i className='mdi mdi-close left' style={{ fontSize: '1.5em' }} />Cancel</a>;

    return (
      <Modal className='ta-tour-modal' actionButton={selectButton} cancelButton={cancelTourButton} isModalOpened={this.props.isModalOpened} changeModalState={this.props.changeModalState} dismissible={false} >
        <div className='ta-tour-modal-header'>
          <h3>Select Tour</h3>
        </div>
        <div className='ta-tour-modal-content'>
          <div className='ta-tour-selection'>
            <div className='pl-14 pt-10 pb-10'>{startSlotIcons[startSlot]}</div>
            <div className='divider' />
            <div className='ta-tour-selection-content'>
              {tours.map((tour, idx) => this.renderBasic(tour, idx))}
            </div>
          </div>
          <div className='ta-tour-details'>
            {this.renderDetails()}
          </div>
        </div>

      </Modal>
    );
  }
}
