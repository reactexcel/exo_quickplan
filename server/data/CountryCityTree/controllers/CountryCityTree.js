import request, { POST } from '../../../utils/request';

async function getTree(args) {
  const result = await request('http://localhost:8529/_db/exo-dev/bbt/trips/get-trip-country-city-tree', POST, args);
  return result;
}

async function mutateTree(args) {
  const _args = { tree: JSON.parse(args.Tree), tripKey: args.tripKey, clientMutationId: args.clientMutationId };
  const result = await request('http://localhost:8529/_db/exo-dev/bbt/trips/mutate-trip-country-city-tree', POST, _args);
  return result;
}

export {
  getTree,
  mutateTree
};
