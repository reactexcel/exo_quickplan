import React from 'react';
import Relay from 'react-relay';
import Transfer from '../containers/Transfer';

class ViewerRoute extends Relay.Route {
  static queries = {
    transfer: () => Relay.QL`
      query {
        node(id: $transferId)
      }
    `
  };
  static routeName = 'ViewerRoute';
}

export default props => <Relay.Renderer Container={Transfer} queryConfig={new ViewerRoute(props)} environment={Relay.Store} />;
