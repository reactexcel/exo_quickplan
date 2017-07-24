'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _graphql = require('graphql');

var _LocalityType = require('./LocalityType');

var _LocalityType2 = _interopRequireDefault(_LocalityType);

var _Rate = require('./Rate');

var _Rate2 = _interopRequireDefault(_Rate);

var _Promotion = require('../../Availability/types/Promotion');

var _Promotion2 = _interopRequireDefault(_Promotion);

var _AccessibleTourPromotion = require('./AccessibleTourPromotion');

var _AccessibleTourPromotion2 = _interopRequireDefault(_AccessibleTourPromotion);

var _PAX = require('./PAX');

var _PAX2 = _interopRequireDefault(_PAX);

var _Extras = require('./Extras');

var _Extras2 = _interopRequireDefault(_Extras);

var _Images = require('./Images');

var _Images2 = _interopRequireDefault(_Images);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = new _graphql.GraphQLObjectType({
  name: 'AccessibleTour',
  description: 'The tour object in quickplan',
  fields: function fields() {
    return {
      id: {
        type: _graphql.GraphQLID,
        resolve: function resolve(tour) {
          return tour._key + tour.startSlot;
        }
      },
      _key: {
        type: _graphql.GraphQLString,
        description: 'Unique tour ID.'
      },
      productId: {
        type: _graphql.GraphQLString,
        description: 'Tour ID from Tourplan'
      },
      title: {
        type: _graphql.GraphQLString
      },
      productOptCode: {
        type: _graphql.GraphQLString
      },
      category: {
        type: _graphql.GraphQLString
      },
      sType: {
        type: _graphql.GraphQLString
      },
      guideLanguage: {
        type: _graphql.GraphQLString
      },
      locality: {
        type: _LocalityType2.default
      },
      comment: {
        type: _graphql.GraphQLString
      },
      description: {
        type: _graphql.GraphQLString
      },
      rank: {
        type: _graphql.GraphQLInt
      },
      rate: {
        type: _Rate2.default
      },
      isPreferred: {
        type: _graphql.GraphQLBoolean
      },
      isPreselected: {
        type: _graphql.GraphQLBoolean
      },
      isPromotion: {
        type: _graphql.GraphQLBoolean
      },
      hasPromotions: {
        type: _graphql.GraphQLBoolean
      },
      promotions: {
        type: new _graphql.GraphQLList(_Promotion2.default)
      },
      accessibleTourPromotion: {
        type: _AccessibleTourPromotion2.default
      },
      durationSlots: {
        type: _graphql.GraphQLInt
      },
      cancellationPolicy: {
        type: _graphql.GraphQLString
      },
      voucherName: {
        type: _graphql.GraphQLString
      },
      pax: {
        type: _PAX2.default
      },
      childPolicy: {
        type: _graphql.GraphQLString
      },
      introduction: {
        type: _graphql.GraphQLString
      },
      notes: {
        type: _graphql.GraphQLString
      },
      details: {
        type: _graphql.GraphQLString
      },
      exclusions: {
        type: new _graphql.GraphQLList(_graphql.GraphQLString),
        resolve: function resolve(_ref) {
          var exclusions = _ref.exclusions;
          return exclusions || [];
        }
      },
      highlights: {
        type: new _graphql.GraphQLList(_graphql.GraphQLString),
        resolve: function resolve(_ref2) {
          var highlights = _ref2.highlights;
          return highlights || [];
        }
      },
      inclusions: {
        type: new _graphql.GraphQLList(_graphql.GraphQLString),
        resolve: function resolve(_ref3) {
          var inclusions = _ref3.inclusions;
          return inclusions || [];
        }
      },
      extras: {
        type: new _graphql.GraphQLList(_Extras2.default)
      },
      styles: {
        type: new _graphql.GraphQLList(_graphql.GraphQLString)
      },
      images: {
        type: new _graphql.GraphQLList(_Images2.default)
      },
      startSlot: {
        type: _graphql.GraphQLInt
      },
      isAgentSpecific: {
        type: _graphql.GraphQLBoolean
      }
    };
  }
});