import Relay from 'react-relay';
import NewProposal from '../components/NewProposal';

export default Relay.createContainer(NewProposal, {
  initialVariables: {
  },

  fragments: {
    viewer: () => Relay.QL`
      fragment on Viewer {
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
          workInCountries{
            countryCode
            currency
            tpPW
            tpUID
          }
          TAs: users{
            _key
            firstName
            lastName
          }
        }
        locations {
          _key
          name
          isEXODestination
        }
      }`
  }
});
