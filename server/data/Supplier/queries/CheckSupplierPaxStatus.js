import { GraphQLString, GraphQLList } from 'graphql';
import * as accommodationCtrl from '../controllers/Supplier';
import PaxStatuses from '../../Pax/types/PaxStatuses';

export default {
  checkSupplierPaxStatus: {
    type: new GraphQLList(PaxStatuses),
    args: {
      cityBookingKey: {
        type: GraphQLString
      },
      tripKey: {
        type: GraphQLString
      },
      roomConfigKey: {
        type: GraphQLString
      }
    },
    resolve: async (_, args) => await accommodationCtrl.checkPaxStatus(args) || []
  }
};
