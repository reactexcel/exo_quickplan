import Relay from 'react-relay';
import AccommodationInfobox from '../components/AccommodationInfobox';

export default Relay.createContainer(AccommodationInfobox, {
  initialVariables: {
    accommodationPlacementKey: null
  },
  fragments: {
    viewer: () => Relay.QL`
      fragment on  Viewer {
        accommodationPlacement(accommodationPlacementKey: $accommodationPlacementKey) {
          _key
          startDay
          startDate
          durationNights
          images {
            url
          }
          serviceBookings {
            _key,
            id
            productId,
            notes,
            inactive,
            isEarlyCheckin
            isLateCheckout
            paxStatuses{
              severity
              message
            }
            status {
              tpBookingStatus
              state
              tpAvailabilityStatus
            }
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
                paxError {
                  severity
                  message
                  errorType
                }
              }
            }
            price{
              currency
              amount
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
      }`
  }
});
