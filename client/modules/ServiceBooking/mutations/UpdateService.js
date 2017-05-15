import Relay from 'react-relay';

export default class UpdateService extends Relay.Mutation {
  getMutation() {
    return Relay.QL`mutation{updateServiceBooking}`;
  }

  getVariables() {
    return {
      serviceBookingKey: this.props.serviceBookingKey,
      patchData: this.props.patchData
    };
  }

  getFatQuery() {
    return Relay.QL`
      fragment on UpdateServiceBookingPayload {
        servicebooking {
          cancelHours
          comment
          dateFrom
          dateTo
          dropOff
          durationSlots
          isEarlyCheckin
          isLateCheckout
          longDistanceOption
          notes
          pickUp
          price
          remarks
          roomConfigs
          startDay
          startSlot
          status
        }
      }
    `;
  }

  getConfigs() {
    return [{
      type: 'FIELDS_CHANGE',
      fieldIDs: {
        servicebooking: this.props.serviceBookingId
      }
    }];
  }
}
