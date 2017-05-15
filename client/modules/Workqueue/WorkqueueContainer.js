import Relay from 'react-relay';
import WorkQueue from './Workqueue';

export default Relay.createContainer(WorkQueue, {
  initialVariables: {
    userToken: null
  },

  fragments: {
    viewer: () => Relay.QL`
      fragment on Viewer {
        user (userToken: $userToken) {
          _key
          role
          proposals {
           _key
            travelDuration
            status
            startTravelOnDate
            startTravelIn {
              _key
              name
            }
            private
            updatedOn
            mainPax {
              firstName
              lastName
            }
            tripsCount
            TC {
              _key
              firstName
              lastName
              office {
                _key
                officeName
              }
            }
            TA {
              firstName
              lastName
              office {
               _key
                companyName
              }
            }
            bookedTrip {
              combinerCountryBooking {
                tpBookingRef
              }
            }
          }
          supervisingTCs {
            _key
            firstName
            lastName
            office {
              _key
              officeName
            }
          }
        }
        offices (type: "EXO"){
            _key
            officeName
            TCs: users {
              _key
              firstName
              lastName
            }
        }
        
        locations {
          _key
          name
        }
      }`
  }
});
