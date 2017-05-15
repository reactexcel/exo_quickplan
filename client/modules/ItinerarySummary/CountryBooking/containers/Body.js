import Relay from 'react-relay';
import Body from '../components/Body';
import CityBooking from '../../CityBooking/containers/CityBooking';

export default Relay.createContainer(Body, {
  fragments: {
    data: () => Relay.QL`
      fragment on CountryBooking {
          countryCode
          ${CityBooking.getFragment('countryBooking')}
          cityBookings {  
            ${CityBooking.getFragment('cityBooking')}
          }
      }
    `
  }
});
