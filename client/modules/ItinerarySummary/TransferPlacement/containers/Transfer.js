import Relay from 'react-relay';
import Transfer from '../components/Transfer';

export default Relay.createContainer(Transfer, {
  fragments: {
    transfer: () => Relay.QL`
      fragment on Transfer {
        type {
          description
        }
        vehicle {
          category
          model
        }
        route {
          from {
            cityName
            localityName
            place
          }
          to {
            cityName
            localityName
            place
          }
          departureTime
          arrivalTime
        }
      }
    `,
    serviceBooking: () => Relay.QL`
      fragment on ServiceBooking {
        price {
          currency
          amount
          usdAmount
        }  
      }
    `
  }
});
