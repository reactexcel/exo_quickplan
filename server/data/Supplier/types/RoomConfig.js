import { GraphQLObjectType, GraphQLString, GraphQLList } from 'graphql';
import { globalIdField } from 'graphql-relay';
import { nodeInterface } from '../../interface';
import PaxType from '../../Pax/types/Pax';
import { getPaxsByRoomConfigKey } from '../../Pax/controllers/Pax';

export default new GraphQLObjectType({
  name: 'RoomConfig',
  fields: () => ({
    id: globalIdField('RoomConfigs', roomConfig => roomConfig._key),
    _key: {
      type: GraphQLString
    },
    roomType: {
      type: GraphQLString
    },
    paxs: {
      type: new GraphQLList(PaxType),
      resolve: async roomConfig => await getPaxsByRoomConfigKey({ roomConfigKey: roomConfig._key }) || []
    }
  }),
  interfaces: [nodeInterface]
});
