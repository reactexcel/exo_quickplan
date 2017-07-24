'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _graphql = require('graphql');

var _graphqlRelay = require('graphql-relay');

var _ServiceBooking = require('./../controllers/ServiceBooking');

var servicebookingCtrl = _interopRequireWildcard(_ServiceBooking);

var _ServiceBooking2 = require('./../types/ServiceBooking');

var _ServiceBooking3 = _interopRequireDefault(_ServiceBooking2);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var PriceType = new _graphql.GraphQLInputObjectType({
  name: 'PriceType',
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
var RateType = new _graphql.GraphQLInputObjectType({
  name: 'RateType',
  fields: function fields() {
    return {
      id: {
        type: _graphql.GraphQLString
      },
      name: {
        type: _graphql.GraphQLString
      },
      description: {
        type: _graphql.GraphQLString
      }
    };
  }
});
var PickUpType = new _graphql.GraphQLInputObjectType({
  name: 'PickUpType',
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
  name: 'DropOffType',
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
var CheckInCheckOutType = new _graphql.GraphQLInputObjectType({
  name: 'CheckInCheckOutType',
  fields: function fields() {
    return {
      requested: {
        type: _graphql.GraphQLBoolean
      },
      comments: {
        type: _graphql.GraphQLString
      }
    };
  }
});
var PaxListObjectType = new _graphql.GraphQLInputObjectType({
  name: 'PaxListObjectType',
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
var RoomConfigType = new _graphql.GraphQLInputObjectType({
  name: 'RoomConfigType',
  fields: function fields() {
    return {
      roomType: {
        type: _graphql.GraphQLString
      },
      paxList: {
        type: new _graphql.GraphQLList(PaxListObjectType)
      }
    };
  }
});
var ExtrasType = new _graphql.GraphQLInputObjectType({
  name: 'ExtrasType',
  fields: function fields() {
    return {
      sequenceNumber: {
        type: _graphql.GraphQLInt
      },
      quantity: {
        type: _graphql.GraphQLInt
      }
    };
  }
});
var props = {
  tourKey: { type: _graphql.GraphQLID },
  productId: { type: _graphql.GraphQLString },
  serviceSequenceNumber: { type: _graphql.GraphQLInt },
  serviceLineId: { type: _graphql.GraphQLInt },
  availabilityStatus: { type: _graphql.GraphQLString },
  bookingStatus: { type: _graphql.GraphQLString },
  _key: { type: _graphql.GraphQLString },
  price: { type: PriceType },
  rate: { type: RateType },
  dateFrom: { type: _graphql.GraphQLString },
  dateTo: { type: _graphql.GraphQLString },
  numberOfNights: { type: _graphql.GraphQLInt },
  startDay: { type: _graphql.GraphQLInt },
  startSlot: { type: _graphql.GraphQLInt },
  durationSlots: { type: _graphql.GraphQLInt },
  cancelHours: { type: _graphql.GraphQLInt },
  pickUp: { type: PickUpType },
  dropOff: { type: DropOffType },
  earlyCheckin: { type: CheckInCheckOutType },
  lateCheckout: { type: CheckInCheckOutType },
  comment: { type: _graphql.GraphQLString },
  remarks: { type: _graphql.GraphQLString },
  notes: { type: _graphql.GraphQLString },
  roomConfigs: { type: new _graphql.GraphQLList(RoomConfigType) },
  bookedExtras: { type: new _graphql.GraphQLList(ExtrasType) }
};

exports.default = (0, _graphqlRelay.mutationWithClientMutationId)({
  name: 'AddServiceBooking',
  inputFields: (0, _extends3.default)({}, props),
  outputFields: {
    servicebooking: {
      type: _ServiceBooking3.default,
      resolve: function resolve(saveDoc) {
        return saveDoc;
      }
    }
  },
  mutateAndGetPayload: function () {
    var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(inputFields) {
      var saveDoc;
      return _regenerator2.default.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.next = 2;
              return servicebookingCtrl.addServiceBooking(inputFields);

            case 2:
              saveDoc = _context.sent;
              return _context.abrupt('return', saveDoc);

            case 4:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee, undefined);
    }));

    return function mutateAndGetPayload(_x) {
      return _ref.apply(this, arguments);
    };
  }()
});