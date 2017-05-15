import Relay from 'react-relay';
import AccommodationPlacement from '../components/AccommodationPlacement';
import Accommodation from './Accommodation';

export default Relay.createContainer(AccommodationPlacement, {
  fragments: {
    accommodationPlacement: () => Relay.QL`
      fragment on AccommodationPlacement {
        supplier {
          title
          images {
            url
          }
          description
          ${Accommodation.getFragment('supplier')}
        }
        serviceBookings {
           price {
            currency
            amount
            usdAmount
           }
          ${Accommodation.getFragment('serviceBooking')}
        }
      }
    `
  }
});
