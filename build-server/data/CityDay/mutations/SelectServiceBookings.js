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

var _CityDay = require('./../controllers/CityDay');

var citydayCtrl = _interopRequireWildcard(_CityDay);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var SelectTourObject = new _graphql.GraphQLInputObjectType({
  name: 'SelectTourObject',
  description: 'The tours objects to select ',
  fields: function fields() {
    return {
      tourKey: {
        type: _graphql.GraphQLString
      },
      startSlot: {
        type: _graphql.GraphQLInt
      },
      durationSlots: {
        type: _graphql.GraphQLInt
      }
    };
  }
});

var props = {
  cityDayKey: {
    type: _graphql.GraphQLID,
    description: 'The id of the cityday/accommodation placement to preselect.'
  },
  selectedServiceBookingKeys: {
    type: new _graphql.GraphQLList(_graphql.GraphQLString),
    description: 'An array of the serviceBookings which TC create and TA want to select/follow'
  },
  tourKeys: {
    type: new _graphql.GraphQLList(SelectTourObject),
    description: 'An array of tour preselection objects {tourKey: tourKey(string), startSlot: startSlot(integer)}, will new booking service and followed.'
  }
};

exports.default = (0, _graphqlRelay.mutationWithClientMutationId)({
  name: 'SelectServiceBookings',
  description: 'TA select/follow tour/accommodation service bookings, ',
  inputFields: (0, _extends3.default)({}, props),
  outputFields: {
    cityDayKey: {
      type: _graphql.GraphQLString,
      resolve: function resolve(saveDoc) {
        return saveDoc;
      }
    }
  },
  mutateAndGetPayload: function () {
    var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(inputFields) {
      var cityDayKey;
      return _regenerator2.default.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.next = 2;
              return citydayCtrl.selectServiceBookings(inputFields);

            case 2:
              cityDayKey = _context.sent;
              return _context.abrupt('return', cityDayKey);

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