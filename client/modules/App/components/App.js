import React, { PropTypes, Component } from 'react';
import MDSpinner from 'react-md-spinner';
import { compact } from 'lodash';
import Navbar from '../../Navbar/components/Navbar';
import NewProposal from '../../Proposal/renderers/NewProposalModalRenderer';
import './../App.scss';
import { setUserRole } from '../../../services/user';

export default class App extends Component {
  static propTypes = {
    children: PropTypes.object.isRequired
  };
  state = {
    isNewProposalModalOpened: false
  }

  isLoginPage = () => this.props.location.pathname === '/login';

  isSummaryPage = () => !!this.props.location.pathname.match('/itinerary_summary');

  componentWillMount() {
    if (this.props.viewer.user) {
      setUserRole(this.props.viewer.user.role);
    }
  }
  componentDidMount() {
    $('body').addClass('test');
  }

  render() {
    let children = null;

    if (this.props.children) {
      children = React.cloneElement(this.props.children, { auth: this.props.route.auth });
    }

    const appClassName = compact([
      'app',
      this.isSummaryPage() ? 'grey lighten-3' : ''
    ]).join(' ');

    return this.isLoginPage()
      ? <div>{children}</div>
      : <div className='wrapper'>
        {this.props.location.pathname !== '/login' &&
          <Navbar user={this.props.viewer.user} auth={this.props.route.auth} openNewProposalModal={() => this.setState({ isNewProposalModalOpened: true })} />}
        <div className={appClassName}>
          {children}
          {this.state.isNewProposalModalOpened ? <NewProposal auth={this.props.route.auth} isModalOpened={this.state.isNewProposalModalOpened} changeModalState={isOpen => this.setState({ isNewProposalModalOpened: isOpen })} /> : null}
        </div>
        <div id='loading'><MDSpinner size={80} />
        </div>
      </div>
    ;
  }
}
