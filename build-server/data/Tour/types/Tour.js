'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _graphql = require('graphql');

var _LocalityType = require('./LocalityType');

var _LocalityType2 = _interopRequireDefault(_LocalityType);

var _Rate = require('./Rate');

var _Rate2 = _interopRequireDefault(_Rate);

var _AccessibleTourPromotion = require('./AccessibleTourPromotion');

var _AccessibleTourPromotion2 = _interopRequireDefault(_AccessibleTourPromotion);

var _Promotion = require('../../Availability/types/Promotion');

var _Promotion2 = _interopRequireDefault(_Promotion);

var _PAX = require('./PAX');

var _PAX2 = _interopRequireDefault(_PAX);

var _Extras = require('./Extras');

var _Extras2 = _interopRequireDefault(_Extras);

var _Images = require('./Images');

var _Images2 = _interopRequireDefault(_Images);

var _TimeSlots = require('./TimeSlots');

var _TimeSlots2 = _interopRequireDefault(_TimeSlots);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = new _graphql.GraphQLObjectType({
  name: 'Tour',
  description: 'The tour object in quickplan',
  fields: function fields() {
    return {
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
        type: _graphql.GraphQLString,
        resolve: function resolve(_ref) {
          var description = _ref.description;
          return description || '';
        }
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
      timeSlots: {
        type: _TimeSlots2.default
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
      extras: {
        type: new _graphql.GraphQLList(_Extras2.default)
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
        resolve: function resolve(_ref2) {
          var exclusions = _ref2.exclusions;
          return exclusions || [];
        }
      },
      highlights: {
        type: new _graphql.GraphQLList(_graphql.GraphQLString),
        resolve: function resolve(_ref3) {
          var highlights = _ref3.highlights;
          return highlights || [];
        }
      },
      inclusions: {
        type: new _graphql.GraphQLList(_graphql.GraphQLString),
        resolve: function resolve(_ref4) {
          var inclusions = _ref4.inclusions;
          return inclusions || [];
        }
      },
      styles: {
        type: new _graphql.GraphQLList(_graphql.GraphQLString)
      },
      images: {
        type: new _graphql.GraphQLList(_Images2.default),
        resolve: function resolve(_ref5) {
          var images = _ref5.images;
          return images || [];
        }
      }
    };
  }
});