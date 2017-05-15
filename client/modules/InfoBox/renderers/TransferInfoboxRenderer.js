import React from 'react';
import Relay from 'react-relay';
import TransferInfobox from '../containers/TransferInfobox';

class ViewerRoute extends Relay.Route {
  static queries = {
    viewer: () => Relay.QL`
      query {
        node(id: $transferPlacementId)
      }
    `,
    availability: (Component, variables) => Relay.QL`
      query {
        viewer {
          ${Component.getFragment('availability', variables)}
        }
      }
    `
  };
  static routeName = 'ViewerRoute';
}

export default props => <Relay.Renderer Container={TransferInfobox} queryConfig={new ViewerRoute(props)} environment={Relay.Store} />;
