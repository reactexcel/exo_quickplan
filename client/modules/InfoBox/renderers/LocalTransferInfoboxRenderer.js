import React from 'react';
import Relay from 'react-relay';
import viewerQuery from '../../../routes/ViewerQuery';
import LocalTransferInfobox from '../containers/LocalTransferInfobox';

class ViewerRoute extends Relay.Route {
  static queries = viewerQuery;
  static routeName = 'ViewerRoute';
}

export default props => <Relay.Renderer Container={LocalTransferInfobox} queryConfig={new ViewerRoute(props)} environment={Relay.Store} />;
