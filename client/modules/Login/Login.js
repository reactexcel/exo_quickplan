// src/views/Main/Login/Login.js

import React, { PropTypes as T } from 'react';
import { Link } from 'react-router';
import AuthService from '../../services/auth';
import './login.scss';
import config from '../../../server/config/environment';

export default class Login extends React.Component {
  static propTypes = {
    auth: T.instanceOf(AuthService)
  };

  state = {
    changePasswordRequested: false
  };

  _doGuestLogin(){
    console.log( config.auth.callbackURL )
    console.log( location.href )
    this.props.route.auth.login({
      connection: 'Username-Password-Authentication',
      responseType: 'token',
      email: 'arun.etech2011@gmail.com',
      password: '12345',
      callbackURL: config.auth.callbackURL,
      state: location.href
    }, (err) => {
      if (err) alert(`something went wrong: ${err.message}`);
    });
  }

  componentWillMount() {
    this._doGuestLogin();
  }


  getChangePasswordLink = () => (
    <Link
      className='right'
      style={{ textDecoration: 'underline' }}
      to='/#'
      onClick={(e) => {
        e.preventDefault();
        if (!this.email.value) {
          alert('Email is not specified');
        } else {
          this.props.route.auth.changePassword(this.email.value)
            .then(() => this.setState({ changePasswordRequested: true }));
        }
      }}
    >
      Forgot password
    </Link>);


  handleSubmit(e) {
    e.preventDefault();

    this.props.route.auth.login({
      connection: 'Username-Password-Authentication',
      responseType: 'token',
      email: this.email.value,
      password: this.password.value,
      callbackURL: config.auth.callbackURL,
      state: location.href
    }, (err) => {
      if (err) alert(`something went wrong: ${err.message}`);
    });
  }

  handleGuestSubmit(e) {
    e.preventDefault();
    this._doGuestLogin();
  }

  render() {
    return (<div className='login-page center-align exo-colors modal-bgr2'>
      <div className='left-align login-box exo-colors modal-bgr1 exo-colors-text p-30'>
        <span className='fs-22'>Welcome to Exo Create!</span>
        <br />
        <span className='exo-colors-text text-label-1'>Alpha release</span>
        <br />
        <br />
        <form onSubmit={e => this.handleSubmit(e)}>
          <div>
            <input
              type='email'
              id='userEmail'
              ref={ref => (this.email = ref)}
              placeholder='User Email'
              required
            />
            <label htmlFor='userEmail'>{}</label>
          </div>
          <br />
          <div>
            <input
              type='password'
              id='userPassword'
              ref={ref => (this.password = ref)}
              placeholder='Password'
              required
            />
            <label htmlFor='userPassword'>{}</label>
          </div>
          <br />

          <input
            type='submit'
            className='right fs-16'
            value='LOGIN'
          />
          <br />
          <br />
          {
            this.state.changePasswordRequested
              ? <span className='right'>Change password request sent. Please check your email</span>
              : this.getChangePasswordLink()
          }
        </form>
        <br /><br />
        <div>
          <form onSubmit={e => this.handleGuestSubmit(e)}>
            <input
              type='submit'
              className='right fs-16'
              value='Guest Login'
            />
          </form>
        </div>

      </div>

    </div>
    );
  }
}
