import Relay from 'react-relay';
import Transfer from '../components/Transfer';

export default Relay.createContainer(Transfer, {
  fragments: {
    transfer: () => Relay.QL`
      fragment on TransferPlacement {
        id
        _key
        startDate,
        serviceBookings {
          _key
          isPlaceholder
          placeholder {
            type
            title
            vehicleCategory
            vehicleModel
          }
          route {
            from
            to
          }
          status {
            tpAvailabilityStatus
            tpBookingStatus
            state
          }
          transfer {
            _key
            type {
              description
            }
            class {
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
            }
          }
        }
        transferStatus {
          severity
          message
        }
        durationDays
      }
    `
  }
});
