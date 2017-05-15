import React, { Component, PropTypes } from 'react';
import Relay from 'react-relay';
import ReactDOM from 'react-dom';
import { browserHistory } from 'react-router';
import ProposalAddMutation from '../mutations/Add';
import AddTripMutation from '../../Trip/mutations/Add';
import ProposalDetailModal from './ProposalDetailModal';
import { STARS, STYLES, STYLE_DATA, STYLE_DATA_TITLE, STYLE_TITLE, STYLE_BUTTON_DATA } from '../Constants';

const DATE_OPTIONS = { year: 'numeric', month: 'long', day: 'numeric' };

export default class NewProposal extends Component {

  static propTypes = {
    isModalOpened: PropTypes.bool,
    changeModalState: PropTypes.func,
  };

  state = {
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
      ageGroup: ''
    }
  }

  handleProposalDetailSave = ({
    proposal,
    pax,
    selectedOffice,
    selectedTC,
    selectedLocation,
    selectedTAOffice,
    selectedTA
  }, isOpenNewProposal, callback) => {
    let proposalKey;
    const { auth } = this.props;
    const onTripSuccess = function onSuccess() {
      if (isOpenNewProposal) {
        browserHistory.push(`/trip-planner/${proposalKey}`);
      } else if (callback) callback();
    };

    const onFailure = (transaction) => {
      const error = transaction.getError() || new Error('Mutation failed.');
      console.error(error);// eslint-disable-line no-console
    };

    const onProposalSuccess = function onSuccess(res) {
      proposalKey = res.addProposal.proposal._key;
      Relay.Store.commitUpdate(new AddTripMutation({
        proposalKey,
        status: 'Draft',
        startDate: proposal.startTravelOnDate
      }), { onFailure, onSuccess: onTripSuccess });
    };
    if (selectedTC && selectedTC !== 'Unassigned' && proposal.status === 'New') {
      proposal.status = 'In Progress'; // eslint-disable-line no-param-reassign
    }
    Relay.Store.commitUpdate(new ProposalAddMutation({
      proposal,
      pax,
      selectedOffice,
      selectedTC,
      selectedLocation,
      selectedTAOffice,
      selectedTA,
      userToken: auth.getAccessToken()
    }), { onFailure, onSuccess: onProposalSuccess });
  }

  render() {
    const { offices, locations, taOffices } = this.props.viewer;
    const { proposal, pax } = this.state;
    return (<ProposalDetailModal
      proposal={proposal}
      pax={pax}
      offices={offices}
      taOffices={taOffices}
      locations={locations}
      isModalOpened={this.props.isModalOpened}
      changeModalState={this.props.changeModalState}
      handleProposalDetailSave={(proposal, isOpenNewProposal, callback) => this.handleProposalDetailSave(proposal, isOpenNewProposal, callback)}
    />);
  }
}
