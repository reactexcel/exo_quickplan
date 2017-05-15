import {
  GraphQLObjectType, GraphQLString, GraphQLInt, GraphQLBoolean, GraphQLList,
  GraphQLFloat
} from 'graphql';
import { globalIdField } from 'graphql-relay';
import { random } from 'lodash';
import { nodeInterface } from '../../interface';
import TourType from '../../Tour/types/Tour';
import TransferType from '../../TransferPlacement/types/Transfer';
import AccommodationType from '../../Supplier/types/Accommodation';
import PaxType from '../../Pax/types/Pax';
import Placeholder from '../../CityDay/types/PlaceholderOutput';
import RoomConfigType from '../../Supplier/types/RoomConfig';
import ServiceBookingStatusType from './ServiceBookingStatus';
import { getRoomConfigs } from '../../Supplier/controllers/Supplier';
import { getPaxsByServiceBookingKey } from '../../Pax/controllers/Pax';
import { getTransferByServiceBookingKey } from '../../TransferPlacement/controllers/TransferPlacement';
import { getTransferPaxStatuses } from '../../ServiceBooking/controllers/ServiceBooking';
import PaxStatusesType from '../../Pax/types/PaxStatuses';


const PriceType = new GraphQLObjectType({
  name: 'ServicePrice',
  fields: () => ({
    currency: {
      type: GraphQLString,
      resolve: ({ currency }) => currency || 'THB' // TODO: change stub data
    },
    amount: {
      type: GraphQLFloat
    },
    usdAmount: { // TODO: change stub data
      type: GraphQLFloat,
      resolve: ({ usdAmount, amount }) => usdAmount || amount * 0.0278009
    }
  })
});

const RateType = new GraphQLObjectType({
  name: 'ServiceRate',
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

const RouteType = new GraphQLObjectType({
  name: 'TransferRoute',
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

const PickUpType = new GraphQLObjectType({
  name: 'PickUp',
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

const DropOffType = new GraphQLObjectType({
  name: 'DropOff',
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

const Extras = new GraphQLObjectType({
  name: 'ServiceExtras',
  fields: () => ({
    quantity: {
      type: GraphQLInt
    }
  })
});

export default new GraphQLObjectType({
  name: 'ServiceBooking',
  description: 'The service booking object in Quickplan',
  fields: () => ({
    id: globalIdField('ServiceBooking', service => service._key),
    _key: {
      type: GraphQLString,
      description: 'Unique service booking ID.'
    },
    productId: {
      type: GraphQLString
    },
    serviceSequenceNumber: {
      type: GraphQLInt
    },
    serviceLineId: {
      type: GraphQLInt
    },
    status: {
      type: ServiceBookingStatusType
    },
    price: {
      type: PriceType,
      resolve: ({ price }) => {
        let amount = random(1000, 100000) / 100;
        if (typeof price !== 'undefined' && price && price.amount) {
          amount = price.amount;
        } else {
          amount = '';
        }
        return {
          currency: 'THB',
          amount,
          usdAmount: ''
          // usdAmount: amount * 0.0278009
        };
      }
    },
    route: {
      type: RouteType
    },
    rate: {
      type: RateType
    },
    dateFrom: {
      type: GraphQLString
    },
    dateTo: {
      type: GraphQLString
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
    period: {
      type: GraphQLString,
      resolve: ({ // eslint-disable-line
        tour,
        startSlot = 0,
        durationSlots = 0,
        placeholder
      }) => tour || placeholder
        ? ['', 'Morning', 'Afternoon', 'Evening']
        .slice(startSlot, startSlot + durationSlots)
        .join(', ')
        : ''
    },
    durationSlots: {
      type: GraphQLInt
    },
    cancelHours: {
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
    isPlaceholder: {
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
      type: new GraphQLList(RoomConfigType),
      resolve: async parent => await getRoomConfigs(parent._key)
    },
    extras: {
      type: new GraphQLList(Extras)
    },
    tour: {
      type: TourType
    },
    serviceBookingType: {
      type: GraphQLString
    },
    localtransfer: { // added on 19th oct for local transfer
      type: TransferType
    },
    accommodation: {
      type: AccommodationType
    },
    transfer: {
      type: TransferType,
      resolve: async serviceBooking => await getTransferByServiceBookingKey({ serviceBookingKey: serviceBooking._key }) || {}
    },
    placeholder: {
      type: Placeholder
    },
    paxs: {
      type: new GraphQLList(PaxType),
      resolve: async serviceBooking => await getPaxsByServiceBookingKey({ serviceBookingKey: serviceBooking._key }) || []
    },
    paxStatuses: {
      type: new GraphQLList(PaxStatusesType),
      resolve: async serviceBooking => await getTransferPaxStatuses(serviceBooking._key)
    },
    afterHoursTransferOption: {
      type: GraphQLString
    },
    inactive: {
      type: GraphQLBoolean
    }
  }),
  interfaces: [nodeInterface]
});
