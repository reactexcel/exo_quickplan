import Relay from 'react-relay';
import TAAccommodationModal from '../components/TAAccommodationModal';

export default Relay.createContainer(TAAccommodationModal, {
  initialVariables: {
    countryName: null,
    cityCode: null,
    date: null,
    duration: null,
    accommodationPlacementKey: null,
    useRemoteDataOnly: false // this will be true by default
  },
  fragments: {
    viewer: () => Relay.QL`
      fragment on Viewer {
        accessibleSuppliers(country: $countryName, city: $cityCode, date: $date, duration: $duration, accommodationPlacementKey: $accommodationPlacementKey, useRemoteDataOnly: $useRemoteDataOnly) {
          id,
          _key
          currency
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
          accommodations {
            id
            _key
            category
            class {
              code
              description
            }
            isPreferred
            isPromotion
            isPreselected
            hasPromotions
            promotions {
              description
            }
            rate {
              name
              description
              doubleRoomRate
            }
            locality {
              localityCode
              localityName
            }
            pax {
              adults {
                ageFrom
                ageTo
                allowed
              }
              children {
                ageFrom
                ageTo
                allowed
              }
              infants {
                ageFrom
                ageTo
                allowed
              }
            }
            productOptCode
            sType
            stayLimits {
              maxStay
              minStay
            }
            supplier {
              supplierId
              supplierName
            }
            supplierId
            title
            voucherName
          }
        }
      }
    `
  }
});
