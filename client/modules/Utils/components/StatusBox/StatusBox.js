import React, { Component, PropTypes } from 'react';
import cx from 'classnames';
import styles from './styles.module.scss';

export default class StatusBox extends Component {
  static propTypes = {
    status: PropTypes.string.isRequired,
    type: PropTypes.string
  };

  render() {
    let statusStyle;
    switch (this.props.type) {
      case 'warning':
        statusStyle = styles.warning;
        break;
      case 'alert':
        statusStyle = styles.alert;
        break;
      default:
        return;
    }

    return ( // eslint-disable-line consistent-return
      <div style={{ paddingTop: '5px' }} className='mr-0' >
        <div className={cx('row m-0', styles.root, statusStyle)}>
          <div className={cx('col m1 p-0', styles.marginTop, styles.statusIcon)} style={{ textAlign: 'center' }}>
            <i className='mdi mdi-account-alert' />
          </div>

          <div className={cx('col m11 p-0', styles.marginTop)}>
            {this.props.status}
          </div>
        </div>
      </div>
    );
  }
}
