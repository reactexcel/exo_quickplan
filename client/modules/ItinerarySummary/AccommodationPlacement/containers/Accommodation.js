import Relay from 'react-relay';
import Accommodation from '../components/Accommodation';

export default Relay.createContainer(Accommodation, {
  fragments: {
    serviceBooking: () => Relay.QL`
      fragment on ServiceBooking {
        price {
          currency
          amount
          usdAmount
        }
        accommodation {
          title
        }
      }
    `,
    supplier: () => Relay.QL`
      fragment on AccessibleSuppliers {
        title
      }
    `
  }
});
