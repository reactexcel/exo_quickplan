import Relay from 'react-relay';
import TransferModal from '../components/TransferModal';

export default Relay.createContainer(TransferModal, {
  initialVariables: {
    origin: null,
    destination: null,
    dateFrom: null
  },
  fragments: {
    viewer: () => Relay.QL`
      fragment on Viewer {
        accessibleTransfers(origin: $origin, destination: $destination, dateFrom: $dateFrom) {
          id
          _key
          title
          comment
          description
          guideLanguage
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
              tpCode
              cityName
              localityName
              place
            }
            to {
              tpCode
              cityName
              localityName
              place
            }
          }
        }
        location {
          id
          _key,
          type,
          name,
          isEXODestination,
          tpCode,
          unCode,
          country
          airports {
            code
            name
          }
        }
      }
    `,
    transferPlacement: () => Relay.QL`
      fragment on TransferPlacement {
        id
        _key
        serviceBookings {
          isPlaceholder
          notes
          startSlot
          durationSlots
          placeholder {
            type
            title
            from
            to
            vehicleCategory
            vehicleModel
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
      }
    `,
    city: () => Relay.QL`
      fragment on CityBooking {
        _key
        id
        cityCode
        cityOrder
        durationDays
        durationNights
        startDay
        startDate
        location {
          id
          _key,
          type,
          name,
          tpCode,
          unCode,
          country,
          isEXODestination
        }
        transferPlacements {
          id
          _key
          fromCity {
            id
            _key,
            country,
            type,
            name,
            tpCode,
            unCode
          }
          toCity {
            id
            _key,
            country,
            type,
            name,
            tpCode,
            unCode
          }
        }
        cityDays {
          _key
          id
          startDate
          startDay
          unavailableSlots
          serviceBookings {
            id
            _key
            startSlot
            durationSlots
            status {
              tpBookingStatus
              state
            }
          }
        }
      }
    `
  }
});
