import Relay from 'react-relay';
import Proposal from '../components/Proposal';

export default Relay.createContainer(Proposal, {
  initialVariables: {
    proposalKey: null
  },

  fragments: {
    viewer: () => Relay.QL`
      fragment on Viewer {
        proposal(proposalKey: $proposalKey){
          id
          _key
          name
          private
          startTravelInCity
          startTravelIn {
            _key
            name
          }
          startTravelOnDate
          travelDuration
          notes
          class
          style
          createOnDate
          status
          TC {
            _key
            office {
              _key
              officeName
            }
            firstName
            lastName
            created
          },
          TA {
            _key
            office {
              _key
              companyName
            }
            firstName
            lastName
            created
          }
          paxs {
            id
            _key
            isMainPax,
            firstName,
            lastName,
            gender,
            dateOfBirth,
            ageOnArrival,
            ageGroup,
            language,
            passportNr,
            nationality,
            passportExpiresOn,
            diet,
            allergies
          },
          trips {
            _key,
            status,
            startDate,
            endDate,
            durationDays,
            traveller{
              adults,
              infants
              children
            },
            budget {
              total {
                planned,
                actual
              },
              tours {
                planned
                actual
              },
              hotels {
                planned
                actual
              },
              transfers {
                planned
                actual
              }
            },
            itinerary{
              country,
              cities
            }
          }
        },
        offices(type: "EXO") {
          _key
          officeName
          TCs: users {
            _key
            firstName
            lastName
          }
        }
        taOffices: offices(type: "TA") {
          _key
          companyName
          TAs: users {
            _key
            firstName
            lastName
          }
        }
        locations {
          _key
          name
          isEXODestination
          type
          country
        }
      }`
  }
});
