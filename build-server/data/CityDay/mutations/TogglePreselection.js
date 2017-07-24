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

var _AccessibleTour = require('./../../Tour/types/AccessibleTour');

var _AccessibleTour2 = _interopRequireDefault(_AccessibleTour);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var props = {
  cityDayKey: {
    type: _graphql.GraphQLID,
    description: 'The key of the city day object to preselect.'
  },
  tourKey: {
    type: _graphql.GraphQLID,
    description: 'The key of the tour object to preselect.'
  },
  isPreselected: {
    type: _graphql.GraphQLBoolean,
    description: 'Preselected state. Toggles the preselection.'
  },
  startSlot: {
    type: _graphql.GraphQLInt,
    description: 'Start slot of preselection.'
  }
};

exports.default = (0, _graphqlRelay.mutationWithClientMutationId)({
  name: 'TogglePreselectedStateTourToCityDay',
  description: 'Toggle preselected state on tour to city day.',
  inputFields: (0, _extends3.default)({}, props),
  outputFields: {
    tour: {
      type: _AccessibleTour2.default,
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
              return citydayCtrl.togglePreselection(inputFields);

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