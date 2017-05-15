import Relay from 'react-relay';
import TourModal from '../components/TourModal';

export default Relay.createContainer(TourModal, {
  initialVariables: {
    countryName: null,
    cityCode: null,
    cityDayKey: null,
    date: null,
    officeKey: null
  },
  fragments: {
    viewer: () => Relay.QL`
      fragment on Viewer {
        accessibleTours(country: $countryName, city: $cityCode, cityDayKey: $cityDayKey, date: $date, officeKey: $officeKey) {
          id
          _key
          productId
          title
          productOptCode
          durationSlots
          category
          sType
          notes
          details
          startSlot
          exclusions
          highlights
          inclusions
          introduction
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
          voucherName
          pax {
            maxPax
          }
          childPolicy
          styles
          isAgentSpecific
        }
      }
    `
  }
});
