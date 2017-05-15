import React from 'react';
import Relay from 'react-relay';
import viewerQuery from '../../../routes/ViewerQuery';
import TAAccommodationModal from '../containers/TAAccommodationModal';

class ViewerRoute extends Relay.Route {
  static queries = viewerQuery;
  static routeName = 'ViewerRoute';
}

export default props => <Relay.Renderer Container={TAAccommodationModal} queryConfig={new ViewerRoute(props)} environment={Relay.Store} />;
