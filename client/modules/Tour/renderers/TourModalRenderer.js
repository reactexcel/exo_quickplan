import React from 'react';
import Relay from 'react-relay';
import viewerQuery from '../../../routes/ViewerQuery';
import TourModal from '../containers/TourModal';

class ViewerRoute extends Relay.Route {
  static queries = viewerQuery;
  static routeName = 'ViewerRoute';
}

export default props => <Relay.Renderer Container={TourModal} queryConfig={new ViewerRoute(props)} environment={Relay.Store} />;
