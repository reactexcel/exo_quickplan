import Relay from 'react-relay';
import ServiceBookingPaxStatus from '../components/ServiceBookingPaxStatus';

export default Relay.createContainer(ServiceBookingPaxStatus, {
  initialVariables: {
    cityDayKey: null,
    tripKey: null,
    serviceBookingKey: null
  },
  fragments: {
    viewer: () => Relay.QL`
      fragment on Viewer {
        checkServiceBookingPaxStatus(cityDayKey: $cityDayKey, tripKey: $tripKey, serviceBookingKey: $serviceBookingKey) {
          message
          severity
        }
      }
    `
  }
});
