import Relay from 'react-relay';
import Tour from '../components/Tour';

export default Relay.createContainer(Tour, {
  fragments: {
    tour: () => Relay.QL`
      fragment on Tour {
        title
        description
        images {
          url
        }
      }
    `,
    serviceBooking: () => Relay.QL`
      fragment on ServiceBooking {
        period
        price {
          currency
          amount
          usdAmount
        }
      }
    `
  }
});
