import Relay from 'react-relay';
import Day from '../components/Day';
import BookServiceMutation from '../../ServiceBooking/mutations/BookService';

export default Relay.createContainer(Day, {
  fragments: {
    day: () => Relay.QL`
      fragment on CityDay {
        _key
        id
        startDate
        startDay
        unavailableSlots
        timeSlots {
          slotOrder
          isDisabled
          meal {
            type
            note
          }
        }
        preselections {
          startSlot
          tourId
        }
        serviceBookings {
          id
          _key
          paxs
          paxStatuses{
            severity
            message
          }
          startSlot
          durationSlots
          notes
          inactive
          status {
            tpAvailabilityStatus
            tpBookingStatus
            state
          }
          placeholder {
            title
            type
          }
          price {
            amount
          }
          roomConfigs {
            _key
            id
            roomType
            paxs {
              id
              _key
              firstName
              lastName
              paxError {
                severity
                message
                errorType
              }
            }
          }
          serviceBookingType
          localtransfer {
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
          tour {
            _key
            title
            description
            inclusions
            highlights
            exclusions
            introduction
            notes
            details
            images {
              url
            }
            isPreferred
            isPromotion
            isPreselected
          }
          ${BookServiceMutation.getFragment('serviceBookings')},

        }
      }
    `,
  }
});
