import Relay from 'react-relay';
import Budget from '../components/Budget';

export default Relay.createContainer(Budget, {
  fragments: {
    hotels: () => Relay.QL`
      fragment on ServicePrice @relay(plural: true) {
         currency
         amount
         usdAmount
      }
    `,

    localTransfers: () => Relay.QL`
      fragment on ServicePrice @relay(plural: true) {
         currency
         amount
         usdAmount
      }
    `,

    transfers: () => Relay.QL`
      fragment on ServicePrice @relay(plural: true) {
         currency
         amount
         usdAmount
      }
    `,

    tours: () => Relay.QL`
      fragment on ServicePrice @relay(plural: true) {
         currency
         amount
         usdAmount
      }
    `,

    placeholders: () => Relay.QL`
      fragment on ServicePrice @relay(plural: true) {
         currency
         amount
         usdAmount
      }
    `
  }
});
