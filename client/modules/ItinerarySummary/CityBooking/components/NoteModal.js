import React, { Component, PropTypes } from 'react';
import Modal from '../../../Utils/components/Modal';


const CancelButton = () => (<a
  className='modal-action modal-close waves-effect waves-red mr-30 right '
  id='closeStartDateModal'
>CLOSE</a>);


const SaveButton = ({ onClick }) => (<a
  className='modal-action modal-close waves-effect waves-red mr-10 right'
  onClick={onClick}
  id='saveStartDateButton'
>
  <i className='mdi mdi-cloud-upload small exo-colors-text text-label mr-10' />
    SAVE
  </a>);


export default class NoteModal extends Component {
  constructor(props) {
    super(props);

    const { note } = props;

    this.state = {
      note
    };
  }

  componentWillReceiveProps({ note }) {
    this.setState({ note });
  }

  render() {
    const {
      isOpened,
      close,
      changeNote
    } = this.props;

    const { note } = this.state;

    return (<Modal
      isModalOpened={isOpened}
      changeModalState={close}
      cancelButton={<CancelButton />}
      actionButton={<SaveButton
        onClick={() => changeNote(note)}
      />}
    >
      <h3>Day Note</h3>
      <input
        type='text'
        placeholder='Notes'
        value={note}
        onChange={({ target: { value } }) => this.setState({ note: value })}
      />
    </Modal>);
  }
}
