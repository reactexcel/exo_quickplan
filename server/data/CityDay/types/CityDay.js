import _ from 'lodash';
import { GraphQLObjectType, GraphQLString, GraphQLList, GraphQLInt } from 'graphql';
import { globalIdField } from 'graphql-relay';
import ServiceBookingType from '../../ServiceBooking/types/ServiceBooking';
import { nodeInterface } from '../../interface';
import { getTransfersByKey, getAllDBTransfers } from '../../TransferPlacement/controllers/TransferPlacement';
import TimeSlot from './TimeSlot';

const TourPreselection = new GraphQLObjectType({
  name: 'TourPreselection',
  fields: {
    startSlot: {
      type: GraphQLInt
    },
    tourId: {
      type: GraphQLString
    }
  }
});

export default new GraphQLObjectType({
  name: 'CityDay',
  description: 'The city day object in quickplan',
  fields: () => ({
    id: globalIdField('CityDay', day => day._key),
    _key: {
      type: GraphQLString,
      description: 'Unique city day ID.'
    },
    serviceBookings: {
      type: new GraphQLList(ServiceBookingType),
      resolve: (serviceBookings) => {
        if (serviceBookings.serviceBookings.length === 0) {
          return [];
        } else { // eslint-disable-line  no-else-return
          return new Promise((resolve, reject) => { // eslint-disable-line  no-unused-vars
            const allDBTransfers = getAllDBTransfers();
            return allDBTransfers.then((dbTransfers) => { // eslint-disable-line consistent-return
              const updatedServiceBookings = [];
              if (serviceBookings.serviceBookings.length === 0) {
                return [];
              } else { // eslint-disable-line  no-else-return
                _.map(serviceBookings.serviceBookings, (service, i) => {
                  if (service.serviceBookingType && service.serviceBookingType === 'localtransfer') {
                    const localtransfer_key = service.transferKey;
                    const actualTransferData = _.find(dbTransfers, { _key: localtransfer_key });
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
      type: GraphQLString
    },
    startDay: {
      type: GraphQLInt
    },
    note: {
      type: GraphQLString,
      resolve: ({ note }) => note || ''
    },
    timeSlots: {
      type: new GraphQLList(TimeSlot),
      resolve: ({ timeSlots }) => _.sortBy(timeSlots ||
        [
          { slotOrder: 1 },
          { slotOrder: 2 },
          { slotOrder: 3 }
        ], timeSlot => timeSlot.slotOrder)
    },
    unavailableSlots: {
      type: GraphQLString
    },
    preselections: {
      type: new GraphQLList(TourPreselection)
    }
  }),
  interfaces: [nodeInterface]
});
