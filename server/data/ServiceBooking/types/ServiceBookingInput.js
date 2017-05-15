import { GraphQLInputObjectType, GraphQLString, GraphQLInt, GraphQLBoolean, GraphQLList } from 'graphql';
import Placeholder from '../../CityDay/types/PlaceholderInput';

const PickUpType = new GraphQLInputObjectType({
  name: 'PickUpInput',
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
  name: 'DropOffInput',
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

const PaxListObject = new GraphQLInputObjectType({
  name: 'PaxListObjectInput',
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

const RoomConfig = new GraphQLInputObjectType({
  name: 'RoomConfigInput',
  fields: () => ({
    roomType: {
      type: GraphQLString
    },
    paxList: {
      type: new GraphQLList(PaxListObject)
    }
  })
});

const Extras = new GraphQLInputObjectType({
  name: 'ServiceExtrasInput',
  fields: () => ({
    quantity: {
      type: GraphQLInt
    }
  })
});

const Status = new GraphQLInputObjectType({
  name: 'ServiceBookingStatus',
  fields: () => ({
    tpBookingStatus: {
      type: GraphQLString
    },
    state: {
      type: GraphQLString
    },
    tpAvailabilityStatus: {
      type: GraphQLString
    }
  })
});

const Price = new GraphQLInputObjectType({
  name: 'ServiceBookingPrice',
  fields: () => ({
    currency: {
      type: GraphQLString
    },
    amount: {
      type: GraphQLInt
    }
  })
});

const RouteType = new GraphQLInputObjectType({
  name: 'TransferRouteInput',
  fields: () => ({
    from: {
      type: GraphQLString
    },
    to: {
      type: GraphQLString
    },
    departureTime: {
      type: GraphQLString
    },
    arrivalTime: {
      type: GraphQLString
    },
    refNo: {
      type: GraphQLString
    },
    withGuide: {
      type: GraphQLString
    }
  })
});

export default new GraphQLInputObjectType({
  name: 'ServiceBookingInput',
  description: 'The service booking object in Quickplan',
  fields: () => ({
    dateFrom: {
      type: GraphQLString
    },
    dateTo: {
      type: GraphQLString
    },
    cancelHours: {
      type: GraphQLInt
    },
    numberOfNights: {
      type: GraphQLInt
    },
    startDay: {
      type: GraphQLInt
    },
    startSlot: {
      type: GraphQLInt
    },
    durationSlots: {
      type: GraphQLInt
    },
    pickUp: {
      type: PickUpType
    },
    dropOff: {
      type: DropOffType
    },
    longDistanceOption: {
      type: GraphQLBoolean
    },
    isEarlyCheckin: {
      type: GraphQLBoolean
    },
    isLateCheckout: {
      type: GraphQLBoolean
    },
    comment: {
      type: GraphQLString
    },
    remarks: {
      type: GraphQLString
    },
    notes: {
      type: GraphQLString
    },
    roomConfigs: {
      type: new GraphQLList(RoomConfig)
    },
    extras: {
      type: new GraphQLList(Extras)
    },
    placeholder: {
      type: Placeholder
    },
    status: {
      type: Status
    },
    price: {
      type: Price
    },
    route: {
      type: RouteType
    },
    transferKey: {
      type: GraphQLString,
      description: 'Transfer key for matching key when updating (UpdateTransferPlacement)'
    },
    isPlaceholder: {
      type: GraphQLBoolean
    },
    afterHoursTransferOption: {
      type: GraphQLString
    }
  })
});
