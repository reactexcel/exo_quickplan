import Relay from 'react-relay';
import PlaceholderInfobox from '../components/PlaceholderInfobox';

export default Relay.createContainer(PlaceholderInfobox, {
  initialVariables: {
    country: null,
    productId: null,
    serviceBookingKey: null,
    date: null,
    nrOfAdults: null,
    nrOfChildren: null,
    nrOfInfants: null,
    cityBookingKey: null,
    hasQuery: false
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
          }
        }
        serviceBooking(serviceBookingKey: $serviceBookingKey){
          id
          _key
          startSlot
          durationSlots
          status {
            tpBookingStatus
            state
          }
          placeholder {
            title
            type
          }
          pickUp {
            time
            location
            remarks
          }
          dropOff {
            time
            location
            remarks
          }
          price {
            amount
          }
          notes
          cancelHours
          longDistanceOption
          paxs {
            id
            _key
            firstName
            lastName
          }
        }
      }`
  }
});
