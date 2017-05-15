import React, { Component, PropTypes } from 'react';
import Relay from 'react-relay';
import PubSub from 'pubsub-js';
import cx from 'classnames';
import _ from 'lodash';

import CountryCityTreeView from '../../CountryCityTree/renderers/CountryCityTreeRender';
import styles from '../style.module.scss';
import { Modal, Card, Tabs, Tab, Select } from '../../Utils/components';
import { getUserRole } from '../../../services/user';

export default class TripInfobox extends Component {
  static propTypes = {
    tripKey: PropTypes.string
  }
  state = {
    userRole: getUserRole()
  };

  render() {
    // const windowHeight = $(window).height() * 0.82;

    return (
      <div className='detail' id='detail' style={{ /* height: `${windowHeight}px`, */ marginTop: '20px', overflowY: 'auto', overflowX: 'hidden', marginRight: '20px' }}>
        <div style={{ height: '200px' }} />
        { this.state.userRole === 'TA' ? (
          <Tabs>
            <Tab title='SUMMARY' active />
            <Tab title='TEAM' />
          </Tabs>
          ) : (
            <Tabs>
              <Tab title='ORDER' active ><CountryCityTreeView tripKey={this.props.tripKey} relay={this.props.relay} /></Tab>
              <Tab title='SUMMARY' />
              <Tab title='TEAM' />
            </Tabs>
         )}
      </div>
    );
  }
}
