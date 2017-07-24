'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _graphql = require('graphql');

var _graphqlRelay = require('graphql-relay');

var _AccessibleSupplier = require('../../Supplier/types/AccessibleSupplier');

var _AccessibleSupplier2 = _interopRequireDefault(_AccessibleSupplier);

var _Transfer = require('../controllers/Transfer');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var LocationType = new _graphql.GraphQLObjectType({
  name: 'LocationType',
  fields: function fields() {
    return {
      cityName: {
        type: _graphql.GraphQLString
      },
      tpCode: {
        type: _graphql.GraphQLString
      },
      localityName: {
        type: _graphql.GraphQLString,
        resolve: function resolve(_ref) {
          var localityName = _ref.localityName;

          if (localityName === '-') {
            return '';
          }

          return localityName || '';
        }
      },
      place: {
        type: _graphql.GraphQLString,
        resolve: function resolve(_ref2) {
          var place = _ref2.place;

          if (place === '-') {
            return '';
          }

          return place || '';
        }
      }
    };
  }
});

var RouteType = new _graphql.GraphQLObjectType({
  name: 'Route',
  fields: function fields() {
    return {
      direction: {
        type: _graphql.GraphQLString
      },
      from: {
        type: LocationType
      },
      to: {
        type: LocationType
      },
      departureTime: { // TODO: change stub data
        type: _graphql.GraphQLString,
        resolve: function resolve(_ref3) {
          var departureTime = _ref3.departureTime;
          return departureTime || '10:15';
        }
      },
      arrivalTime: { // TODO: change stub data
        type: _graphql.GraphQLString,
        resolve: function resolve(_ref4) {
          var arrivalTime = _ref4.arrivalTime;
          return arrivalTime || '11:20';
        }
      }
    };
  }
});

var TypeType = new _graphql.GraphQLObjectType({
  name: 'Type',
  fields: function fields() {
    return {
      description: {
        type: _graphql.GraphQLString
      }
    };
  }
});

var ClassType = new _graphql.GraphQLObjectType({
  name: 'Class',
  fields: function fields() {
    return {
      description: {
        type: _graphql.GraphQLString
      }
    };
  }
});

var VehicleType = new _graphql.GraphQLObjectType({
  name: 'Vehicle',
  fields: function fields() {
    return {
      category: {
        type: _graphql.GraphQLString
      },
      model: {
        type: _graphql.GraphQLString
      },
      maxPax: {
        type: _graphql.GraphQLString
      }

    };
  }
});

exports.default = new _graphql.GraphQLObjectType({
  name: 'Transfer',
  description: 'The accessible transfers in quickplan from tourplan.',
  fields: function fields() {
    return {
      id: (0, _graphqlRelay.globalIdField)('Transfer', function (transfer) {
        return transfer._key;
      }),
      _key: {
        type: _graphql.GraphQLString,
        description: 'Unique transfer ID.'
      },
      route: {
        type: RouteType
      },
      title: {
        type: _graphql.GraphQLString
      },
      description: {
        type: _graphql.GraphQLString
      },
      comment: {
        type: _graphql.GraphQLString
      },
      guideLanguage: {
        type: _graphql.GraphQLString
      },
      type: {
        type: TypeType
      },
      vehicle: {
        type: VehicleType
      },
      class: {
        type: ClassType
      },
      supplier: {
        type: _AccessibleSupplier2.default,
        resolve: function () {
          var _ref5 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(transfer) {
            return _regenerator2.default.wrap(function _callee$(_context) {
              while (1) {
                switch (_context.prev = _context.next) {
                  case 0:
                    _context.next = 2;
                    return (0, _Transfer.getSupplierByTransferId)(transfer._id);

                  case 2:
                    return _context.abrupt('return', _context.sent);

                  case 3:
                  case 'end':
                    return _context.stop();
                }
              }
            }, _callee, undefined);
          }));

          return function resolve(_x) {
            return _ref5.apply(this, arguments);
          };
        }()
      }
    };
  }
});