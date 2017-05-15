import { GraphQLString, GraphQLID, GraphQLInt, GraphQLInputObjectType, GraphQLBoolean, GraphQLList } from 'graphql';
import { mutationWithClientMutationId } from 'graphql-relay';
import * as servicebookingCtrl from './../controllers/ServiceBooking';
import ServiceBookingType from './../types/ServiceBooking';

const PriceType = new GraphQLInputObjectType({
  name: 'PriceType',
  fields: () => ({
    currency: {
      type: GraphQLString
    },
    amount: {
      type: GraphQLInt
    }
  })
});
const RateType = new GraphQLInputObjectType({
  name: 'RateType',
  fields: () => ({
    id: {
      type: GraphQLString
    },
    name: {
      type: GraphQLString
    },
    description: {
      type: GraphQLString
    }
  })
});
const PickUpType = new GraphQLInputObjectType({
  name: 'PickUpType',
  fields: () => ({
    time: {
      type: GraphQLString
    },
    location: {
      type: GraphQLString
    },
    remarks: {
      type: GraphQLString
    }
  })
});
const DropOffType = new GraphQLInputObjectType({
  name: 'DropOffType',
  fields: () => ({
    time: {
      type: GraphQLString
    },
    location: {
      type: GraphQLString
    },
    remarks: {
      type: GraphQLString
    }
  })
});
const CheckInCheckOutType = new GraphQLInputObjectType({
  name: 'CheckInCheckOutType',
  fields: () => ({
    requested: {
      type: GraphQLBoolean
    },
    comments: {
      type: GraphQLString
    }
  })
});
const PaxListObjectType = new GraphQLInputObjectType({
  name: 'PaxListObjectType',
  fields: () => ({
    tpPaxId: {
      type: GraphQLInt
    },
    paxID: {
      type: GraphQLInt
    },
    ageGroup: {
      type: GraphQLString
    }
  })
});
const RoomConfigType = new GraphQLInputObjectType({
  name: 'RoomConfigType',
  fields: () => ({
    roomType: {
      type: GraphQLString
    },
    paxList: {
      type: new GraphQLList(PaxListObjectType)
    }
  })
});
const ExtrasType = new GraphQLInputObjectType({
  name: 'ExtrasType',
  fields: () => ({
    sequenceNumber: {
      type: GraphQLInt
    },
    quantity: {
      type: GraphQLInt
    }
  })
});
const props = {
  tourKey: { type: GraphQLID },
  productId: { type: GraphQLString },
  serviceSequenceNumber: { type: GraphQLInt },
  serviceLineId: { type: GraphQLInt },
  availabilityStatus: { type: GraphQLString },
  bookingStatus: { type: GraphQLString },
  _key: { type: GraphQLString },
  price: { type: PriceType },
  rate: { type: RateType },
  dateFrom: { type: GraphQLString },
  dateTo: { type: GraphQLString },
  numberOfNights: { type: GraphQLInt },
  startDay: { type: GraphQLInt },
  startSlot: { type: GraphQLInt },
  durationSlots: { type: GraphQLInt },
  cancelHours: { type: GraphQLInt },
  pickUp: { type: PickUpType },
  dropOff: { type: DropOffType },
  earlyCheckin: { type: CheckInCheckOutType },
  lateCheckout: { type: CheckInCheckOutType },
  comment: { type: GraphQLString },
  remarks: { type: GraphQLString },
  notes: { type: GraphQLString },
  roomConfigs: { type: new GraphQLList(RoomConfigType) },
  bookedExtras: { type: new GraphQLList(ExtrasType) }
};

export default mutationWithClientMutationId({
  name: 'AddServiceBooking',
  inputFields: {
    ...props
  },
  outputFields: {
    servicebooking: {
      type: ServiceBookingType,
      resolve: saveDoc => saveDoc
    }
  },
  mutateAndGetPayload: async (inputFields) => {
    const saveDoc = await servicebookingCtrl.addServiceBooking(inputFields);
    return saveDoc;
  }
});
