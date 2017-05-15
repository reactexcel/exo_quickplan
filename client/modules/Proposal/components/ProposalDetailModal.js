import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import cx from 'classnames';
import _ from 'lodash';
import moment from 'moment';
import '../Proposal.scss';
import { Select2, Modal } from '../../Utils/components';
import SERVICES from '../../../services';
import { GENDERS, AGE_GROUP, getAgeGroup, STARS, STYLES, STYLE_DATA, STYLE_DATA_TITLE, STYLE_TITLE, STYLE_BUTTON_DATA } from '../Constants';

const DATE_OPTIONS = { year: 'numeric', month: 'long', day: 'numeric' };

export default class ProposalDetailModal extends Component {

  static propTypes = {
    proposal: PropTypes.object.isRequired,
    pax: PropTypes.object,
    isModalOpened: PropTypes.bool,
    changeModalState: PropTypes.func,
    handleProposalDetailSave: PropTypes.func.isRequired,
    offices: PropTypes.arrayOf(PropTypes.shape({
      _key: PropTypes.string.isRequired,
      companyName: PropTypes.string,
      officeName: PropTypes.string
    }))
  };
  static stubTravelAgent = ['Nick Pulley', 'Test Agent'];
  static stubTravelCompany = ['Selective Asia', 'Test Travel Company'];

  static officeToSelectOption = ({ _key, officeName }) => ({
    id: _key,
    text: officeName
  });

  static taOfficeToSelectOption = ({ _key, companyName }) => ({
    id: _key,
    text: companyName
  });

  static TCtoSelectOption = ({ _key, firstName, lastName }) => ({
    id: _key,
    text: _.compact([firstName, lastName]).join(' ')
  });

  static locationToSelectOption = ({ _key, name }) => ({
    id: _key,
    text: name
  });

  constructor(props) {
    super(props);

    this.state = {
      pax: {},
      proposal: {},
      selectedOffice: props.proposal.TC && props.proposal.TC.office ? props.proposal.TC.office._key : '',
      selectedTC: props.proposal.TC ? props.proposal.TC._key : '',
      selectedLocation: props.proposal.startTravelIn ? props.proposal.startTravelIn._key : '',
      selectedTAOffice: props.proposal.TA && props.proposal.TA.office ? props.proposal.TA.office._key : '',
      selectedTA: props.proposal.TA ? props.proposal.TA._key : '',
      taOffices: this.props.taOffices || [],
      offices: this.props.offices.sort((a, b) => a.officeName.localeCompare(b.officeName)) || [],
      locations: (this.props.locations || []).filter(location => location.isEXODestination).sort((a, b) => a.name.localeCompare(b.name)) || []
    };
  }

  componentWillMount() {
    this.setState({ proposal: this.props.proposal, pax: this.props.pax || {} });
  }

  componentDidMount() {
    // Datepicker, specify the different years range of datepicker for bithday/startTravelOnDate
    $(ReactDOM.findDOMNode(this.refs.startTravelOnDate)).pickadate({
      selectMonths: true, // Creates a dropdown to control month
      selectYears: 15, // Creates a dropdown of 15 years to control year
    });
    $(ReactDOM.findDOMNode(this.refs.dateOfBirth)).pickadate({
      selectMonths: true, // Creates a dropdown to control month
      selectYears: 200, // Creates a dropdown of 200 years to control year
      max: Date.now()
    });
    // Datepicker onChange event handler
    $(ReactDOM.findDOMNode(this.refs.startTravelOnDate)).on('change', this.changeProposalState.bind(this, 'startTravelOnDate'));
    $(ReactDOM.findDOMNode(this.refs.dateOfBirth)).on('change', this.changePaxTextFieldState.bind(this, 'dateOfBirth'));
  }

  componentWillReceiveProps(newProps) {
    if (this.props.proposal !== newProps.proposal) {
      this.setState({
        proposal: newProps.proposal,
        pax: newProps.pax || {},
        selectedOffice: newProps.proposal.TC.office._key || '',
        selectedTC: newProps.proposal.TC._key || '',
        selectedLocation: newProps.proposal.startTravelIn._key || '',
        selectedTAOffice: newProps.proposal.TA && newProps.proposal.TA.office ? newProps.proposal.TA.office._key : '',
        selectedTA: newProps.proposal.TA ? newProps.proposal.TA._key : '',
        taOffices: this.props.taOffices || [],
        offices: this.props.offices.sort((a, b) => a.officeName.localeCompare(b.officeName)) || [],
        locations: (this.props.locations || []).filter(location => location.isEXODestination).sort((a, b) => a.name.localeCompare(b.name)) || []
      });
    }
  }

  changeProposalState(name, e) {
    this.setState({
      proposal: {
        ...this.state.proposal,
        [name]: e.target.value
      }
    });
  }

  handleIntSelectChange(name, e) {
    this.setState({
      proposal: {
        ...this.state.proposal,
        [name]: Select2.getSelect2Values(e.currentTarget).map(StrVal => Number.parseInt(StrVal, 10))
      }
    });
  }
  handleSelectChange(name, e) {
    this.setState({
      proposal: {
        ...this.state.proposal,
        [name]: Select2.getSelect2Values(e.currentTarget)
      }
    });
  }

  handleSingleSelectChange(name, e) {
    const arrVal = Select2.getSelect2Values(e.currentTarget);
    if (arrVal.length > 0) {
      this.setState({
        proposal: {
          ...this.state.proposal,
          [name]: arrVal[0]
        }
      });
    }
  }

  handlePaxSelectChange(name, e) {
    this.setState({
      pax: {
        ...this.state.pax,
        [name]: Select2.getSelect2Values(e.currentTarget)
      }
    });
  }

  handlePaxUnselect(name, e) {
    this.setState({
      pax: {
        ...this.state.pax,
        [name]: ''
      }
    });
  }

  changePaxTextFieldState(name, e) {
    this.setState({
      pax: {
        ...this.state.pax,
        [name]: e.target.value
      }
    });
  }
  currencyCheck(value) {
    const TAOff = this.props.taOffices.filter(off => off._key === value);
    SERVICES.selectedTAOffice = TAOff[0];
  }

  renderMainPaxDiv() {
    return (
      <div>
        <div className='row'>
          <span className={STYLE_DATA_TITLE}>Traveller</span>
        </div>
        <div className='row'>
          <div className='col s12 m4 l4'>
            <label htmlFor='firstName' style={{ visibility: this.state.pax.firstName ? 'visible' : 'hidden' }}>First name</label>
            <div className='input-field'>
              <input id='firstName' placeholder='First name' value={this.state.pax.firstName} type='text' className='validate' onChange={this.changePaxTextFieldState.bind(this, 'firstName')} />
            </div>
          </div>
          <div className='col s12 m4 l4'>
            <label htmlFor='lastName' style={{ visibility: this.state.pax.lastName ? 'visible' : 'hidden' }}>Last name</label>
            <div className='input-field'>
              <input id='lastName' placeholder='Last name' value={this.state.pax.lastName} type='text' className='validate' onChange={this.changePaxTextFieldState.bind(this, 'lastName')} />
            </div>
          </div>
          <div className='col s12 m4 l4'>
            <label htmlFor='select_gender' style={{ visibility: this.state.pax.gender ? 'visible' : 'hidden' }}>Gender</label>
            <Select2
              id='select_gender'
              data={GENDERS}
              value={this.state.pax.gender}
              onSelect={this.handlePaxSelectChange.bind(this, 'gender')}
              onUnselect={this.handlePaxSelectChange.bind(this, 'gender')}
              options={{ placeholder: 'Gender' }}
            />
          </div>
        </div>
        <div className='row pb-30'>
          <div className='col s12 m4 l4'>
            <label htmlFor='dateOfBirth' style={{ visibility: this.state.pax.dateOfBirth ? 'visible' : 'hidden' }}>Date of birth</label>
            <div className='input-field'>
              { (!this.state.pax.ageOnArrival || this.state.pax.ageOnArrival === '') && (!this.state.pax.ageGroup || this.state.pax.ageGroup === '') ?
                <input id='dateOfBirth' ref='dateOfBirth' placeholder='Date of birth' defaultValue={this.state.pax.dateOfBirth} className='datepicker' id='input_dateOfBirth' type='text' />
              : <input id='dateOfBirth' ref='dateOfBirth' placeholder='Date of birth' defaultValue={this.state.pax.dateOfBirth} className='datepicker' id='input_dateOfBirth' type='text' disabled />
            }
            </div>
          </div>
          <div className='col s12 m4 l4'>
            <label htmlFor='ageOnArrival' style={{ visibility: this.state.pax.ageOnArrival !== undefined && this.state.pax.ageOnArrival !== '' ? 'visible' : 'hidden' }}>or age on arrival</label>
            <div className='input-field'>
              { (!this.state.pax.dateOfBirth || this.state.pax.dateOfBirth === '') && (!this.state.pax.ageGroup || this.state.pax.ageGroup === '') ?
                <input id='ageOnArrival' placeholder='or age on arrival' value={this.state.pax.ageOnArrival} type='number' min='0' max='1000' className='validate' onChange={this.changePaxTextFieldState.bind(this, 'ageOnArrival')} />
              : <input id='ageOnArrival' placeholder='or age on arrival' value={this.state.pax.ageOnArrival} type='number' min='0' max='1000' className='validate' onChange={this.changePaxTextFieldState.bind(this, 'ageOnArrival')} disabled />
            }
            </div>
          </div>
          <div className='col s12 m4 l4'>
            <label htmlFor='ageGroup' style={{ visibility: this.state.pax.ageGroup ? 'visible' : 'hidden' }}>or age group</label>
            { (!this.state.pax.dateOfBirth || this.state.pax.dateOfBirth === '') && (!this.state.pax.ageOnArrival || this.state.pax.ageOnArrival === '') ?
              <Select2 id='ageGroup' data={AGE_GROUP} value={this.state.pax.ageGroup} onSelect={this.handlePaxSelectChange.bind(this, 'ageGroup')} onUnselect={this.handlePaxUnselect.bind(this, 'ageGroup')} options={{ placeholder: 'or age group', tags: true, allowClear: true }} />
              : <Select2 id='ageGroup' data={AGE_GROUP} value={this.state.pax.ageGroup} options={{ placeholder: 'or age group' }} disabled />
            }
          </div>
        </div>
      </div>
    );
  }

  renderProposal({ isNewProposal }) {
    const { taOffices, offices, locations } = this.state;
    const {
      proposal,
      selectedOffice,
      selectedTC,
      selectedLocation,
      selectedTAOffice,
      selectedTA
    } = this.state;
    const selectedOfficeTCs = (offices.find(
        office => office._key === selectedOffice
      ) || {}).TCs || [];

    const selectedOfficeTAs = (taOffices.find(
        office => office._key === selectedTAOffice
      ) || {}).TAs || [];

    const taData = selectedOfficeTAs.map(ProposalDetailModal.TCtoSelectOption).sort((a, b) => a.text.localeCompare(b.text));
    taData.unshift({ id: 'Unassigned', text: 'Unassigned' });
    const tcData = selectedOfficeTCs.map(ProposalDetailModal.TCtoSelectOption).sort((a, b) => a.text.localeCompare(b.text));
    tcData.unshift({ id: 'Unassigned', text: 'Unassigned' });

    return (
      <div className='mt-5'>
        <div className='row pb-20'>
          <div className='col s3'>
            <span className={STYLE_TITLE}>{isNewProposal ? 'New Proposal' : 'Proposal Details'}</span>
          </div>
          <div className='col s9 pt-10'>
            <span className={STYLE_DATA}>{proposal._key}&nbsp; -&nbsp; {proposal.createOnDate}&nbsp; -&nbsp; {proposal.status}</span>
          </div>
        </div>
        <div className='pl-20'>
          <div className='row'>
            <span className={STYLE_DATA_TITLE}>Requested by</span>
          </div>
          <div className='row pb-30'>
            <div className='col s12 m4 l4'>
              <label htmlFor='travelCompany' style={{ visibility: this.state.selectedTAOffice ? 'visible' : 'hidden' }}>Travel company</label>
              <Select2
                id='travelCompany'
                data={taOffices.map(ProposalDetailModal.taOfficeToSelectOption)}
                value={selectedTAOffice}
                onSelect={({ target: { value } }) => {
                  this.setState({ selectedTAOffice: value, selectedTA: 'Unassigned' });
                  this.currencyCheck(value);
                }
              }
                options={{ placeholder: 'Travel company' }}
              />
            </div>
            <div className='col s12 m4 l4'>
              <label htmlFor='travelAgent' style={{ visibility: this.state.selectedTA ? 'visible' : 'hidden' }}>Travel agent</label>
              <Select2
                id='travelAgent'
                value={selectedTA}
                data={taData}
                onSelect={({ target: { value } }) => this.setState({
                  selectedTA: value
                })}
                options={{ placeholder: 'Travel agent' }}
              />
            </div>
          </div>
          <div className='row'>
            <span className={STYLE_DATA_TITLE}>EXO travel consultant</span>
          </div>
          <div className='row pb-30'>
            <div className='col s12 m4 l4'>
              <label htmlFor='exoCompany' style={{ visibility: this.state.selectedOffice ? 'visible' : 'hidden' }}>Exo office</label>
              <Select2
                id='exoCompany'
                data={offices.map(ProposalDetailModal.officeToSelectOption)}
                value={selectedOffice}
                onSelect={({ target: { value } }) => this.setState({
                  selectedOffice: value,
                  selectedTC: 'Unassigned'
                })}
                options={{ placeholder: 'Exo office' }}
              />
            </div>
            <div className='col s12 m4 l4'>
              <label htmlFor='exoConsultant' style={{ visibility: this.state.selectedTC ? 'visible' : 'hidden' }}>Exo consultant</label>
              <Select2
                id='exoConsultant'
                value={selectedTC}
                data={tcData}
                onSelect={({ target: { value } }) => this.setState({
                  selectedTC: value
                })}
                options={{ placeholder: 'Exo consultant' }}
              />
            </div>
          </div>
          {isNewProposal ? this.renderMainPaxDiv() : null}
          <div className='row'>
            <span className={STYLE_DATA_TITLE}>Travel plan</span>
          </div>
          <div className='row pb-30'>
            <div className='col s12 m4 l4'>
              <label htmlFor='startTravelInCity' style={{ visibility: this.state.selectedLocation ? 'visible' : 'hidden' }}>Would like to start in</label>
              <Select2
                id='startTravelInCity'
                data={locations.map(ProposalDetailModal.locationToSelectOption)}
                value={selectedLocation}
                onSelect={({ target: { value } }) => this.setState({
                  selectedLocation: value
                })}
                options={{ placeholder: 'Would like to start in' }}
              />
            </div>
            <div className='col s12 m4 l4'>
              <label htmlFor='startTravelOnDate' style={{ visibility: this.state.proposal.startTravelOnDate ? 'visible' : 'hidden' }}>Start On</label>
              <div className='input-field'>
                <input id='startTravelOnDate' ref='startTravelOnDate' placeholder='Start On' defaultValue={this.state.proposal.startTravelOnDate} className='datepicker' id='input_startTravelOnDate' type='text' required />
              </div>
            </div>
            <div className='col s12 m4 l4'>
              <label htmlFor='input_tripDuration' style={{ visibility: this.state.proposal.travelDuration !== undefined && this.state.proposal.travelDuration !== '' ? 'visible' : 'hidden' }}>Proposed duration</label>
              <div className='input-field'>
                <input id='input_tripDuration' placeholder='Proposed duration' value={this.state.proposal.travelDuration} type='number' min='1' className='validate' onChange={this.changeProposalState.bind(this, 'travelDuration')} required />
              </div>
            </div>
          </div>
          <div className='row'>
            <span className={STYLE_DATA_TITLE}>Travel preferences</span>
          </div>
          <div className='row pb-30'>
            <div className='col s12 m4 l4'>
              <label htmlFor='class' style={{ visibility: this.state.proposal.class && this.state.proposal.class.length ? 'visible' : 'hidden' }}>Class</label>
              <Select2
                multiple
                id='class'
                data={STARS}
                value={this.state.proposal.class}
                onSelect={this.handleIntSelectChange.bind(this, 'class')}
                onUnselect={this.handleIntSelectChange.bind(this, 'class')}
                options={{ placeholder: 'Class' }}
              />
            </div>
            <div className='col s12 m4 l4'>
              <label htmlFor='style' style={{ visibility: this.state.proposal.style && this.state.proposal.style.length ? 'visible' : 'hidden' }}>Style</label>
              <Select2
                multiple
                id='style'
                data={STYLES}
                value={this.state.proposal.style}
                onSelect={this.handleSelectChange.bind(this, 'style')}
                onUnselect={this.handleSelectChange.bind(this, 'style')}
                options={{ placeholder: 'Style' }}
              />
            </div>
          </div>
          <div className='row'>
            <span className={STYLE_DATA_TITLE}>Description</span>
          </div>
          <div className='row pt-10'>
            <div className='col s12 m4 l4'>
              <div className='input-field'>
                <input id='input_proposalName' className='materialize-textarea mt-10' value={this.state.proposal.name} onChange={this.changeProposalState.bind(this, 'name')} />
                <label className='active' htmlFor='input_proposalName'>Title</label>
              </div>
            </div>
          </div>
          <div className='row'>
            <div className='col s12'>
              <div className='input-field'>
                <textarea id='input_proposalNotes' className='materialize-textarea mt-10' value={this.state.proposal.notes} onChange={this.changeProposalState.bind(this, 'notes')} />
                <label className='active' htmlFor='input_proposalNotes'>Notes</label>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  validateProposal(isNewProposal) {
    const { startTravelOnDate, travelDuration } = this.state.proposal;
    if (!startTravelOnDate || !travelDuration || travelDuration === '' || travelDuration <= 0) {
      return false;
    }

    if (isNewProposal) {
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
    }
    return true;
  }

  // new Proposal page
  renderNewProposal() {
    const { isModalOpened, changeModalState, handleProposalDetailSave } = this.props;

    const valid = this.validateProposal(true);
    const clearProposalDataCallBack = () => {
      // jquery api to clear the datepicker content
      $(ReactDOM.findDOMNode(this.refs.dateOfBirth)).pickadate('picker').clear();
      $(ReactDOM.findDOMNode(this.refs.startTravelOnDate)).pickadate('picker').clear();

      this.setState({
        proposal: {
          name: '',
          status: 'New',
          startTravelInCity: '',
          startTravelOnDate: '',
          travelDuration: '',
          class: [],
          style: [],
          notes: '',
          private: false,
          createOnDate: new Date().toLocaleDateString('en-US', DATE_OPTIONS)
        },
        pax: {
          firstName: '',
          lastName: '',
          ageOnArrival: '',
          gender: '',
          dateOfBirth: '',
          ageGroup: ''
        },
        selectedOffice: '',
        selectedTC: '',
        selectedLocation: '',
        selectedTAOffice: '',
        selectedTA: '',
      });
    };
    const saveProposalDetailButton = [
      <a key='btnProposalSaveAndOpen' className={cx('modal-action modal-close waves-effect waves-green btn mr-20', { hide: !valid })} onClick={() => handleProposalDetailSave(this.state, true)}><i className='mdi-action-backup left' />Save and Open</a>,
      <a key='btnProposalSave' className={cx('modal-action waves-effect waves-green btn mr-20', { hide: !valid })} onClick={() => handleProposalDetailSave(this.state, false, clearProposalDataCallBack)}><i className='mdi-action-backup left' />Save and New</a>,
      <a key='btnProposalSaveAndOpenDisable' className={cx('btn disabled mr-20', { hide: valid })} style={{ cursor: 'not-allowed' }}><i className='mdi-action-backup left' />Save and Open</a>,
      <a key='btnProposalSaveDisable' className={cx('btn disabled mr-20', { hide: valid })} style={{ cursor: 'not-allowed' }}><i className='mdi-action-backup left' />Save and New</a>
    ];

    return (
      <Modal actionButton={saveProposalDetailButton} isModalOpened={isModalOpened} changeModalState={changeModalState} className='proposal-modal exo-colors modal-bgr1'>
        {this.renderProposal({ isNewProposal: true })}
      </Modal>
    );
  }

  // Edit proposal Modal
  renderEditProposal() {
    const { proposal, selectedTC, selectedOffice, selectedLocation } = this.state;
    const { isModalOpened, changeModalState, handleProposalDetailSave } = this.props;
    const valid = this.validateProposal(false);
    const saveProposalDetailButton = [
      <a key='btnPaxSave' className={cx('modal-action modal-close waves-effect waves-green btn mr-20', { hide: !valid })} onClick={() => handleProposalDetailSave(this.state)}><i className='mdi-action-backup left' />Save</a>,
      <a key='btnDisable' className={cx('btn disabled mr-20', { hide: valid })} style={{ cursor: 'not-allowed' }}><i className='mdi-action-backup left' />Save</a>
    ];
    return (
      <Modal actionButton={saveProposalDetailButton} isModalOpened={isModalOpened} changeModalState={changeModalState} className='proposal-modal exo-colors modal-bgr1'>
        {this.renderProposal({ isNewProposal: false })}
      </Modal>
    );
  }

  render() {
    const { proposal } = this.state;
    if (proposal._key) {
      return this.renderEditProposal();
    }

    return this.renderNewProposal();
  }

}
