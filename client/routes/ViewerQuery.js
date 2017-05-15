import Relay from 'react-relay';

export default {
  viewer: (Component, variables) => Relay.QL`
    query {
      viewer {
        ${Component.getFragment('viewer', variables)}
      }
    }
  `,
};
