import Auth0 from 'auth0-js';
import { removeUserRole } from './user';

export default class AuthService {
  constructor(clientId, domain) {
    // Configure Auth0
    this.auth0 = new Auth0({
      clientID: clientId,
      domain,
      responseType: 'token'
    });

    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);
    this.signup = this.signup.bind(this);
    this.changePassword = this.changePassword.bind(this);
  }

  login(params, onError) {
    // redirects the call to auth0 instance
    this.auth0.login(params, onError);
  }

  signup(params, onError) {
    // redirects the call to auth0 instance
    this.auth0.signup(params, onError);
  }

  parseHash(hash) {
    // uses auth0 parseHash method to extract data from url hash
    const authResult = this.auth0.parseHash(hash);
    if (authResult && authResult.idToken) {
      this.setToken(authResult.idToken);
      this.setAccessToken(authResult.accessToken);
      this.setTokenExp(authResult.idTokenPayload.exp);
      return true;
    }

    return false;
  }

  loggedIn() {
    const currentTime = new Date().getTime();

    if (currentTime > this.getTokenExp()) {
      this.logout();
      return false;
    }
    // Checks if there is a saved token and it's still valid
    return !!this.getToken();
  }

  setToken(idToken) {
    // Saves user token to local storage
    localStorage.setItem('id_token', idToken);
  }


  setTokenExp(exp) {
    localStorage.setItem('token_exp', exp * 1000);
  }

  getToken() {
    // Retrieves the user token from local storage
    return localStorage.getItem('id_token');
  }

  getTokenExp() {
    // Retrieves the user token from local storage
    return localStorage.getItem('token_exp');
  }

  setAccessToken(accessToken) {
    // Saves user token to local storage
    localStorage.setItem('access_token', accessToken);
  }

  getAccessToken() {
    // Retrieves the user token from local storage
    return localStorage.getItem('access_token');
  }

  logout() {
    // Clear user token and profile data from local storage
    localStorage.removeItem('id_token');
    localStorage.removeItem('access_token');
    removeUserRole();
  }

  changePassword(email) {
    return new Promise((resolve, reject) => this.auth0.changePassword({
      connection: 'Username-Password-Authentication',
      email
    }, err => err ? reject(err) : resolve())); // eslint-disable-line
  }

}
