import React from 'react';
import Relay from 'react-relay';
import Country from '../containers/Country';

class ViewerRoute extends Relay.Route {
  static queries = {
    country: () => Relay.QL`
      query {
        node(id: $countryId)
      }
    `
  };

  static routeName = 'ViewerRoute';
}

export default props => <Relay.Renderer Container={Country} queryConfig={new ViewerRoute(props)} environment={Relay.Store} />;
