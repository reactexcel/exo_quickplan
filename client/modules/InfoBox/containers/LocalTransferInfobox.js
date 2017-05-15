import Relay from 'react-relay';
import LocalTransferInfobox from '../components/LocalTransferInfobox';
// import Day from '../../City/containers/Day';

export default Relay.createContainer(LocalTransferInfobox, {
  initialVariables: {
    cityBookingKey: null
  },
  fragments: {
    viewer: () => Relay.QL`
      fragment on  Viewer {
        cityBooking(cityBookingKey: $cityBookingKey){
          id
          cityDays {
            _key
            id
            startDay
            startDate
            serviceBookings {
              id
              _key
              startSlot
              durationSlots
              notes
              status {
                tpBookingStatus
                state
                tpAvailabilityStatus
              }
              placeholder {
                title
                type
              }
              price {
                amount
                currency
              }
              route{
                refNo
                withGuide
                from
                to
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
              paxStatuses{
                severity
                message
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
              localtransfer {
                _key
                description
                type {
                  description
                }
                class {
                  description
                }
                vehicle {
                  category
                  model
                  maxPax
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
              extras {
                quantity
              }
            }
          }
        }
      }`
  }
});
