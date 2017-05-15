import Relay from 'react-relay';
import SupplierPaxStatus from '../components/SupplierPaxStatus';

export default Relay.createContainer(SupplierPaxStatus, {
  initialVariables: {
    cityBookingKey: null,
    tripKey: null,
    roomConfigKey: null
  },
  fragments: {
    viewer: () => Relay.QL`
      fragment on Viewer {
        checkSupplierPaxStatus(cityBookingKey: $cityBookingKey, tripKey: $tripKey, roomConfigKey: $roomConfigKey) {
          message
          severity
        }
      }
    `
  }
});
