import React from 'react';
import Relay from 'react-relay';
import '../../../../node_modules/react-select/scss/default.scss';
import '../Proposal.scss';
import { Card } from '../../Utils/components';
import { STYLE_DATA, STYLE_DATA_TITLE, STYLE_TITLE, STYLE_BUTTON_DATA } from '../Constants';

export default class SideNav extends React.Component {
  static propTypes = {
    width: React.PropTypes.string,
    isSideNavOpen: React.PropTypes.bool,
    changeSideNavState: React.PropTypes.func,
    titleInCloseState: React.PropTypes.node,
    children: React.PropTypes.node
  }

  render() {
    const { proposal, titleInCloseState, width, isSideNavOpen, changeSideNavState, children } = this.props;
    return isSideNavOpen ? (
      <div className='side-nav' style={{ width, minWidth: '300px' }}>
        { children }
      </div>) : (
        <div className='side-nav' style={{ width }}>
          <a className='mt-20 pr-17' onClick={() => changeSideNavState(true)}>
            <i className='mdi mdi-chevron-double-right small mr-5 fs-20' />
          </a>
          <div className={STYLE_DATA_TITLE} style={{ writingMode: 'vertical-lr', transform: 'rotate(180deg)', paddingRight: '10px' }}>
            {titleInCloseState}
          </div>
        </div>);
  }

}
