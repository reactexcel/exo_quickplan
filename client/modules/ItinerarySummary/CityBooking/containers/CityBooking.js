import Relay from 'react-relay';
import CityBooking from '../components/CityBooking';
import CityDay from '../containers/CityDay';
import TransferPlacement from '../../TransferPlacement/containers/TransferPlacement';
import AccommodationPlacement from '../../AccommodationPlacement/containers/AccommodationPlacement';

export default Relay.createContainer(CityBooking, {
  fragments: {
    cityBooking: () => Relay.QL`
      fragment on CityBooking {
        cityCode
        cityDays {
          startDay
          ${CityDay.getFragment('cityDay')}
        }
        transferPlacement: transferPlacements {
          ${TransferPlacement.getFragment('transferPlacement')}
        }
        accommodationPlacements {
          startDay
          durationNights
          ${AccommodationPlacement.getFragment('accommodationPlacement')}
        }
      }
    `,
    countryBooking: () => Relay.QL`
      fragment on CountryBooking {
        countryCode
      }
    `
  }
});
