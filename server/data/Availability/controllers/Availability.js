import request, { POST } from '../../../utils/request';
import config from '../../../config/environment';

function getTourAvailability(args) {
  return request(`${config.foxx.url}/touravailability`, POST, {
    ...args
  });
}

function getTransferAvailability(args) {
  const agentID = config.agent.id;
  const password = config.agent.password;
  const result = request(`${config.foxx.url}/servicebooking/check-services-availability`, POST, {
    id: args.transferPlacementId
  });
  return result;
  // return request(`${config.foxx.url}/transferavailability`, POST, {
  //   agentID,
  //   password,
  //   ...args
  // });
}

export { getTourAvailability, getTransferAvailability };
