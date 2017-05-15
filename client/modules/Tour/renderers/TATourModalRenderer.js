import React from 'react';
import Relay from 'react-relay';
import viewerQuery from '../../../routes/ViewerQuery';
import TATourModal from '../containers/TATourModal';

class ViewerRoute extends Relay.Route {
  static queries = viewerQuery;
  static routeName = 'ViewerRoute';
}

export default props => <Relay.Renderer Container={TATourModal} queryConfig={new ViewerRoute(props)} environment={Relay.Store} />;
