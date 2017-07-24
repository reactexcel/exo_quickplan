'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _graphql = require('graphql');

var _graphqlRelay = require('graphql-relay');

var _interface = require('../../interface');

var _ServiceBooking = require('../../ServiceBooking/types/ServiceBooking');

var _ServiceBooking2 = _interopRequireDefault(_ServiceBooking);

var _Images = require('../../Tour/types/Images');

var _Images2 = _interopRequireDefault(_Images);

var _AccessibleSupplier = require('../../Supplier/types/AccessibleSupplier');

var _AccessibleSupplier2 = _interopRequireDefault(_AccessibleSupplier);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = new _graphql.GraphQLObjectType({
  name: 'AccommodationPlacement',
  fields: {
    id: (0, _graphqlRelay.globalIdField)('AccommodationPlacement', function (accommodationPlacement) {
      return accommodationPlacement._key;
    }),
    _key: {
      type: _graphql.GraphQLString,
      description: 'Unique tour ID.'
    },
    durationNights: {
      type: _graphql.GraphQLInt
    },
    startDay: {
      type: _graphql.GraphQLInt
    },
    images: {
      type: new _graphql.GraphQLList(_Images2.default)
    },
    serviceBookings: {
      type: new _graphql.GraphQLList(_ServiceBooking2.default)
    },
    supplier: {
      type: _AccessibleSupplier2.default
    },
    startDate: {
      type: _graphql.GraphQLString
    },
    preselectionNum: {
      type: _graphql.GraphQLInt
    }
  },
  interfaces: [_interface.nodeInterface]
});