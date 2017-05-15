import React, { Component, PropTypes } from 'react';
// import ReactDOM from 'react-dom';
import '../Proposal.scss';
import { Modal } from '../../Utils/components';

export default class MarkAsLostModal extends Component {
  static propTypes = {
    notes: PropTypes.string.isRequired,
    isModalOpened: PropTypes.bool.isRequired,
    changeModalState: PropTypes.func.isRequired,
    handleMarkProposalAsLost: PropTypes.func.isRequired
  }

  state = {
    notes: '',
  }

  componentWillMount() {
    this.setState({
      notes: this.props.notes || '',
    });
  }

  componentWillReceiveProps(newProps) {
    this.setState({
      notes: newProps.notes || '',
    });
  }

  changeTextState(name, e) {
    this.setState({
      [name]: e.target.value
    });
  }

  render() {
    const { isModalOpened, changeModalState, handleMarkProposalAsLost } = this.props;
    const markAsLostClick = () => handleMarkProposalAsLost(this.state.notes);
    const markAsLostButton = <a className='modal-action modal-close waves-effect waves-green btn mr-20' onClick={markAsLostClick}><i className='mdi-notification-do-not-disturb left' />MARK AS LOST</a>;

    return (
      <Modal
        actionButton={markAsLostButton}
        isModalOpened={isModalOpened}
        changeModalState={changeModalState}
        className='proposal-modal exo-colors modal-bgr1'
        style={{ width: '60%', overflowY: 'hidden' }}
      >
        <div className='row'>
          <div className='col'>
            <span className='exo-colors-text text-data-1 fs-24 fw-300'>Mark proposal as lost</span>
          </div>
        </div>
        <div className='row'>
          <div className='col s12'>
            <label className='active' htmlFor='input_notes'>Notes</label>
            <textarea id='input_notes' className='materialize-textarea' value={this.state.notes} onChange={this.changeTextState.bind(this, 'notes')} />
          </div>
        </div>
      </Modal>
    );
  }
}
