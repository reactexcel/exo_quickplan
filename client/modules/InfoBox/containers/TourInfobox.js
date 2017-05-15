import Relay from 'react-relay';
import TourInfobox from '../components/TourInfobox';
import BookServiceMutation from '../../ServiceBooking/mutations/BookService';

export default Relay.createContainer(TourInfobox, {
  initialVariables: {
    serviceBookingKey: null,
    cityBookingKey: null,
    hasQuery: false,
    tripKey: null,
    cityDayKey: null
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
        checkServiceBookingPaxStatus(cityDayKey: $cityDayKey, tripKey: $tripKey, serviceBookingKey: $serviceBookingKey) {
          message
          severity
        }
        serviceBooking(serviceBookingKey: $serviceBookingKey){
          id
          _key
          startSlot
          durationSlots
          status {
            tpAvailabilityStatus
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
          remarks
          cancelHours
          longDistanceOption
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
          tour {
            _key
            productId
            title
            productOptCode
            category
            sType
            guideLanguage
            images {
              url
            }
            locality {
              localityCode
              localityName
            }
            comment
            extras {
              chargeBase
              description
              isCompulsory
              sequenceNumber
            }
            description
            rank
            inclusions
            highlights
            exclusions
            introduction
            notes
            details
            isPreferred
            isPromotion
            isPreselected
            hasPromotions
            promotions {
              type
              description
            }
            accessibleTourPromotion {
              promotionStatus
              promotionsDetails
            }
            cancellationPolicy
            timeSlots {
              Morning {
                available
                pickupTime
                dropoffTime
              }
              Afternoon {
                available
                pickupTime
                dropoffTime
              }
              Evening {
                available
                pickupTime
                dropoffTime
              }
            }
            voucherName
            pax {
              maxPax
            }
            childPolicy
            styles
          }
          ${BookServiceMutation.getFragment('serviceBookings')},
        }
      }`
  }
});
