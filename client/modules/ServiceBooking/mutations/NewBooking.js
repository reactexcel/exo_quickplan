import Relay from 'react-relay';

class NewBookingMutation extends Relay.Mutation {

  props = {
    bookingRef: this.props.bookingRef
  };


  getMutation() {
    return Relay.QL`
          mutation { addBooking }
      `;
  }

  getVariables() {
    return this.props;
  }

  getFatQuery() {
    return Relay.QL`
          fragment on AddBookingPayload {
              bookingRef
          }`;
  }

  getConfigs() {
    return [{
      type: 'FIELDS_CHANGE',
      fieldIDs: this.props
    }];
  }

}

export default NewBookingMutation;
