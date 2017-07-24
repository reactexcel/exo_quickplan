'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _graphql = require('graphql');

var _SupplierAddress = require('./SupplierAddress');

var _SupplierAddress2 = _interopRequireDefault(_SupplierAddress);

var _Accommodation = require('./Accommodation');

var _Accommodation2 = _interopRequireDefault(_Accommodation);

var _Class = require('./Class');

var _Class2 = _interopRequireDefault(_Class);

var _Images = require('../../Tour/types/Images');

var _Images2 = _interopRequireDefault(_Images);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = new _graphql.GraphQLObjectType({
  name: 'AccessibleSuppliers',
  description: 'The accessible suppliers in quickplan from tourplan.',
  fields: function fields() {
    return {
      id: {
        type: _graphql.GraphQLID,
        resolve: function resolve(supplier) {
          return supplier._key;
        }
      },
      _key: {
        type: _graphql.GraphQLString,
        description: 'Unique supplier ID.'
      },
      supplierId: {
        type: _graphql.GraphQLString,
        description: 'Supplier ID in tourplan.'
      },
      title: {
        type: _graphql.GraphQLString,
        description: 'Name of supplier.'
      },
      description: {
        type: _graphql.GraphQLString,
        description: 'Description of supplier.',
        resolve: function resolve(_ref) {
          var description = _ref.description;
          return description || '';
        }
      },
      phone: {
        type: _graphql.GraphQLString,
        description: 'Supplier phone.'
      },
      fax: {
        type: _graphql.GraphQLString,
        description: 'Supplier fax.'
      },
      email: {
        type: _graphql.GraphQLString,
        description: 'Supplier email.'
      },
      web: {
        type: _graphql.GraphQLString,
        description: 'Supplier web.'
      },
      childPolicy: {
        type: _graphql.GraphQLString,
        description: 'Suppliers child policy.'
      },
      cancellationPolicy: {
        type: _graphql.GraphQLString,
        description: 'the suppliers cancellation policy.'
      },
      address: {
        type: _SupplierAddress2.default,
        description: 'The address of the supplier.'
      },
      supplierCode: {
        type: _graphql.GraphQLString,
        description: 'The supplier code to use for retrieving information from TourPlan.'
      },
      images: {
        type: new _graphql.GraphQLList(_Images2.default),
        resolve: function resolve(_ref2) {
          var images = _ref2.images;
          return images || [];
        }
      },
      cheapestRoomRate: {
        type: _graphql.GraphQLInt,
        resolve: function resolve(sup) {
          return sup.cheapestRoomRate && sup.cheapestRoomRate.length >= 2 ? sup.cheapestRoomRate.substring(0, sup.cheapestRoomRate.length - 2) : null;
        } // eslint-disable-line no-confusing-arrow
      },
      currency: {
        type: _graphql.GraphQLString
      },
      class: {
        type: _Class2.default,
        description: 'Supplier class, take from the first accommodation in the supplier',
        resolve: function resolve(sup) {
          return sup.accommodations[0].class;
        }
      },
      isPreferred: {
        type: _graphql.GraphQLBoolean,
        resolve: function resolve(sup) {
          return sup.accommodations.some(function (acc) {
            return acc.isPreferred;
          });
        }
      },
      isPreselected: {
        type: _graphql.GraphQLBoolean,
        resolve: function resolve(sup) {
          return sup.accommodations.some(function (acc) {
            return acc.isPreselected;
          });
        }
      },
      hasPromotions: {
        type: _graphql.GraphQLBoolean,
        resolve: function resolve(sup) {
          return sup.accommodations.some(function (acc) {
            return acc.hasPromotions;
          });
        }
      },
      accommodations: {
        type: new _graphql.GraphQLList(_Accommodation2.default)
      }
    };
  }
});