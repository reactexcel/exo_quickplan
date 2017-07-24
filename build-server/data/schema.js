'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _graphql = require('graphql');

var _interface = require('./interface');

var _Proposal = require('./Proposal');

var _Tour = require('./Tour');

var _TripPlanner = require('./TripPlanner');

var _CountryBooking = require('./CountryBooking');

var _CityBooking = require('./CityBooking');

var _ServiceBooking = require('./ServiceBooking');

var _Trip = require('./Trip');

var _CityDay = require('./CityDay');

var _CountryCityTree = require('./CountryCityTree');

var _Word = require('./Word');

var _Supplier = require('./Supplier');

var _Pax = require('./Pax');

var _TransferPlacement = require('./TransferPlacement');

var _Availability = require('./Availability');

var _Location = require('./Location');

var _UserField = require('./User/UserField');

var _UserField2 = _interopRequireDefault(_UserField);

var _OfficeField = require('./Office/OfficeField');

var _OfficeField2 = _interopRequireDefault(_OfficeField);

var _OfficesField = require('./Office/OfficesField');

var _OfficesField2 = _interopRequireDefault(_OfficesField);

var _Locations = require('./Location/queries/Locations');

var _Locations2 = _interopRequireDefault(_Locations);

var _Proposal2 = require('./Proposal/fields/Proposal');

var _Proposal3 = _interopRequireDefault(_Proposal2);

var _Trip2 = require('./Trip/fields/Trip');

var _Trip3 = _interopRequireDefault(_Trip2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Viewer type is the starting node that will be used to traverse a graph,
 * we need a viewer type because the root type in Relay currently can't return an array.
 * Moreover, it allows us to write just one "viewerQuery" in the front-end side.
 * @see https://github.com/facebook/relay/issues/112
 *
 */
var viewerType = new _graphql.GraphQLObjectType({
  name: 'Viewer',
  fields: function fields() {
    return (0, _extends3.default)({}, _TripPlanner.TripPlannerQuery, _Tour.AccessibleTourQuery, _Availability.TourAvailabilityQuery, _Availability.TransferAvailabilityQuery, _Trip.GetTripQuery, _CountryBooking.GetServicesByCountryBookingKeyQuery, _Supplier.AccessibleSupplierQuery, _Supplier.CheckSupplierPaxStatusQuery, _ServiceBooking.ServiceBookingControllerQuery, _ServiceBooking.ServiceBooking, _Pax.PaxsQuery, _CityDay.CityDayQuery, _CityBooking.CityBookingQuery, _Supplier.AccommodationPlacementQuery, _TransferPlacement.TransferPlacementQuery, _TransferPlacement.GetAccessibleTransfersQuery, _Location.LocationQuery, _ServiceBooking.CheckServicesAvailabilityQuery, _CountryCityTree.CountryCityTreeQuery, {
      user: _UserField2.default,
      office: _OfficeField2.default,
      offices: _OfficesField2.default,
      locations: _Locations2.default,
      proposal: _Proposal3.default,
      trip: _Trip3.default
    });
  }
});

/**
 * This is the type that will be the root of our query,
 * and the entry point into our schema.
 */
/* eslint-disable no-unused-vars */
var queryType = new _graphql.GraphQLObjectType({
  name: 'Query',
  fields: function fields() {
    return {
      node: _interface.nodeField,
      viewer: {
        type: viewerType,
        resolve: function resolve() {
          return {};
        }
      }
    };
  }
});

/**
 * This is the type that will be the root of our mutations,
 * and the entry point into performing writes in our schema.
 */
var mutationType = new _graphql.GraphQLObjectType({
  name: 'Mutation',
  fields: function fields() {
    return (0, _extends3.default)({}, _TripPlanner.TripPlannerMutation, _Proposal.ProposalMutation, _CountryBooking.CountryBookingMutation, _CityBooking.CityBookingMutation, _ServiceBooking.ServiceBookingMutation, _Trip.TripMutation, _CityDay.CityDayMutation, _Supplier.SupplierMutation, _Tour.TourMutation, _TransferPlacement.TransferPlacementMutation, _Pax.PaxMutation, _CountryCityTree.CountryCityTreeMutation, _Word.TripToWordMutation);
  }
});

/**
 * Finally, we construct our schema (whose starting query type is the query
 * type we defined above) and export it.
 */
exports.default = new _graphql.GraphQLSchema({
  query: queryType,
  mutation: mutationType
});