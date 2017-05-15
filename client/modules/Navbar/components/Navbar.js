import React from 'react';
import { Link } from 'react-router';
import logo from '../../../assets/logo-gray.png';
import { Dropdown } from '../../Utils/components';

const NavBar = ({ user: { firstName, lastName }, auth, openNewProposalModal }) => {
  const userDropdown = <a><span className='white-text fw-500 fs-15'>{firstName} {lastName}</span><i className='mdi-navigation-arrow-drop-down small right' /></a>;

  // <li><Link to='/proposals' className='white-text fw-500 fs-15' onClick={e => e.preventDefault()}>PROPOSALS</Link></li>
  return (
    <nav className='navbar-top exo-colors lighten-1'>
      <div className='nav-wrapper'>
        <Link to='/' className='brand-logo pt-0 fw-500 fs-20' style={{ color: '#eee' }}>
          <img src={logo} alt='logo' style={{ height: '30px', paddingBottom: '2px', paddingRight: '8px', verticalAlign: 'middle' }} />
          <span>Create</span>
        </Link>
        <ul>
          <li><Link to='/workqueue' className='white-text fw-500 fs-15'>Workqueue</Link></li>
          <li><Link to='#' onClick={(e) => { e.preventDefault(); openNewProposalModal(); }}><span className='white-text fw-500 fs-15'><i className='mdi-content-add left mr-5' />New Proposal</span></Link></li>
          <li>
            <Dropdown className='dropdown' triggerButton={userDropdown}>
              <li><Link to='/profile' onClick={e => e.preventDefault()}>Profile</Link></li>
              <li><Link
                to='/login'
                onClick={() => auth.logout()}
              >Logout</Link></li>
            </Dropdown>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default NavBar;
