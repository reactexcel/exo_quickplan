import { AuthenticationClient } from 'auth0';
import config from '../config/environment';

export default new AuthenticationClient(config.auth);
