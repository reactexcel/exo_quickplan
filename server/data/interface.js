/* eslint-disable no-undef */
import { fromGlobalId, nodeDefinitions } from 'graphql-relay';

/**
 * We get the node interface and field from the Relay library.
 *
 * The first method defines the way we resolve an ID to its object.
 * The second defines the way we resolve an object to its GraphQL type.
 */
export const { nodeInterface, nodeField } = nodeDefinitions(
  (globalId) => {
    const { type, id } = fromGlobalId(globalId);

    // Automatically import a controller and call a get function
    // Each type should have a controllers/<TypeName>  which implements a get<TypeName>(id) function
    if (type !== null && type !== '') {
      try {
        const controller = require(`./${type}/controllers/${type}`);
        return controller[`get${type}`](id).then(res => ({ type, ...res }));
      } catch (e) {
        console.log(e.stack);
        return null;
      }
    } else {
      return null;
    }
  },
  ({ type }) => {
    // Automatically return a correct type
    // Each type should implement <TypeName>/types/<TypeName>
    try {
      return require(`./${type}/types/${type}`).default;
    } catch (e) {
      console.log(e.stack);
      return null;
    }
  }
);
