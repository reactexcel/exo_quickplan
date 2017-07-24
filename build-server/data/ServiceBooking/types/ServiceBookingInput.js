'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _graphql = require('graphql');

var _PlaceholderInput = require('../../CityDay/types/PlaceholderInput');

var _PlaceholderInput2 = _interopRequireDefault(_PlaceholderInput);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var PickUpType = new _graphql.GraphQLInputObjectType({
  name: 'PickUpInput',
  fields: function fields() {
    return {
      time: {
        type: _graphql.GraphQLString
      },
      location: {
        type: _graphql.GraphQLString
      },
      remarks: {
        type: _graphql.GraphQLString
      }
    };
  }
});

var DropOffType = new _graphql.GraphQLInputObjectType({
  name: 'DropOffInput',
  fields: function fields() {
    return {
      time: {
        type: _graphql.GraphQLString
      },
      location: {
        type: _graphql.GraphQLString
      },
      remarks: {
        type: _graphql.GraphQLString
      }
    };
  }
});

var PaxListObject = new _graphql.GraphQLInputObjectType({
  name: 'PaxListObjectInput',
  fields: function fields() {
    return {
      tpPaxId: {
        type: _graphql.GraphQLInt
      },
      paxID: {
        type: _graphql.GraphQLInt
      },
      ageGroup: {
        type: _graphql.GraphQLString
      }
    };
  }
});

var RoomConfig = new _graphql.GraphQLInputObjectType({
  name: 'RoomConfigInput',
  fields: function fields() {
    return {
      roomType: {
        type: _graphql.GraphQLString
      },
      paxList: {
        type: new _graphql.GraphQLList(PaxListObject)
      }
    };
  }
});

var Extras = new _graphql.GraphQLInputObjectType({
  name: 'ServiceExtrasInput',
  fields: function fields() {
    return {
      quantity: {
        type: _graphql.GraphQLInt
      }
    };
  }
});

var Status = new _graphql.GraphQLInputObjectType({
  name: 'ServiceBookingStatus',
  fields: function fields() {
    return {
      tpBookingStatus: {
        type: _graphql.GraphQLString
      },
      state: {
        type: _graphql.GraphQLString
      },
      tpAvailabilityStatus: {
        type: _graphql.GraphQLString
      }
    };
  }
});

var Price = new _graphql.GraphQLInputObjectType({
  name: 'ServiceBookingPrice',
  fields: function fields() {
    return {
      currency: {
        type: _graphql.GraphQLString
      },
      amount: {
        type: _graphql.GraphQLInt
      }
    };
  }
});

var RouteType = new _graphql.GraphQLInputObjectType({
  name: 'TransferRouteInput',
  fields: function fields() {
    return {
      from: {
        type: _graphql.GraphQLString
      },
      to: {
        type: _graphql.GraphQLString
      },
      departureTime: {
        type: _graphql.GraphQLString
      },
      arrivalTime: {
        type: _graphql.GraphQLString
      },
      refNo: {
        type: _graphql.GraphQLString
      },
      withGuide: {
        type: _graphql.GraphQLString
      }
    };
  }
});

exports.default = new _graphql.GraphQLInputObjectType({
  name: 'ServiceBookingInput',
  description: 'The service booking object in Quickplan',
  fields: function fields() {
    return {
      dateFrom: {
        type: _graphql.GraphQLString
      },
      dateTo: {
        type: _graphql.GraphQLString
      },
      cancelHours: {
        type: _graphql.GraphQLInt
      },
      numberOfNights: {
        type: _graphql.GraphQLInt
      },
      startDay: {
        type: _graphql.GraphQLInt
      },
      startSlot: {
        type: _graphql.GraphQLInt
      },
      durationSlots: {
        type: _graphql.GraphQLInt
      },
      pickUp: {
        type: PickUpType
      },
      dropOff: {
        type: DropOffType
      },
      longDistanceOption: {
        type: _graphql.GraphQLBoolean
      },
      isEarlyCheckin: {
        type: _graphql.GraphQLBoolean
      },
      isLateCheckout: {
        type: _graphql.GraphQLBoolean
      },
      comment: {
        type: _graphql.GraphQLString
      },
      remarks: {
        type: _graphql.GraphQLString
      },
      notes: {
        type: _graphql.GraphQLString
      },
      roomConfigs: {
        type: new _graphql.GraphQLList(RoomConfig)
      },
      extras: {
        type: new _graphql.GraphQLList(Extras)
      },
      placeholder: {
        type: _PlaceholderInput2.default
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
        type: _graphql.GraphQLString,
        description: 'Transfer key for matching key when updating (UpdateTransferPlacement)'
      },
      isPlaceholder: {
        type: _graphql.GraphQLBoolean
      },
      afterHoursTransferOption: {
        type: _graphql.GraphQLString
      }
    };
  }
});