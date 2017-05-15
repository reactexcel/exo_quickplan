import Relay from 'react-relay';
import CityDay from '../components/CityDay';
import Tour from '../../Tour/containers/Tour';
import Placeholder from '../../Tour/containers/Placeholder';
import Transfer from '../../TransferPlacement/containers/Transfer';
import Note from './Note';
import Meal from '../../Meal/containers/Meal';


export default Relay.createContainer(CityDay, {
  fragments: {
    cityDay: () => Relay.QL`
      fragment on CityDay {
        startDay
        startDate
        ${Note.getFragment('cityDay')}
        serviceBookings {
          tour {
            ${Tour.getFragment('tour')}
          }
          price {
            currency
            amount
            usdAmount
          }
          ${Tour.getFragment('serviceBooking')}
          ${Placeholder.getFragment('serviceBooking')}
          ${Transfer.getFragment('serviceBooking')}
          placeholder {
            ${Placeholder.getFragment('tour')}
          }
          transfer: localtransfer {
            ${Transfer.getFragment('transfer')}
          }
        }
        timeSlots {
          slotOrder
          ${Meal.getFragment('timeSlot')}
        }
      }
    `
  }
});
