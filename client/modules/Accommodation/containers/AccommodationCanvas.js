import Relay from 'react-relay';
import AccommodationCanvas from '../components/AccommodationCanvas';

export default Relay.createContainer(AccommodationCanvas, {
  fragments: {
    accommodationPlacements: () => Relay.QL `
      fragment on AccommodationPlacement @relay(plural: true) {
        _key
        startDay
        startDate
        durationNights
        preselectionNum
        images {
          url
        }
        serviceBookings {
          _key,
          id
          productId,
          notes,
          inactive
          isEarlyCheckin
          isLateCheckout
          placeholder {
            title
          }
          accommodation {
            id
            _key,
            title
            supplier {
              supplierName
            }
            isPreferred
            isPreselected
            hasPromotions
          }
          rate {
            name
            description
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
            }
          }
          price{
            currency
            amount
          }
          status {
            tpAvailabilityStatus
            tpBookingStatus
            state
          }
        }
        supplier {
          id,
          _key
          address {
            city
            coordinates {
              latitude
              longitude
            }
            country
            postCode
            streetAddress
          }
          cancellationPolicy
          childPolicy
          description
          email
          images {
            url
          }
          fax
          title
          phone
          supplierCode
          supplierId
          web
        }
      }
    `
  }
});
