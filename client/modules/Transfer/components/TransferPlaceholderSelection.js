import React, { Component, PropTypes } from 'react';
import cx from 'classnames';
import styles from '../style.module.scss';
import TransferIcon from './TransferIcon';

export default class TransferPlaceholderSelection extends Component {

  static propTypes = {
    onClick: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = { };
  }

  render() {
    return (
      <div className={cx(styles['transfer-selection-item'], 'cursor')} onClick={this.props.onClick}>
        <div className='row m-0 p-0'>
          <div className='col s2 mr-5 fw-600 fs-20'><TransferIcon typeDescription='Custom' /></div>
          <div className='col s9 fw-600 fs-12 pt-5'>
            <div>Custom</div>
          </div>
        </div>
      </div>
    );
  }

}
