'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _graphql = require('graphql');

var _TransferAvailability = require('../types/TransferAvailability');

var _TransferAvailability2 = _interopRequireDefault(_TransferAvailability);

var _Availability = require('../controllers/Availability');

var availabilityCtrl = _interopRequireWildcard(_Availability);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  transferAvailability: {
    type: new _graphql.GraphQLList(_TransferAvailability2.default),
    args: {
      transferPlacementId: {
        type: new _graphql.GraphQLNonNull(_graphql.GraphQLString)
      },
      country: {
        type: new _graphql.GraphQLNonNull(_graphql.GraphQLString)
      },
      productIds: {
        type: new _graphql.GraphQLList(_graphql.GraphQLString)
      },
      serviceBookingKeys: {
        type: new _graphql.GraphQLList(_graphql.GraphQLString)
      },
      date: {
        type: new _graphql.GraphQLNonNull(_graphql.GraphQLString)
      },
      nrOfAdults: {
        type: new _graphql.GraphQLNonNull(_graphql.GraphQLInt)
      },
      nrOfChildren: {
        type: new _graphql.GraphQLNonNull(_graphql.GraphQLInt)
      },
      nrOfInfants: {
        type: new _graphql.GraphQLNonNull(_graphql.GraphQLInt)
      },
      agent: {
        type: _graphql.GraphQLString
      },
      password: {
        type: _graphql.GraphQLString
      }
    },
    resolve: function () {
      var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(_, args) {
        var transferPlacementId, country, productIds, date, serviceBookingKeys, nrOfAdults, nrOfChildren, nrOfInfants;
        return _regenerator2.default.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                transferPlacementId = args.transferPlacementId, country = args.country, productIds = args.productIds, date = args.date, serviceBookingKeys = args.serviceBookingKeys, nrOfAdults = args.nrOfAdults, nrOfChildren = args.nrOfChildren, nrOfInfants = args.nrOfInfants;
                _context.next = 3;
                return availabilityCtrl.getTransferAvailability({ transferPlacementId: transferPlacementId, country: country, productIds: productIds, serviceBookingKeys: serviceBookingKeys, date: date, nrOfAdults: nrOfAdults, nrOfChildren: nrOfChildren, nrOfInfants: nrOfInfants });

              case 3:
                return _context.abrupt('return', _context.sent);

              case 4:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, undefined);
      }));

      return function resolve(_x, _x2) {
        return _ref.apply(this, arguments);
      };
    }()
  }
};