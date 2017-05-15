import Relay from 'react-relay';
import TransferInfobox from '../components/TransferInfobox';

export default Relay.createContainer(TransferInfobox, {
  initialVariables: {
    transferPlacementId: null,
    country: null,
    productIds: null,
    serviceBookingKeys: null,
    date: null,
    nrOfAdults: null,
    nrOfChildren: null,
    nrOfInfants: null,
    cityBookingKey: null,
    hasQuery: false
  },
  fragments: {
    viewer: () => Relay.QL`
      fragment on TransferPlacement {
        startDate
        durationDays
        id
        _key
        serviceBookings {
          _key
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
      }`,
    availability: () => Relay.QL`
      fragment on Viewer {
        transferAvailability(transferPlacementId : $transferPlacementId, country: $country, productIds: $productIds, serviceBookingKeys: $serviceBookingKeys ,date: $date, nrOfAdults: $nrOfAdults, nrOfChildren: $nrOfChildren, nrOfInfants: $nrOfInfants) @include(if: $hasQuery) {
          productId
          productOptCode
          availability
          currency
          totalPrice
          commisionPersent
          agentPrice
          rateId
          rateName
          rateText
          cancelHours
          dateFrom
          dateTo
          hasPromotions
        }
      }
    `
  }
});
