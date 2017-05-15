import Relay from 'react-relay';
import Header from '../components/Header';
import Budget from '../../Budget/containers/Budget';

export default Relay.createContainer(Header, {
  fragments: {
    data: () => Relay.QL`
      fragment on TransferPlacement {
        fromCity {
          name
          country
        }
        toCity {
          name
          country
        }
        serviceBookings {
          price {
            ${Budget.getFragment('transfers')}
          }
        }
      }
    `
  }
});
