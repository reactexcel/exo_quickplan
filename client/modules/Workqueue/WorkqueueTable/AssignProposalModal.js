import React, { Component, PropTypes } from 'react';
import Select2 from 'react-select2-wrapper';
import { PT } from 'proptypes-parser';
import Modal from '../../Utils/components/Modal';

export default class AssignProposalModal extends Component {
  static propTypes = {
    isOpened: PropTypes.bool.isRequired,
    close: PropTypes.func.isRequired,
    selectTC: PropTypes.func.isRequired,
    ...PT`{
      user: {
        userKey: String!
        supervisingTCs: [{
          _key: String!
          firstName: String!
          lastName: String!
        }]!
      }!
    }`
  };

  constructor(props) {
    super(props);

    this.state = {
      tcSelected: ''
    };
  }

  componentWillReceiveProps(newProps) {
    if (this.props !== newProps) {
      this.state = {
        tcSelected: ''
      };
    }
  }

  TCtoSelectOption = ({ firstName, lastName, _key }) => {
    const { userKey } = this.props.user;
    const text = userKey === _key
      ? 'Me'
      : [firstName, lastName].join(' ');

    return {
      text,
      id: _key
    };
  };


  selectTC = ({ target: { value } }) => {
    this.setState({ tcSelected: value });
  };

  saveSelectedTC = () => {
    const { selectTC } = this.props;
    const { tcSelected } = this.state;
    selectTC(tcSelected);
  }


  render() {
    const {
      isOpened,
      close,
      user: {
        supervisingTCs
      },
    } = this.props;
    const saveButton = <a key='btnPaxSave' className='modal-action modal-close waves-effect waves-green btn mr-20' onClick={() => this.saveSelectedTC()}><i className='mdi-action-backup left' />Save</a>;
    return (<Modal
      actionButton={saveButton}
      isModalOpened={isOpened}
      changeModalState={close}
      showCancelButton
    >
      <div className='row'>
        <div>
          Assign proposal to ...
        </div>
        <div className='col s6 m4'>
          <Select2
            value={this.state.tcSelected}
            data={supervisingTCs.map(this.TCtoSelectOption)}
            onSelect={this.selectTC}
            options={{ placeholder: 'TC' }}
            style={{ width: '100%' }}
          />
        </div>
      </div>

    </Modal>);
  }
}
