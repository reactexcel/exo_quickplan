import Relay from 'react-relay';
import Header from '../components/Header';
import Budget from '../../Budget/containers/Budget';

export default Relay.createContainer(Header, {
  fragments: {
    data: () => Relay.QL`
      fragment on CountryBooking {
          countryCode
          cityBookings {
            accommodationPlacements {
              serviceBookings {
                price {
                 ${Budget.getFragment('hotels')}
                }
              }
            }
            transferPlacements {
              serviceBookings {
                price {
                 ${Budget.getFragment('transfers')}
                }
              }
            }
            cityDays {
              serviceBookings {
               transfer: localtransfer {
                  _key
                }
                tour {
                  _key
                }
                placeholder {
                  title
                }
                price {
                 ${Budget.getFragment('tours')}
                 ${Budget.getFragment('localTransfers')}
                 ${Budget.getFragment('placeholders')}
                }
              }
            }
          }
      }
    `
  }
});
