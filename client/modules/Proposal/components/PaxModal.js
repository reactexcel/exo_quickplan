import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import cx from 'classnames';
import _ from 'lodash';
import moment from 'moment';
import '../Proposal.scss';
import { Select2, Modal } from '../../Utils/components';
import { GENDERS, AGE_GROUP, getAgeGroup, ALLERGIES, COUNTRIES, DIET, LANGUAGES, STYLE_DATA, STYLE_TITLE, STYLE_DATA_TITLE, STYLE_BUTTON_DATA } from '../Constants';

export default class PaxModal extends Component {
  static propTypes = {
    pax: PropTypes.object.isRequired,
    isModalOpened: PropTypes.bool.isRequired,
    changeModalState: PropTypes.func.isRequired,
    handlePaxSave: PropTypes.func.isRequired,
    locations: PropTypes.array
  }

  state = {
    pax: {}
  }

  componentWillMount() {
    this.setState({ pax: this.props.pax });
  }

  componentDidMount() {
    // $('body').find('ul').css({maxHeight:'180px'});
    // Datepicker
    $('.datepicker').pickadate({
      selectMonths: true, // Creates a dropdown to control month
      selectYears: 200, // Creates a dropdown of 15 years to control year
      max: Date.now()
    });
    // Datepicker onChange event handler
    $(ReactDOM.findDOMNode(this.refs.dateOfBirth)).on('change', this.changeTextFieldState.bind(this, 'dateOfBirth'));
    $(ReactDOM.findDOMNode(this.refs.passportExpiresOn)).on('change', this.changeTextFieldState.bind(this, 'passportExpiresOn'));
  }

  componentWillReceiveProps(newProps) {
    if (this.props.pax !== newProps.pax) {
      this.setState({ pax: newProps.pax });
    }
  }

  changeTextFieldState(name, e) {
    this.setState({
      pax: {
        ...this.state.pax,
        [name]: e.target.value
      }
    });
  }

  handleSelectChange(name, e) {
    this.setState({
      pax: {
        ...this.state.pax,
        [name]: Select2.getSelect2Values(e.currentTarget)
      }
    });
  }

  handleUnSelectChange(name, e) {
    this.setState({
      pax: {
        ...this.state.pax,
        [name]: ''
      }
    });
  }

  validate() {
    const { firstName, lastName, dateOfBirth, ageGroup, ageOnArrival } = this.state.pax;
    if (!firstName || !lastName) {
      return false;
    }

    // must input one of the age fields.
    if ((!dateOfBirth || dateOfBirth === '') && (!ageOnArrival || ageOnArrival === '') && (!ageGroup || ageGroup === '')) {
      return false;
    }

    // if the ageOnArrival is specified, it must not be a negative integer.
    if (ageOnArrival && ageOnArrival !== '') {
      const ageOnArrivalInt = _.parseInt(ageOnArrival);
      if (ageOnArrivalInt < 0 || ageOnArrivalInt > 1000) return false;
    }
    return true;
  }

  render() {
    const { isModalOpened, changeModalState, handlePaxSave, locations } = this.props;
    let availableCountries = [];
    if (locations) {
      availableCountries = locations.filter(ul => ul.type === 'country').sort((a, b) => {
        if (a.name < b.name) return -1;
        if (a.name > b.name) return 1;
        return 0;
      });
    }
    const valid = this.validate();
    const savePaxButton = [
      <a key='btnPaxSave' className={cx('modal-action modal-close waves-effect waves-green btn mr-20', { hide: !valid })} onClick={() => handlePaxSave(this.state.pax)}><i className='mdi-action-backup left' />Save</a>,
      <a key='btnDisable' className={cx('btn disabled mr-20', { hide: valid })} style={{ cursor: 'not-allowed' }}><i className='mdi-action-backup left' />Save</a>
    ];
    return (
      <Modal actionButton={savePaxButton} isModalOpened={isModalOpened} changeModalState={changeModalState} className='proposal-modal exo-colors modal-bgr1'>
        <div className='row pb-20'>
          <div className='col s3'>
            <span className={STYLE_TITLE}>Traveller Details</span>
          </div>
        </div>
        <div className='pl-20'>
          <div className='row pb-15'>
            <span className={STYLE_DATA_TITLE}>Name</span>
          </div>
          <div className='row pb-30'>
            <div className='col s12 m4 l4'>
              <label htmlFor='firstName' style={{ visibility: this.state.pax.firstName ? 'visible' : 'hidden' }}>First name</label>
              <div className='input-field'>
                <input id='firstName' placeholder='First name' value={this.state.pax.firstName} type='text' className='validate' onChange={this.changeTextFieldState.bind(this, 'firstName')} />
              </div>
            </div>
            <div className='col s12 m4 l4'>
              <label htmlFor='lastName' style={{ visibility: this.state.pax.lastName ? 'visible' : 'hidden' }}>Last name</label>
              <div className='input-field'>
                <input id='lastName' placeholder='Last name' value={this.state.pax.lastName} type='text' className='validate' onChange={this.changeTextFieldState.bind(this, 'lastName')} />
              </div>
            </div>
            <div className='col s12 m4 l4 pt-0'>
              <label htmlFor='select_gender' style={{ visibility: this.state.pax.gender ? 'visible' : 'hidden' }}>Gender</label>
              <Select2
                id='select_gender'
                data={GENDERS}
                value={this.state.pax.gender}
                onSelect={this.handleSelectChange.bind(this, 'gender')}
                onUnselect={this.handleSelectChange.bind(this, 'gender')}
                options={{ placeholder: 'Gender' }}
              />
            </div>
          </div>
          <div className='row pb-15'>
            <span className={STYLE_DATA_TITLE}>Age</span>
          </div>
          <div className='row pb-30'>
            <div className='col s12 m4 l4'>
              <label htmlFor='dateOfBirth' style={{ visibility: this.state.pax.dateOfBirth ? 'visible' : 'hidden' }}>Date of birth</label>
              <div className='input-field'>
                { (!this.state.pax.ageGroup || this.state.pax.ageGroup === '') && (!this.state.pax.ageOnArrival || this.state.pax.ageOnArrival === '') ?
                  <input id='dataOfBirth' ref='dateOfBirth' placeholder='Date of birth' defaultValue={this.state.pax.dateOfBirth} className='datepicker' id='input_dateOfBirth' type='text' />
                : <input id='dataOfBirth' ref='dateOfBirth' placeholder='Date of birth' defaultValue={this.state.pax.dateOfBirth} className='datepicker' id='input_dateOfBirth' type='text' disabled />
              }
              </div>
            </div>
            <div className='col s12 m4 l4'>
              <label htmlFor='ageOnArrival' style={{ visibility: this.state.pax.ageOnArrival !== undefined && this.state.pax.ageOnArrival !== '' ? 'visible' : 'hidden' }}>or age on arrival</label>
              <div className='input-field'>
                { (!this.state.pax.dateOfBirth || this.state.pax.dateOfBirth === '') && (!this.state.pax.ageGroup || this.state.pax.ageGroup === '') ?
                  <input id='ageOnArrival' placeholder='or age on arrival' value={this.state.pax.ageOnArrival} type='number' min='0' max='1000' className='validate' onChange={this.changeTextFieldState.bind(this, 'ageOnArrival')} />
                : <input id='ageOnArrival' placeholder='or age on arrival' value={this.state.pax.ageOnArrival} type='number' min='0' max='1000' className='validate' onChange={this.changeTextFieldState.bind(this, 'ageOnArrival')} disabled />
              }
              </div>
            </div>
            <div className='col s12 m4 l4'>
              <label htmlFor='ageGroup' style={{ visibility: this.state.pax.ageGroup ? 'visible' : 'hidden' }}>or age group</label>
              { (!this.state.pax.dateOfBirth || this.state.pax.dateOfBirth === '') && (!this.state.pax.ageOnArrival || this.state.pax.ageOnArrival === '') ?
                <Select2 id='ageGroup' data={AGE_GROUP} value={this.state.pax.ageGroup} onSelect={this.handleSelectChange.bind(this, 'ageGroup')} onUnselect={this.handleUnSelectChange.bind(this, 'ageGroup')} options={{ placeholder: 'or age group', tags: true, allowClear: true }} />
                : <Select2 id='ageGroup' data={AGE_GROUP} value={this.state.pax.ageGroup} options={{ placeholder: 'or age group' }} disabled />
              }
            </div>
          </div>
          <div className='row pb-15'>
            <span className={STYLE_DATA_TITLE}>Passport</span>
          </div>
          <div className='row pb-30'>
            <div className='col s12 m4 l4'>
              <label htmlFor='passportNr' style={{ visibility: this.state.pax.passportNr ? 'visible' : 'hidden' }}>Passport</label>
              <div className='input-field'>
                <input id='passportNr' placeholder='Passport' value={this.state.pax.passportNr} type='text' className='validate' onChange={this.changeTextFieldState.bind(this, 'passportNr')} />
              </div>
            </div>
            <div className='col s12 m4 l4'>
              <label htmlFor='nationality' style={{ visibility: this.state.pax.nationality ? 'visible' : 'hidden' }}>Country of issue</label>
              <Select2
                id='nationality'
                data={availableCountries.map(obj => ({ id: obj._key, text: obj.name }))}
                value={this.state.pax.nationality}
                onSelect={this.handleSelectChange.bind(this, 'nationality')}
                onUnselect={this.handleSelectChange.bind(this, 'nationality')}
                options={{ placeholder: 'Country of issue' }}
              />
            </div>
            <div className='col s12 m4 l4'>
              <label htmlFor='passportExpiresOn' style={{ visibility: this.state.pax.passportExpiresOn ? 'visible' : 'hidden' }}>Expiration date</label>
              <div className='input-field'>
                <input id='passportExpiresOn' ref='passportExpiresOn' placeholder='Expiration date' defaultValue={this.state.pax.passportExpiresOn} className='datepicker' id='input_passportExpiresOn' type='text' />
              </div>
            </div>
          </div>
          <div className='row pb-15'>
            <span className={STYLE_DATA_TITLE}>Preferences</span>
          </div>
          <div className='row pb-30'>
            <div className='col s12 m4 l4'>
              <label htmlFor='language' style={{ visibility: this.state.pax.language ? 'visible' : 'hidden' }}>Preferred Language</label>
              <Select2
                id='language'
                data={LANGUAGES}
                value={this.state.pax.language}
                onSelect={this.handleSelectChange.bind(this, 'language')}
                onUnselect={this.handleSelectChange.bind(this, 'language')}
                options={{ placeholder: 'Preferred Language' }}
              />
            </div>
            <div className='col s12 m4 l4'>
              <label htmlFor='diet' style={{ visibility: this.state.pax.diet && this.state.pax.diet.length ? 'visible' : 'hidden' }}>Diet</label>
              <Select2
                multiple
                id='diet'
                data={DIET}
                value={this.state.pax.diet}
                onSelect={this.handleSelectChange.bind(this, 'diet')}
                onUnselect={this.handleSelectChange.bind(this, 'diet')}
                options={{ placeholder: 'Diet' }}
              />
            </div>
            <div className='col s12 m4 l4'>
              <label htmlFor='allergies' style={{ visibility: this.state.pax.allergies && this.state.pax.allergies.length ? 'visible' : 'hidden' }}>Allergies</label>
              <Select2
                multiple
                id='allergies'
                data={ALLERGIES}
                value={this.state.pax.allergies}
                onSelect={this.handleSelectChange.bind(this, 'allergies')}
                onUnselect={this.handleSelectChange.bind(this, 'allergies')}
                options={{ placeholder: 'Allergies' }}
              />
            </div>
          </div>
        </div>
      </Modal>
    );
  }
}
