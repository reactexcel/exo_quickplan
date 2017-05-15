import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import Relay from 'react-relay';
import RelayNetworkDebug from 'react-relay/lib/RelayNetworkDebug';
import { browserHistory, applyRouterMiddleware, Router } from 'react-router';
import useRelay from 'react-router-relay';
import { RelayNetworkLayer, authMiddleware } from 'react-relay-network-layer';
import Route from './routes/Route';

// Requires theme assets
require('materialize-css/dist/js/materialize');
require('./assets/tpl/js/_con');

RelayNetworkDebug.init();


Relay.injectNetworkLayer(new RelayNetworkLayer([
  next => (req) => {
    const timeout = window.setTimeout(() => $('#loading').show(), 1000);
    return next(req).then((res) => {
      window.clearTimeout(timeout);
      $('#loading').hide();
      return res;
    });
  },
  authMiddleware({
    token: localStorage.getItem('id_token'),
    tokenRefreshPromise: () => Promise.resolve(localStorage.getItem('id_token'))
  })
], { disableBatchQuery: true }));


const rootNode = document.getElementById('app');

ReactDOM.render(
  <Router history={browserHistory} routes={Route} render={applyRouterMiddleware(useRelay)} environment={Relay.Store} />,
  rootNode
);

if (module.hot) {
  module.hot.accept();
}
