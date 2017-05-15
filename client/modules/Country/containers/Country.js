import Relay from 'react-relay';
import Country from '../components/Country';
import City from '../../City/containers/City';

export default Relay.createContainer(Country, {
  fragments: {
    country: () => Relay.QL`
      fragment on CountryBooking {
        id
        _key
        countryCode
        durationDays
        durationNights
        tpBookingRef
        cityBookings {
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
          }
          transferPlacements {
            id
            _key
            durationDays
            startDate
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
          ${City.getFragment('city')}
        }
        transferPlacements {
          id
          _key
          durationDays
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
        location {
          id
          _key,
          type,
          name,
          tpCode,
          unCode
        }
      }
    `
  }
});
