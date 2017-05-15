import Relay from 'react-relay';
import App from '../components/App';

export default Relay.createContainer(App, {
  initialVariables: {
    userToken: null
  },

  fragments: {
    viewer: variables => Relay.QL`
        fragment on Viewer {
          user (userToken: $userToken) {
            _key
            firstName
            lastName
            role
            isSupervisor
          }  
        }`
  }
});
