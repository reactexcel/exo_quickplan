import Relay from 'react-relay';
import Trip from '../components/Trip';
import CountryBooking from '../../CountryBooking/containers/CountryBooking';
import InternationalTransfer from '../../InternationalTransfer/containers/InternationalTransfer';

export default Relay.createContainer(Trip, {
  initialVariables: {
    tripKey: null,
    proposalKey: null,
    userToken: null
  },

  fragments: {
    viewer: () => Relay.QL`
      fragment on Viewer {
        proposal(proposalKey: $proposalKey) {
            _key
            travelDuration
            status
            startTravelOnDate
            TA {
              _key
              firstName
              lastName
               office {
                _key
                companyName
              }
            }
            TC {
              _key
              firstName
              lastName
              office {
                _key
                officeName
              }
            }
            paxs{
                _key
                ageGroup,
                firstName,
                lastName,
                isMainPax
            }
        }
        trip(tripKey: $tripKey) {
              _key
              status
              startDate
              endDate
              paxs {
                 _key
                ageGroup
                firstName
                lastName
                gender
                dateOfBirth
                ageOnArrival
                passportNr
                passportImage
                nationality
              }
              countryOrder
              durationDays
              name
              notes
              countryBookings {
               countryCode
                ${CountryBooking.getFragment('data')}
                transferPlacement: transferPlacements {
                  fromCity {
                    country
                  }
                  toCity {
                    country
                  }
                  serviceBookings {
                    id
                  }
                  ${InternationalTransfer.getFragment('data')}
                }
              }
        }
        user(userToken: $userToken) {
          _key
          role
          firstName
          lastName
        }
      }`
  }
});
