import React from 'react';
import Relay from 'react-relay';
// import Select from 'react-select';
import ReactDOM from 'react-dom';
import { browserHistory } from 'react-router';
import '../../../../node_modules/react-select/scss/default.scss';
import '../Proposal.scss';
import ProposalAddMutation from '../mutations/Add';
import AddTripMutation from '../../Trip/mutations/Add';

// const THEMES = [
// { label: 'Active', value: 'Active' },
// { label: 'Wellness & Spirit', value: 'Wellness & Spirit' },
// { label: 'Photography', value: 'Photography' },
// { label: 'Nature & Wildlife', value: 'Nature & Wildlife' },
// { label: 'Beach', value: 'Beach' },
// { label: 'Sustainable', value: 'Sustainable' },
// { label: 'Heritage & Culture', value: 'Heritage & Culture' },
// { label: 'Culinary', value: 'Culinary' },
// { label: 'Festivals', value: 'Festivals' },
// { label: 'Art & Arcitecture', value: 'Art & Arcitecture' },
// { label: 'Cycling', value: 'Cycling' },
// { label: 'Trekking', value: 'Trekking' },
// { label: 'Multi-activity', value: 'Multi-activity' },
// { label: 'Challenge', value: 'Challenge' },
// { label: 'Kayaking', value: 'Kayaking' },
// { label: 'Rafting', value: 'Rafting' },
// { label: 'Skiing', value: 'Skiing' }
// ].sort((a, b) => a.label.localeCompare(b.label));
//
// const OCCASIONS = [
// { label: 'Honeymoon', value: 'Honeymoon' },
// { label: 'Anniversary', value: 'Anniversary' },
// { label: 'Birthday', value: 'Birthday' },
// { label: 'Graduation', value: 'Graduation' },
// { label: 'Reward / Incentive', value: 'Reward / Incentive' },
// { label: 'Promotion & Green Season', value: 'Promotion & Green Season' }
// ];
// const GENDERS = [{ label: 'Male', value: 'Male' }, { label: 'Female', value:
// 'Female' }];

const DATE_OPTIONS = { year: 'numeric', month: 'long', day: 'numeric' };

export default class Add extends React.Component {
  state = {
    proposal: {
      mainPAX: {}
    }
  };

  // NOTES, add a new blank proposal and blank trip.
  // Use the new design to instead.
  componentDidMount() {
    this.addBlankProposal();
    // this.initMaterialComponent();
  }

  initMaterialComponent() {
    // Datepicker
    $('.datepicker').pickadate({
      selectMonths: true, // Creates a dropdown to control month
      selectYears: 200, // Creates a dropdown of 15 years to control year
      format: 'yyyy-mm-dd',
      format_submit: 'yyyy-mm-dd'
    });
    // Datepicker onChange event handler
    $(ReactDOM.findDOMNode(this.refs.dop)).on('change', this.changeMainPaxState.bind(this, 'dateOfBirth'));
    $(ReactDOM.findDOMNode(this.refs.startTripOn)).on('change', this.changeMainPaxState.bind(this, 'startTravelOnDate'));
    $('select').material_select();
  }

  addBlankProposal = () => {
    let proposalKey;
    const onTripSuccess = function onSuccess() {
      browserHistory.push(`/trip-planner/${proposalKey}`);
    };

    const onFailure = (transaction) => {
      const error = transaction.getError() || new Error('Mutation failed.');
      console.error(error);// eslint-disable-line no-console
    };

    const onProposalSuccess = function onSuccess(res) {
      proposalKey = res.addProposal.proposal._key;

      Relay.Store.commitUpdate(new AddTripMutation({
        proposalKey,
        status: 'Draft'
      }), { onFailure, onSuccess: onTripSuccess });
    };

    Relay.Store.commitUpdate(new ProposalAddMutation({
      travelCompany: '',
      travelAgent: '',
      exoCompany: '',
      exoConsultant: 'Unassigned',
      name: '',
      status: 'New',
      startTravelInCity: '',
      startTravelOnDate: '',
      travelDuration: 0,
      class: [],
      style: [],
      notes: '',
      createOnDate: new Date().toLocaleDateString('en-US', DATE_OPTIONS)
    }), { onFailure, onSuccess: onProposalSuccess });
  }

  handleAddSubmit = (e) => {
    e.preventDefault();
    let proposalKey;

    const onTripSuccess = function onSuccess(res) {
      browserHistory.push(`/trip-planner/${proposalKey}/${res.addTrip.trip._key}`);
    };

    const onFailure = (transaction) => {
      const error = transaction.getError() || new Error('Mutation failed.');
      console.error(error);// eslint-disable-line no-console
    };

    const onProposalSuccess = function onSuccess(res) {
      proposalKey = res.addProposal.proposal._key;

      // Create a default trip
      Relay.Store.commitUpdate(new AddTripMutation({
        proposalKey
      }), { onFailure, onSuccess: onTripSuccess });
    };

    Relay.Store.commitUpdate(new ProposalAddMutation({
      ...this.state.proposal
    }), { onFailure, onSuccess: onProposalSuccess });
  };

  handleStarChange(name, e) {
    this.setState({ [name]: e.target.value });
  }

  handleSelectChange(name, selectedOptions) {
    this.setState({
      proposal: {
        ...this.state.proposal,
        [name]: selectedOptions.map(option => option.value)
      }
    });
  }

  handleSelectChangeMainPAX(name, e) {
    this.setState({
      proposal: {
        ...this.state.proposal,
        mainPAX: {
          ...this.state.proposal.mainPAX,
          [name]: e
        }
      }
    });
  }

  changeProposalState(name, e) {
    this.setState({
      proposal: {
        ...this.state.proposal,
        [name]: e.target.value
      }
    });
  }

  changeMainPaxState(name, e) {
    this.setState({
      proposal: {
        ...this.state.proposal,
        mainPAX: {
          ...this.state.proposal.mainPAX,
          [name]: e.target.value
        }
      }
    });
  }

  render() {
    // const startRating = (
    // <div className='rating'>
    // {
    // [5, 4, 3, 2, 1].map(i => [
    // <input type='radio' id={`rating-star-${i}`} name='rating-star' value={i}
    // onChange={this.handleStarChange.bind(this, 'class')} />,
    // <label htmlFor={`rating-star-${i}`}><i className='mdi-action-grade' style={{
    // fontSize: '.9em' }} /></label>
    // ])
    // }
    // </div>
    // );

    return null;
    /*
    (
      <div>
        <div className='modal-content flow-text'>
          <div className='row'>
            <div className='col s2'>Proposal</div>
          </div>
          <div className='card mt-20 p-20'>
            <div className='row'>
              <div className='col s12 pb-10 mnt-30'>Responsible Travel Agent</div>
            </div>
            <div className='row'>
              <div className='col s4'>
                <div className='input-field'>
                  <input id='input_travelCompany' value={this.state.proposal.travelCompany} type='text' className='validate' onChange={this.changeProposalState.bind(this, 'travelCompany')} />
                  <label className='active' htmlFor='input_travelCompany'>Travel Company</label>
                </div>
              </div>
              <div className='col s4'>
                <div className='input-field'>
                  <input id='input_TA' value={this.state.proposal.travelAgent} type='text' className='validate' onChange={this.changeProposalState.bind(this, 'travelAgent')} />
                  <label className='active' htmlFor='input_TA'>Travel Agent</label>
                </div>
              </div>
            </div>
          </div>
          <div className='card mt-20 p-20'>
            <div className='row'>
              <div className='col s12 pb-10 mnt-30'>Lead Traveler</div>
            </div>
            <div className='row'>
              <div className='col s4'>
                <div className='input-field'>
                  <input id='input_mainPAXPassport' value={this.state.proposal.mainPAX.mainPAXPassport} type='text' className='validate' onChange={this.changeMainPaxState.bind(this, 'mainPAXPassport')} />
                  <label className='active' htmlFor='input_mainPAXPassport'>Passport</label>
                </div>
              </div>
              <div className='col s4'>
                <div className='input-field'>
                  <input id='input_passportCountryOfIssue' value={this.state.proposal.mainPAX.passportCountryOfIssue} type='text' className='validate' onChange={this.changeMainPaxState.bind(this, 'passportCountryOfIssue')} />
                  <label className='active' htmlFor='input_passportCountryOfIssue'>Country of Issue</label>
                </div>
              </div>
              <div className='col s4'>
                <div className='input-field'>
                  <input id='input_preferredLanguage' value={this.state.proposal.mainPAX.preferredLanguage} type='text' className='validate' onChange={this.changeMainPaxState.bind(this, 'preferredLanguage')} />
                  <label className='active' htmlFor='input_preferredLanguage'>Preferred Language</label>
                </div>
              </div>
            </div>
            <div className='row'>
              <div className='col s4'>
                <div className='input-field'>
                  <input id='input_mainPAXName' value={this.state.proposal.mainPAX.mainPAXName} type='text' className='validate' onChange={this.changeMainPaxState.bind(this, 'mainPAXName')} />
                  <label className='active' htmlFor='input_mainPAXName'>Name</label>
                </div>
              </div>
              <div className='col s4'>
                <Select className='select-option' simpleValue value={this.state.proposal.mainPAX.gender} placeholder='Gender' options={GENDERS} onChange={this.handleSelectChangeMainPAX.bind(this, 'gender')} />
              </div>
              <div className='col s4'>
                <div className='input-field'>
                  <input ref='dop' className='datepicker' id='input_dob' defaultValue={this.state.proposal.mainPAX.dateOfBirth} type='date' />
                  <label className='active' htmlFor='input_dob'>Date of Birth</label>
                </div>
              </div>
            </div>
          </div>
          <div className='card mt-20 p-20'>
            <div className='row'>
              <div className='col s12 pb-10 mnt-30'>Travelers</div>
            </div>
            <div className='row'>
              <div className='col s4'>
                <div className='input-field'>
                  <input id='input_nrOfAdults' value={this.state.proposal.nrAdult} type='number' className='validate' onChange={this.changeProposalState.bind(this, 'nrAdult')} />
                  <label className='active' htmlFor='input_nrOfAdults'># Adults (age 13 and older)</label>
                </div>
              </div>
              <div className='col s4'>
                <div className='input-field'>
                  <input id='input_nrOfChildren' value={this.state.proposal.nrChildren} type='number' className='validate' onChange={this.changeProposalState.bind(this, 'nrChildren')} />
                  <label className='active' htmlFor='input_nrOfChildren'># Children (age 2 - 13)</label>
                </div>
              </div>
              <div className='col s4'>
                <div className='input-field'>
                  <input id='input_nrOfInfants' value={this.state.proposal.nrInfant} type='number' className='validate' onChange={this.changeProposalState.bind(this, 'nrInfant')} />
                  <label className='active' htmlFor='input_nrOfInfants'># Infants (age under 2)</label>
                </div>
              </div>
            </div>
          </div>
          <div className='card mt-20 p-20'>
            <div className='row'>
              <div className='col s12 pb-10 mnt-30'>Travel Details</div>
            </div>
            <div className='row'>
              <div className='col s4'>
                <div className='input-field'>
                  <input id='input_startTripIn' value={this.state.proposal.startTravelInCity} type='text' className='validate' onChange={this.changeProposalState.bind(this, 'startTravelInCity')} />
                  <label className='active' htmlFor='input_startTripIn'>Would like to start in</label>
                </div>
              </div>
              <div className='col s4'>
                <div className='input-field'>
                  <input ref='startTravelOnDate' className='datepicker' id='input_start_on' type='date' />
                  <label className='active' htmlFor='input_start_on'>Start Trip On</label>
                </div>
              </div>
              <div className='col s4'>
                <div className='input-field'>
                  <input id='input_tripDuration' value={this.state.proposal.travelDuration} type='number' className='validate' onChange={this.changeProposalState.bind(this, 'travelDuration')} />
                  <label className='active' htmlFor='input_tripDuration'>Trip Duration (days)</label>
                </div>
              </div>
            </div>
            <div className='row'>
              <div className='col s4'>
                <div className='input-field'>
                  <input id='input_totalPAX' value={this.state.proposal.totalPAX} type='number' className='validate' onChange={this.changeProposalState.bind(this, 'totalPAX')} />
                  <label className='active' htmlFor='input_totalPAX'>Total PAX</label>
                </div>
              </div>
            </div>
          </div>
          <div className='card mt-20 p-20'>
            <div className='row'>
              <div className='col s12 pb-10 mnt-30'>Travel Preferences</div>
            </div>
            <div className='row'>
              <div className='col s4'>
                {startRating}
              </div>
              <div className='col s4'>
                <Select className='select-option' multi value={this.state.proposal.styles} placeholder='Style' options={THEMES} onChange={this.handleSelectChange.bind(this, 'styles')} />
              </div>
              <div className='col s4'>
                <Select className='select-option' multi value={this.state.proposal.occasions} placeholder='Trip occasion' options={OCCASIONS} onChange={this.handleSelectChange.bind(this, 'occasions')} />
              </div>
            </div>
          </div>
          <div className='card mt-20 p-20'>
            <div className='row'>
              <div className='col s12 pb-10 mnt-30'>Notes</div>
            </div>
            <div className='row'>
              <div className='col s12'>
                <div className='input-field'>
                  <i className='mdi-editor-mode-edit prefix' />
                  <textarea id='input_proposalNotes' className='materialize-textarea' value={this.state.proposal.notes} onChange={this.changeProposalState.bind(this, 'notes')} />
                  <label className='active' htmlFor='input_proposalNotes' />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className='modal-footer'>
          <a className='modal-action modal-close btn left'>Cancel</a>
          <button className='modal-action modal-close btn right' onClick={this.handleAddSubmit}><i className='mdi-file-cloud' /> New</button>
        </div>
      </div>
    );
    */
  }
}
