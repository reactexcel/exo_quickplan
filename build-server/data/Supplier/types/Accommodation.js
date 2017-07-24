'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _graphql = require('graphql');

var _graphqlRelay = require('graphql-relay');

var _PaxInfo = require('./PaxInfo');

var _PaxInfo2 = _interopRequireDefault(_PaxInfo);

var _StayLimit = require('./StayLimit');

var _StayLimit2 = _interopRequireDefault(_StayLimit);

var _Locality = require('./Locality');

var _Locality2 = _interopRequireDefault(_Locality);

var _Class = require('./Class');

var _Class2 = _interopRequireDefault(_Class);

var _Supplier = require('./Supplier');

var _Supplier2 = _interopRequireDefault(_Supplier);

var _AccommodationRate = require('./AccommodationRate');

var _AccommodationRate2 = _interopRequireDefault(_AccommodationRate);

var _Promotion = require('../../Availability/types/Promotion');

var _Promotion2 = _interopRequireDefault(_Promotion);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = new _graphql.GraphQLObjectType({
  name: 'Accommodation',
  fields: function fields() {
    return {
      id: (0, _graphqlRelay.globalIdField)('Accommodation', function (acc) {
        return acc._key;
      }),
      _key: {
        type: _graphql.GraphQLString
      },
      isPreferred: {
        type: _graphql.GraphQLBoolean
      },
      isPromotion: {
        type: _graphql.GraphQLBoolean
      },
      isPreselected: {
        type: _graphql.GraphQLBoolean
      },
      hasPromotions: {
        type: _graphql.GraphQLBoolean
      },
      promotions: {
        type: new _graphql.GraphQLList(_Promotion2.default)
      },
      rate: {
        type: _AccommodationRate2.default
      },
      productId: {
        type: _graphql.GraphQLString
      },
      supplierId: {
        type: _graphql.GraphQLString
      },
      pax: {
        type: _PaxInfo2.default
      },
      stayLimits: {
        type: _StayLimit2.default
      },
      productOptCode: {
        type: _graphql.GraphQLString
      },
      title: {
        type: _graphql.GraphQLString
      },
      category: {
        type: _graphql.GraphQLString
      },
      sType: {
        type: _graphql.GraphQLString
      },
      voucherName: {
        type: _graphql.GraphQLString
      },
      locality: {
        type: _Locality2.default
      },
      class: {
        type: _Class2.default
      },
      supplier: {
        type: _Supplier2.default
      }
    };
  }
});