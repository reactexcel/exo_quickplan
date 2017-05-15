import React from 'react';
import Relay from 'react-relay';
import '../../../../node_modules/react-select/scss/default.scss';
import '../Proposal.scss';
import PaxModal from './PaxModal';
import { Modal, Card } from '../../Utils/components';
import UpdateProposalPax from '../mutations/UpdateProposalPax';
import DeleteProposalPax from '../mutations/DeleteProposalPax';
import AddProposalPax from '../mutations/AddProposalPax';
import UpdateProposalMainPax from '../mutations/UpdateProposalMainPax';
import { STYLE_TITLE, STYLE_DATA, STYLE_DATA_BOLD, STYLE_DATA_TITLE, STYLE_BUTTON_DATA, STYLE_BUTTON_DISABLE } from '../Constants';

export default class ProposalPaxsCard extends React.Component {
  static propTypes = {
    viewer: React.PropTypes.object.isRequired,
    relay: React.PropTypes.object
  }

  state = {
    isPaxModalOpened: false,
    isDeletePaxModalOpened: false,
    selectedPax: null
  }

  originalMainPaxKey = null;
  componentWillMount() {
    const { paxs } = this.props.viewer.proposal;
    for (let i = 0; i < paxs.length; i++) {
      if (paxs[i].isMainPax) {
        this.originalMainPaxKey = paxs[i]._key;
        break;
      }
    }
  }

  handlePaxSave = (pax) => {
    const relay = this.props.relay;
    let args;
    // update a existed pax
    if (pax._key) {
      args = new UpdateProposalPax({
        ...pax
      });
    } else {
      // new a pax
      args = new AddProposalPax({
        ...pax,
        isMainPax: this.props.viewer.proposal.length === 0,
        proposalKey: this.props.viewer.proposal._key
      });
    }
    Relay.Store.commitUpdate(args, {
      onSuccess: () => {
        relay.forceFetch();
      },
      onFailure: response => console.log('pax update failed', response) // eslint-disable-line no-console
    });
  }

  handlePaxDelete = () => {
    const pax = this.state.selectedPax;
    const proposalKey = this.props.viewer.proposal._key;
    const relay = this.props.relay;
    Relay.Store.commitUpdate(new DeleteProposalPax({
      paxKey: pax._key,
      proposalKey
    }), {
      onSuccess: () => {
        relay.forceFetch();
      },
      onFailure: response => console.log('proposal pax delete failed', response) // eslint-disable-line no-console
    });
  }

  handleMainPaxUpdate = (pax) => {
    const proposalKey = this.props.viewer.proposal._key;
    const mainPaxKey = pax._key;
    const relay = this.props.relay;
    Relay.Store.commitUpdate(new UpdateProposalMainPax({
      mainPaxKey,
      proposalKey
    }), {
      onSuccess: () => {
        relay.forceFetch();
      },
      onFailure: response => console.log('update proposal main pax failed', response) // eslint-disable-line no-console
    });
  }

  changePaxModalState = (isOpen, selectedPax) => {
    this.setState({ isPaxModalOpened: isOpen, selectedPax });
  }

  changeDeletePaxModalState = (isOpen, selectedPax) => {
    this.setState({ isDeletePaxModalOpened: isOpen, selectedPax });
  }

  newPax = () => ({
    _key: null,
    firstName: '',
    lastName: '',
    ageOnArrival: '',
    passportNr: '',
    diet: [],
    allergies: [],
    gender: '',
    ageGroup: '',
    language: '',
    nationality: ''
  })

  renderPaxCard = (pax) => {
    pax.diet = pax.diet || []; // eslint-disable-line no-param-reassign
    pax.allergies = pax.allergies || []; // eslint-disable-line no-param-reassign
    pax.ageOnArrival = pax.ageOnArrival || ''; // eslint-disable-line no-param-reassign
    return (
      <div key={pax._key} className='pt-20 pb-30' >
        <div className='valign-wrapper'>
          <div>
            { pax.isMainPax ? <i className='mdi mdi-account-star-variant exo-colors-text text-base1 mr-10 fs-26' /> : <i className='mdi mdi-account mr-10 fs-26' /> }
          </div>
          <div className='row mt-0' style={{ width: '100%' }}>
            <div className='col s6'>
              <span className={STYLE_DATA_TITLE}>{`${pax.firstName} ${pax.lastName}`}</span>
            </div>
            <div className='col s6 right-align'>
              <a className='pr-20 cursor' onClick={() => this.changePaxModalState(true, pax)}>
                <i className='mdi-editor-mode-edit small mr-5' />
                <span className={STYLE_BUTTON_DATA}>EDIT</span>
              </a>
              <a className='pr-10 cursor' onClick={() => this.changeDeletePaxModalState(true, pax)}>
                <i className='mdi mdi-delete small mr-5' />
                <span className={STYLE_BUTTON_DATA}>REMOVE</span>
              </a>
            </div>
          </div>
        </div>
        <div className='pl-35'>
          <div className='row'>
            <div className='col s3'>
              <label htmlFor='dateOfBirth'>DOB</label>
              <div id='dateOfBirth'><span className={STYLE_DATA_BOLD}>{pax.dateOfBirth}</span></div>
              <div id='age'><span className='exo-colors-text text-data-1 fs-16 fw-700'>{pax.ageOnArrival} years old</span></div>
            </div>
            <div className='col s3'>
              <label htmlFor='gender'>Gender</label>
              <div id='gender'><span className={STYLE_DATA_BOLD}>{pax.gender}</span></div>
            </div>
            <div className='col s3 '>
              <label htmlFor='passport'>Passport</label>
              <div id='passport'><span id='passport' className={STYLE_DATA_BOLD}>{pax.nationality} - {pax.passportNr}</span></div>
              <div id='passport'><span id='passport' className='exo-colors-text text-data-1 fs-16 fw-700'>{pax.passportExpiresOn}</span></div>
            </div>
            <div className='col s3'>
              <label htmlFor='preferredLanguage'>Preferred Language</label>
              <div id='preferredLanguage'><span id='preferredLanguage' className={STYLE_DATA_BOLD}>{pax.language}</span></div>
            </div>
          </div>
          <div className='row'>
            <div className='col s12 m6 l6'>
              <label htmlFor='diet'>Diet</label>
              <div id='Diet'>{pax.diet.map(diet => <div key={diet} className='chip mt-5 mr-5 fs-16 fw-700'><span>{diet}</span></div>)}</div>
            </div>
            <div className='col s12 m6 l6'>
              <label htmlFor='allergies'>Allergies</label>
              <div id='allergies'>{pax.allergies.map(allergy => <div key={allergy} className='chip mt-5 mr-5 fs-16 fw-700'><span>{allergy}</span></div>)}</div>
            </div>
          </div>
          <div className='row left-align pt-10'>
            { pax.isMainPax ? (
              <div className='col s4 m4 l4 cursor'>
                <input type='checkbox' id='ifLeadTraveller' checked='checked' disabled='disabled' />
                <label className={STYLE_BUTTON_DISABLE} htmlFor='ifLeadTraveller'>LEAD TRAVELLER</label>
              </div>
          ) : (
            <div className='col s4 m4 l4 left-align cursor'>
              <a onClick={() => this.handleMainPaxUpdate(pax)}>
                <i className='mdi-toggle-check-box-outline-blank small mr-5' />
                <span className={STYLE_BUTTON_DATA}>LEAD TRAVELLER</span>
              </a>
            </div>
            )
          }
          </div>
          <div className='row pt-20'>
            <div className='divider' />
          </div>
        </div>
      </div>
    );
  };

  render() {
    const { proposal } = this.props.viewer;
    let paxs = proposal.paxs;
    if (this.originalMainPaxKey !== null) {
      const originalMainPaxIdx = paxs.findIndex(pax => pax._key === this.originalMainPaxKey);
      if (originalMainPaxIdx > 0) {
        paxs = [paxs[originalMainPaxIdx]].concat(paxs.slice(0, originalMainPaxIdx), paxs.slice(originalMainPaxIdx + 1));
      }
    }
    const deletePaxModal = <a className='modal-action modal-close waves-effect waves-green btn mr-20' onClick={() => this.handlePaxDelete()}><i className='mdi-content-remove left' />Remove Traveller</a>;
    const title = [<span key='travellers' style={{ float: 'left' }}>Travellers</span>, <div key='travellerNum' style={{ float: 'left' }} className='chip mt-5 ml-30 exo-colors base1'><span className='exo-colors-text text-accent-1 fs-24 fw-700'>{paxs.length}</span></div>];
    return (
      <Card title={title} titleClassName={`exo-colors modal-bgr1 pt-10 pb-10 ${STYLE_TITLE}`} titleBackColor='white' minimized doFullCardTitleExpand>
        <div className='pt-10'>
          {paxs.map(pax => this.renderPaxCard(pax))}
          <div className='row pb-20 pl-30 exo-colors-text text-base1'>
            <a className='exo-colors-text text-data-1 cursor' onClick={() => this.changePaxModalState(true, this.newPax())}>
              <i className='mdi-content-add small mr-5 exo-colors-text text-base1' />
              <span className={STYLE_BUTTON_DATA}>ADD TRAVELLER</span>
            </a>
          </div>
        </div>
        {
          this.state.isPaxModalOpened ?
            <PaxModal
              locations={this.props.viewer.locations}
              pax={this.state.selectedPax}
              isModalOpened={this.state.isPaxModalOpened}
              changeModalState={isOpen => this.changePaxModalState(isOpen, -1)}
              handlePaxSave={this.handlePaxSave}
            />
            : null
        }
        { this.state.isDeletePaxModalOpened ?
          <Modal
            actionButton={deletePaxModal}
            isModalOpened={this.state.isDeletePaxModalOpened}
            changeModalState={this.changeDeletePaxModalState}
            className='proposal-modal exo-colors modal-bgr1'
            style={{ width: '60%', overflowY: 'hidden', fontWeight: '400' }}
          >
            <div className='row'>
              <p>This will remove this traveller from proposal and all its reservations.</p>
              <p>Do you want to remove traveller?</p>
            </div>
          </Modal>
          : null
        }
      </Card>
    );
  }
}
