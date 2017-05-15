import Relay from 'react-relay';
import Section from '../../Trip/components/Section';
import Header from './Header';
import Body from './Body';

export default Relay.createContainer(Section, {
  fragments: {
    data: () => Relay.QL`
      fragment on CountryBooking {
          ${Header.getFragment('data')}
          ${Body.getFragment('data')}
      }
    `
  }
});
