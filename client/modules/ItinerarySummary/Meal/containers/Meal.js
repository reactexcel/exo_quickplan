import Relay from 'react-relay';
import Meal from '../components/Meal';

export default Relay.createContainer(Meal, {
  fragments: {
    timeSlot: () => Relay.QL`
      fragment on TimeSlot {
        slotOrder
        meal {
          type
        }  
      }
    `
  }
});
