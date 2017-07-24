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

var _CityDay = require('./../types/CityDay');

var _CityDay2 = _interopRequireDefault(_CityDay);

var _CityDay3 = require('./../controllers/CityDay');

var citydayCtrl = _interopRequireWildcard(_CityDay3);

var _PlaceholderInput = require('../types/PlaceholderInput');

var _PlaceholderInput2 = _interopRequireDefault(_PlaceholderInput);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var TourUpdateObject = new _graphql.GraphQLInputObjectType({
  name: 'TourUpdateObject',
  description: 'The objects sent to update tours',
  fields: function fields() {
    return {
      tourKey: {
        type: _graphql.GraphQLString
      },
      startSlot: {
        type: _graphql.GraphQLInt
      }
    };
  }
});
var props = {
  cityDayKey: {
    type: _graphql.GraphQLID,
    description: 'The key of the city day object to update tours on.'
  },
  tourKeys: {
    type: new _graphql.GraphQLList(TourUpdateObject),
    description: 'An array of objects {tourKey: tourKey(string), startSlot: startSlot(integer)} for the tours to update.'
  },
  placeholders: {
    type: new _graphql.GraphQLList(_PlaceholderInput2.default)
  }
};

exports.default = (0, _graphqlRelay.mutationWithClientMutationId)({
  name: 'UpdateToursOfCityDay',
  description: 'Update tours on a city day object.',
  inputFields: (0, _extends3.default)({}, props),
  outputFields: {
    cityDays: {
      type: _CityDay2.default,
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
              return citydayCtrl.updateServicesByCityDayKey(inputFields);

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