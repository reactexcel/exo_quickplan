import React from 'react';
import Relay from 'react-relay';
import TransferModal from '../containers/TransferModal';

class ViewerRoute extends Relay.Route {
  static queries = {
    transferPlacement: () => Relay.QL`
      query {
        node(id: $transferPlacementId)
      }
    `,
    city: () => Relay.QL`
      query {
        node(id: $cityBookingId)
      }
    `,
    viewer: (Component, variables) => Relay.QL`
      query {
        viewer {
          ${Component.getFragment('viewer', variables)}
        }
      }
    `
  };
  static routeName = 'ViewerRoute';
}

export default props => <Relay.Renderer Container={TransferModal} queryConfig={new ViewerRoute(props)} environment={Relay.Store} />;
