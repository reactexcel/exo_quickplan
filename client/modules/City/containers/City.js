import Relay from 'react-relay';
import City from '../components/City';
import Day from './Day';
import Accommodation from '../../Accommodation/containers/AccommodationCanvas';

export default Relay.createContainer(City, {
  fragments: {
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
        cityDays {
          _key
          id
          startDate
          startDay
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
          ${Day.getFragment('day')}
          serviceBookings {
            id
            _key
            paxs
            roomConfigs{
              paxs{
                _key
                firstName
                paxError{
                  severity
                  message
                  errorType
                }
              }
            }
            paxStatuses{
              severity
              message
            }
            startSlot
            durationSlots
            status {
              tpBookingStatus
              state
            }
            notes
            inactive
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
          }
        }
        accommodationPlacements {
          ${Accommodation.getFragment('accommodationPlacements')}
          _key
          startDate
          durationNights
          startDay
          serviceBookings {
            id
            _key
            paxs
            roomConfigs{
              paxs{
                _key
                firstName
                paxError{
                  severity
                  message
                  errorType
                }
              }
            }
            paxStatuses{
              severity
              message
            }
            startDay
            numberOfNights
            durationSlots
            status {
              tpAvailabilityStatus
              tpBookingStatus
              state
            }
          }
        }
        transferPlacements {
          id
          _key
          durationDays
          startDate
          startDay
          serviceBookings {
            _key
            paxs
            paxStatuses{
              severity
              message
            }
            price {
              amount
              currency
            }
            route {
              arrivalTime
              departureTime
              from
              refNo
              to
              withGuide
            }
            pickUp {
              location
              remarks
              time
            }
            dropOff {
              location
              remarks
              time
            }
            startSlot
            durationSlots
            status {
              tpAvailabilityStatus
              tpBookingStatus
              state
            }
            notes
            longDistanceOption
            afterHoursTransferOption
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
            transfer {
              _key
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
              title
              description
              comment
              vehicle {
                model
                maxPax
              }
              type {
                description
              }
              supplier {
                cancellationPolicy
                childPolicy
              }
            }
            placeholder {
              type
              title
              from
              to
              vehicleCategory
              vehicleModel
            }
            extras {
              quantity
            }
          }
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
        },
        location {
          id
          _key,
          type,
          name,
          tpCode,
          unCode
        }
        defaultTours
      }`
  }
});
