import React, { Component, PropTypes } from 'react';
import Relay from 'react-relay';
import _ from 'lodash';
import cx from 'classnames';
import moment from 'moment';
import PubSub from 'pubsub-js';
import { MdHotel } from 'react-icons/lib/md';
import { Select2, Modal, Card } from '../../Utils/components';
import UpdateAccommodationPlacementMutation from '../mutations/Update';
import UpdateServiceMutation from '../../ServiceBooking/mutations/UpdateService';
import ScrollHandler from '../../Utils/ScrollHandler';

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

  state = {
    selectedSupplierIdx: -1,
    placeholder: { isDefault: false, isSelected: false, notes: '', title: 'Own accommodation' },
    startDate: null,
    endDate: null,
    isRoomsSelected: false
  };

  accessibleSuppliers = [];
  durationNights = 1;

  componentWillMount() {
    this.prepareSuppliers(this.props);
  }
  componentWillReceiveProps(newProps) {
    if (this.props.viewer.accessibleSuppliers !== newProps.viewer.accessibleSuppliers) {
      this.prepareSuppliers(newProps);
    }

    if (this.props.isModalOpened !== newProps.isModalOpened) {
      if (newProps.isModalOpened) {
        $('.ta-tour-selection').on('mousewheel DOMMouseScroll', ScrollHandler);
        $('.ta-tour-details .card .content').on('mousewheel DOMMouseScroll', ScrollHandler);
      }
    }
  }
  componentDidMount() {
    const contentHeight = $('.ta-tour-modal').height() - $('.ta-tour-modal-header').height() - 80;
    $('.ta-tour-modal-content').height(contentHeight);
    $('.ta-tour-selection').height(contentHeight);
    $('.ta-tour-details').height(contentHeight);

    if (this.props.isModalOpened) {
      $('.ta-tour-selection').on('mousewheel DOMMouseScroll', ScrollHandler);
      $('.ta-tour-details .card .content').on('mousewheel DOMMouseScroll', ScrollHandler);
    }
  }

  prepareSuppliers(props) {
    const selectedSupplier = props.selectedSupplier;
    const durationNights = selectedSupplier && selectedSupplier.durationNights ? selectedSupplier.durationNights : 1;
    const startDate = moment(props.date, 'YYYY-MM-DD').format('LL');
    const endDate = moment(props.date, 'YYYY-MM-DD').add(durationNights, 'days').format('LL');
    const placeholder = this.preparePlaceholder(props);
    let isRoomsSelected = false;


    const accessibleSuppliers = props.viewer.accessibleSuppliers;
    // filter preselected
    const preselectSuppliers = accessibleSuppliers.filter(supplier => supplier.accommodations && supplier.accommodations.some(accommodation => accommodation.isPreselected));

    let selectedSupplierIdx = -1;

    // get the Room selection TC made
    const tcSelectedAccKeys = selectedSupplier.accommodations.filter(acc => acc.isSelected).map(acc => acc._key) || [];

    // isDefault used for label those supplier previously choosed by TC user.
    // isSelected used for label the accomdation choosed for TA user;
    preselectSuppliers.map((supplier, idx) => { // eslint-disable-line array-callback-return
      // mark the default suppiler
      supplier.isDefault = selectedSupplier.supplier._key === supplier._key; // eslint-disable-line no-param-reassign

      // update the isSelected field (default Room selection) on accessibleSuppliers.
      supplier.accommodations.map((acc) => { // eslint-disable-line array-callback-return
        acc.isSelected = tcSelectedAccKeys.includes(acc._key); // eslint-disable-line no-param-reassign
        if (acc.isSelected) {
          isRoomsSelected = true;
          acc.isPreselected = true; // eslint-disable-line no-param-reassign
        }
      });
    });

    preselectSuppliers.sort((x, y) =>  // eslint-disable-line no-confusing-arrow
      (x.isDefault === y.isDefault) ? 0 : x.isDefault ? -1 : 1); // eslint-disable-line no-nested-ternary

    // set selectedSupplierIdx of preselectSuppliers
    preselectSuppliers.map((supplier, idx) => { // eslint-disable-line array-callback-return
      if (supplier.isDefault) {
        selectedSupplierIdx = idx;
      }
    });

    this.accessibleSuppliers = preselectSuppliers;
    this.durationNights = durationNights;
    this.setState({
      startDate,
      endDate,
      selectedSupplierIdx,
      placeholder,
      isRoomsSelected
    });
  }

  preparePlaceholder(props) {
    const selectedSupplier = props.selectedSupplier;
    const placeholder = this.state.placeholder;
    if (selectedSupplier.placeholder) {
      placeholder.isDefault = true;
      placeholder.notes = selectedSupplier.placeholder.notes || '';
      placeholder.title = selectedSupplier.placeholder.title || 'Own accommodation';
    }
    return placeholder;
  }

  handleClickSupplier(idx) {
    const { placeholder } = this.state;
    placeholder.isSelected = false;
    this.setState({
      placeholder,
      selectedSupplierIdx: idx
    });
  }

  handleClickPlaceHolder() {
    const { placeholder } = this.state;
    placeholder.isSelected = true;
    this.setState({
      placeholder,
      selectedSupplierIdx: -1
    });
  }

  handleSelectRoomCategory(accKey) {
    const { selectedSupplierIdx } = this.state;
    const accessibleSuppliers = this.accessibleSuppliers;

    const selectedSupplier = accessibleSuppliers[selectedSupplierIdx];
    const accToHandle = selectedSupplier.accommodations.find(acc => acc._key === accKey);

    if (!accToHandle) {
      console.log('select accommodation error, can not find the accommodation');
      return;
    }

    // update the isSelected value in the accessibleSuppliers
    accToHandle.isSelected = !accToHandle.isSelected;

    // check after check, is there any room selection now.
    const isRoomsSelected = selectedSupplier.accommodations.findIndex(acc => acc.isSelected) > -1;

    // if the TA select one room in a hotel, we all auto dis-select all the rooms in other hotels.
    accessibleSuppliers.filter(supplier => supplier._key !== selectedSupplier._key).map((supplier) => { // eslint-disable-line array-callback-return
      supplier.accommodations.map((acc) => { // eslint-disable-line array-callback-return
        acc.isSelected = false; // eslint-disable-line no-param-reassign
      });
    });

    this.setState({ isRoomsSelected });
  }

  handleChangeNote(value) {
    const { placeholder } = this.state;
    placeholder.notes = value;
    this.setState({
      placeholder
    });
  }

  handleSelectAccmmodation() {
    const { startDate, endDate, cityBookingKey, cityBookingId, startDay, relay } = this.props;
    const { placeholder } = this.state;
    const accessibleSuppliers = this.accessibleSuppliers;

    const defaultSelection = this.props.selectedSupplier;
    const accommodationPlacementKey = defaultSelection ? defaultSelection._key : undefined;
    const durationNights = defaultSelection.durationNights;

    const selectedAccommodationKeys = [];
    const preselectedAccommodationKeys = [];
    const action = 'UPDATE2';

    let selectedSupplier = null;
    accessibleSuppliers.map((supplier, idx) => { // eslint-disable-line array-callback-return
      supplier.accommodations.map((acc) => { // eslint-disable-line array-callback-return
        if (acc.isSelected) {
          selectedAccommodationKeys.push(acc._key);
          preselectedAccommodationKeys.push(acc._key);

          // NOTE, this is actual supplier we selected, don't use this.state.selectedSupplierIdx
          selectedSupplier = supplier;
        } else if (acc.isPreselected) {
          preselectedAccommodationKeys.push(acc._key);
        }
      });
    });

    const placeholders = [];
    if (placeholder.isSelected) {
      placeholders.push({ notes: placeholder.note, title: placeholder.title });
    }

    let acc_service_key = null;
    Relay.Store.commitUpdate(new UpdateAccommodationPlacementMutation({
      cityBookingId,
      cityBookingKey,
      accommodationPlacementKey,
      selectedAccommodationKeys,
      preselectedAccommodationKeys,
      action,
      startDay,
      placeholders,
      durationNights,
      startDate: moment(startDate).format('YYYY-MM-DD')
    }), {
      onSuccess: (retData) => {
        // update prices in service booking.
        if (!(retData && retData.updateAccommodationPlacement && retData.updateAccommodationPlacement.cityBooking && retData.updateAccommodationPlacement.cityBooking.accommodationPlacements)) return;
        retData.updateAccommodationPlacement.cityBooking.accommodationPlacements.map((b) => { // eslint-disable-line array-callback-return
          if (!b.serviceBookings) return; // eslint-disable-line array-callback-return
          b.serviceBookings.map((c) => { // eslint-disable-line array-callback-return
            if (!selectedAccommodationKeys.includes(c.productId)) return; // eslint-disable-line array-callback-return
            const insertedServiceBookingKey = c._key;
            acc_service_key = b._key;
            // update the servicebooking price.
            const acc = selectedSupplier.accommodations.find(d => c.productId === d._key && d.rate && d.rate.doubleRoomRate);
            if (!acc) return; // eslint-disable-line array-callback-return
            Relay.Store.commitUpdate(new UpdateServiceMutation({
              serviceBookingKey: insertedServiceBookingKey,
              patchData: {
                price: {
                  currency: '',
                  amount: acc.rate.doubleRoomRate
                }
              }
            }));
          });
        });

        PubSub.publish('TripForceFetch', {});
      }
    });
  }

  renderSupplierBasic(supplier, idx) {
    const { id } = supplier;
    const title = $('<textarea/>').html(supplier.title).text();
    const image = supplier.images ? supplier.images[0].url : require('../../TripPlanner/components/u4114.jpg');
    const style = { height: '272px', paddingTop: '10px' };
    if (this.state.selectedSupplierIdx === idx) style.backgroundColor = '#f2f2f2';

    return (
      <div key={id} style={style} onClick={() => this.handleClickSupplier(idx)}>
        <div className={'cursor exo-colors darken-2 mt-10 ml-40'} style={{ height: '200px', width: '180px', position: 'relative', backgroundImage: `url(${image})`, backgroundSize: 'cover', border: '1px solid #CCC' }} />
        <div className='row p-0 m-0'>
          <div className='col offset-s1 s10 p-0 m-0 center-align'>
            <span id='title' className='pt-5'>{title}</span><br />
          </div>
          <div className='col s1 pt-10' >
            { supplier.isDefault ? <i className='mdi mdi-star-outline small' style={{ verticalAlign: 'bottom' }} /> : null }
          </div>
        </div>
      </div>
    );
  }

  renderPlaceHolderBasic() {
    const placeholder = this.state.placeholder;
    const style = { height: '272px', paddingTop: '10px' };
    if (this.state.placeholder.isSelected) style.backgroundColor = '#f2f2f2';
    return (
      <div id='hotel_placeholder' style={style} onClick={() => this.handleClickPlaceHolder()}>
        <div className='placeholder'>
          <div style={{ verticalAlign: 'middle' }}>
            <MdHotel size={80} style={{ color: '#d7d7d7' }} />
          </div>
        </div>
        <div className='row p-0 m-0'>
          <div className='col offset-s1 s10 p-0 m-0 center-align'>
            <span id='title' className='pt-5'>{placeholder.title}</span><br />
          </div>
        </div>
      </div>
    );
  }

  renderDetails() {
    const { selectedSupplierIdx, placeholder } = this.state;
    const accessibleSuppliers = this.accessibleSuppliers;
    if (selectedSupplierIdx >= 0) {
      const selectedSupplier = accessibleSuppliers[selectedSupplierIdx];
      return this.renderSupplierDetails(selectedSupplier);
    } else if (placeholder.isSelected) {
      return this.renderPlaceholderDetails();
    }

    return null;
  }

  renderAccRoomCategories(supplier) {
    const { accommodations } = supplier;

    // we always enable all the checkbox in hotel,
    // and if the TA select one room in a hotel, we all auto dis-select all the rooms in other hotels.
    const isThisHotelSelected = accommodations.filter(acc => acc.isPreselected).findIndex(acc => acc.isSelected) > -1;
    return accommodations.filter(acc => acc.isPreselected).map((acc, idx) => (
      <div className='col s12' key={acc._key}>
        <input type='checkbox' id={`checkbox${acc._key}`} defaultChecked={acc.isSelected} /* disabled={this.state.isRoomsSelected && !isThisHotelSelected}*/ onClick={() => { this.handleSelectRoomCategory(acc._key); }} />
        <label className='exo-colors-text text-data-1' htmlFor={`checkbox${acc._key}`}>{acc.title}</label>
      </div>
    ));
  }

  renderSupplierDetails(supplier) {
    const imageUrl = supplier.images ? supplier.images[0].url : require('../../TripPlanner/components/u4114.jpg');
    const isPreselected = supplier.accommodations.some(acc => acc.isPreselected);
    const isResponsible = supplier.accommodations.some(acc => acc.isResponsible);

    const roomCategoriesTitle = <h5 className='exo-colors-text text-data-1'><i className='mdi-maps-hotel small left' />Room Categories</h5>;
    const promotionTitle = <h5 className='exo-colors-text text-data-1'><i className='mdi-maps-local-offer small left' />Promotion</h5>;
    const descriptionTitle = <h5 className='exo-colors-text text-data-1'><i className='mdi-action-description small left' />Description</h5>;
    const title = $('<textarea/>').html(supplier.title).text();
    const description = $('<textarea/>').html(supplier.description).text();

    return (
      <div className='p-0 m-0'>
        <div className='pl-20 pt-10 pb-10'><h5>{title}</h5></div>
        <div className='card-image pl-40 pr-40'>
          <img src={imageUrl} role='presentation' style={{ width: '100%', maxHeight: '185px', objectFit: 'cover' }} />
        </div>
        <div className='row m-5 pl-20'>
          { supplier.isPreferred ? <h5 className='exo-colors-text text-data-1 mb-15'><i className='mdi-action-thumb-up exo-colors-text text-darken-2 small left' />Exo recommended</h5> : null }
          { supplier.isResponsible ? <h5 className='exo-colors-text text-data-1 mt-15'><i className='mdi-maps-local-florist exo-colors-text text-darken-2 small left' />ECO Friendly</h5> : null }
        </div>
        <Card title={roomCategoriesTitle} className='fs-14 m-1' titleClassName='exo-colors modal-bgr3' minimized>
          <div className='row exo-colors-text text-data-1 m-0 pt-3'>
            {this.renderAccRoomCategories(supplier)}
          </div>
        </Card>
        <Card title={promotionTitle} className='fs-14 m-1' titleClassName='exo-colors modal-bgr3' minimized>
          <div className='row exo-colors-text text-data-1 m-0 pt-3'>
            <div className='col s12 pl-20 pr-20'>
              {supplier.promotion}
            </div>
          </div>
        </Card>
        <Card title={descriptionTitle} className='fs-14 m-1' titleClassName='exo-colors modal-bgr3' minimized>
          <div id='accommodationDesc' className='row exo-colors-text text-data-1 m-0 pt-3' style={{ overflowY: 'auto !important' }}>
            <div className='col s12 pl-20 pr-20 m-5'>
              <span>{description}</span>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  renderPlaceholderDetails() {
    const { placeholder } = this.state;
    return (<div className='p-0 m-0'>
      <div className='pl-20 pt-10 pb-10'><h5>{placeholder.title}</h5></div>
      <div className='row exo-colors-text text-data-1'>
        <div className='placeholder' style={{ width: '80%' }}>
          <div style={{ verticalAlign: 'middle' }}>
            <MdHotel size={120} style={{ color: '#d7d7d7' }} />
          </div>
        </div>
      </div>
      <div className='row exo-colors-text text-data-1'>
        <div className='col s12 pl-20 pr-20 m-5'>
          <div className='input-field'>
            <textarea id='input_placeholderNotes' className='materialize-textarea' value={placeholder.notes} onChange={e => this.handleChangeNote(e.target.value)} />
            <label className='active' htmlFor='input_placeholderNotes'>Notes</label>
          </div>
        </div>
      </div>
    </div>);
  }

  render() {
    const { endDate, startDate, isRoomsSelected } = this.state;
    const accessibleSuppliers = this.accessibleSuppliers;

    const selectButton = [
      <a key='btnPaxSave' className={cx('modal-action modal-close waves-effect waves-green btn-flat exo-colors-text btn-select right', { hide: !isRoomsSelected })} onClick={() => this.handleSelectAccmmodation()}><i className='mdi-action-exit-to-app left' style={{ fontSize: '1.5em' }} />Select</a>,
      <a key='btnDisable' className={cx('btn-flat btn-select disabled', { hide: isRoomsSelected })} ><i className='mdi-action-exit-to-app left' style={{ fontSize: '1.5em' }} />Select</a>
    ];

    const cancelTourButton = <a className='modal-action modal-close waves-effect waves-red btn-flat exo-colors-text ml-10 modal-action-button'><i className='mdi mdi-close left' style={{ fontSize: '1.5em' }} />Cancel</a>;
    const dateLabel = this.durationNights && this.durationNights > 1 ? `${startDate} - ${endDate}, ${this.durationNights} Nights` : `${startDate}, 1 Night`;

    return (
      <Modal className='ta-tour-modal' actionButton={selectButton} cancelButton={cancelTourButton} isModalOpened={this.props.isModalOpened} changeModalState={this.props.changeModalState} dismissible={false} >
        <div className='ta-tour-modal-header' style={{ padding: '15px 0 0' }}>
          <h3 className='pl-24'>Select Hotel</h3>
          <div className='divider p-0 m-0 mb-15' />
          <div className='row p-0 m-0'>
            <div className='col s2 pl-24'>
              <h4>Dates</h4>
            </div>
            <div className='col s10 exo-colors-text text-label-1 fs-14'>
              <span className='mr-30'>{dateLabel}</span>
            </div>
          </div>
        </div>

        <div className='ta-tour-modal-content'>
          <div className='ta-tour-selection'>
            <div className='ta-tour-selection-content'>
              {accessibleSuppliers.map((supplier, idx) => this.renderSupplierBasic(supplier, idx))}
              {this.renderPlaceHolderBasic()}
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
