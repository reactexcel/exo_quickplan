import Relay from 'react-relay';
import TransferPlacement from '../components/TransferPlacement';
import Transfer from './Transfer';

export default Relay.createContainer(TransferPlacement, {
  fragments: {
    transferPlacement: () => Relay.QL`
      fragment on TransferPlacement {
        id
        _key
        fromCity {
          name
          country
        }
        toCity {
          name
          country
        }
        toCity
        startDate,
        serviceBookings {
         price {
          currency
          amount
          usdAmount
         }  
         ${Transfer.getFragment('serviceBooking')}
          transfer {
            ${Transfer.getFragment('transfer')}
          }
        }
      }
    `
  }
});
