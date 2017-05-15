import { GraphQLString, GraphQLList, GraphQLNonNull } from 'graphql';
import { mutationWithClientMutationId, fromGlobalId } from 'graphql-relay';
import RoomConfigType from '../../Supplier/types/RoomConfig';
import { updateRoomConfig, updatePAXStatuses } from '../controllers/Supplier';

export default mutationWithClientMutationId({
  name: 'UpdateRoomConfig',
  inputFields: {
    roomType: {
      type: GraphQLString
    },
    paxKeys: {
      type: new GraphQLList(GraphQLString)
    },
    roomConfigId: {
      type: new GraphQLNonNull(GraphQLString)
    }
  },
  outputFields: {
    roomConfig: {
      type: RoomConfigType,
      resolve: savedDoc => savedDoc
    }
  },
  mutateAndGetPayload: async ({ roomConfigId, roomType, paxKeys }) => {
    const roomConfigKey = fromGlobalId(roomConfigId).id;
    const res = await updateRoomConfig({ roomConfigKey, roomType, paxKeys });
    try {
      await updatePAXStatuses({ roomConfigKey }); // added in try catch since return result thorws error, also return is not used
    } catch (ex) { // eslint-disable-line no-empty

    }
    return res;
  }
});
