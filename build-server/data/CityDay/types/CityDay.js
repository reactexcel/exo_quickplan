'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _graphql = require('graphql');

var _graphqlRelay = require('graphql-relay');

var _ServiceBooking = require('../../ServiceBooking/types/ServiceBooking');

var _ServiceBooking2 = _interopRequireDefault(_ServiceBooking);

var _interface = require('../../interface');

var _TransferPlacement = require('../../TransferPlacement/controllers/TransferPlacement');

var _TimeSlot = require('./TimeSlot');

var _TimeSlot2 = _interopRequireDefault(_TimeSlot);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var TourPreselection = new _graphql.GraphQLObjectType({
  name: 'TourPreselection',
  fields: {
    startSlot: {
      type: _graphql.GraphQLInt
    },
    tourId: {
      type: _graphql.GraphQLString
    }
  }
});

exports.default = new _graphql.GraphQLObjectType({
  name: 'CityDay',
  description: 'The city day object in quickplan',
  fields: function fields() {
    return {
      id: (0, _graphqlRelay.globalIdField)('CityDay', function (day) {
        return day._key;
      }),
      _key: {
        type: _graphql.GraphQLString,
        description: 'Unique city day ID.'
      },
      serviceBookings: {
        type: new _graphql.GraphQLList(_ServiceBooking2.default),
        resolve: function resolve(serviceBookings) {
          if (serviceBookings.serviceBookings.length === 0) {
            return [];
          } else {
            // eslint-disable-line  no-else-return
            return new _promise2.default(function (resolve, reject) {
              // eslint-disable-line  no-unused-vars
              var allDBTransfers = (0, _TransferPlacement.getAllDBTransfers)();
              return allDBTransfers.then(function (dbTransfers) {
                // eslint-disable-line consistent-return
                var updatedServiceBookings = [];
                if (serviceBookings.serviceBookings.length === 0) {
                  return [];
                } else {
                  // eslint-disable-line  no-else-return
                  _lodash2.default.map(serviceBookings.serviceBookings, function (service, i) {
                    if (service.serviceBookingType && service.serviceBookingType === 'localtransfer') {
                      var localtransfer_key = service.transferKey;
                      var actualTransferData = _lodash2.default.find(dbTransfers, { _key: localtransfer_key });
                      if (actualTransferData) {
                        service.localtransfer = actualTransferData; // eslint-disable-line no-param-reassign
                      }
                      updatedServiceBookings.push(service);
                    } else {
                      updatedServiceBookings.push(service);
                    }
                  });
                }
                resolve(updatedServiceBookings);
              });
            });
          }

          // console.log('serviceBookings.serviceBookings.length  ::: ' + serviceBookings.serviceBookings.length )
          // if (serviceBookings.serviceBookings.length === 0) {
          //   return [];
          // } else { // eslint-disable-line no-else-return
          //   return new Promise((resolve, reject) => { // eslint-disable-line  no-unused-vars
          //     const updatedServiceBookings = [];
          //     console.log('11 serviceBookings.serviceBookings.length  ::: ' + serviceBookings.serviceBookings.length )
          //     _.map(serviceBookings.serviceBookings, (service, i) => {
          //       if (service.serviceBookingType && service.serviceBookingType === 'localtransfer') {
          //         const localtransfer_key = service.transferKey;
          //         const actualTransferData = getTransfersByKey(localtransfer_key); // this is from transfres collection on key basis

          //         //console.log('-----actualTransferData----')
          //         //console.log( actualTransferData )

          //         actualTransferData.then((v) => {
          //           //console.log( 'A ')
          //           //console.log( v )
          //           service.localtransfer = v; // eslint-disable-line no-param-reassign
          //           updatedServiceBookings.push(service);
          //           if (i === serviceBookings.serviceBookings.length - 1) {
          //             console.log('1ret  11 ::: ' + updatedServiceBookings.length )
          //             resolve(updatedServiceBookings);
          //           }
          //         }, () => {
          //           console.log( 'ABBBBB')
          //           service.localtransfer = null; // eslint-disable-line no-param-reassign
          //           updatedServiceBookings.push(service);
          //           if (i === serviceBookings.serviceBookings.length - 1) {
          //             console.log('1ret 22  ::: ' + updatedServiceBookings.length )
          //             resolve(updatedServiceBookings);
          //           }
          //         });
          //       } else {
          //         updatedServiceBookings.push(service);
          //         if (i === serviceBookings.serviceBookings.length - 1) {
          //           console.log('1ret 33  ::: ' + updatedServiceBookings.length )
          //           resolve(updatedServiceBookings);
          //         }
          //       }
          //     });
          //   });
          // }

          // })
        }
      },
      startDate: {
        type: _graphql.GraphQLString
      },
      startDay: {
        type: _graphql.GraphQLInt
      },
      note: {
        type: _graphql.GraphQLString,
        resolve: function resolve(_ref) {
          var note = _ref.note;
          return note || '';
        }
      },
      timeSlots: {
        type: new _graphql.GraphQLList(_TimeSlot2.default),
        resolve: function resolve(_ref2) {
          var timeSlots = _ref2.timeSlots;
          return _lodash2.default.sortBy(timeSlots || [{ slotOrder: 1 }, { slotOrder: 2 }, { slotOrder: 3 }], function (timeSlot) {
            return timeSlot.slotOrder;
          });
        }
      },
      unavailableSlots: {
        type: _graphql.GraphQLString
      },
      preselections: {
        type: new _graphql.GraphQLList(TourPreselection)
      }
    };
  },
  interfaces: [_interface.nodeInterface]
});