import React from 'react';
import { IndexRoute, Route, Redirect } from 'react-router';
import ViewerQuery from './ViewerQuery';
import App from '../modules/App/containters/App';
import TripPlannerContainer from '../modules/TripPlanner/containers/TripPlanner';
import NewTripComponent from '../modules/Trip/components/NewTrip';
import ProposalComponent from '../modules/Proposal/containers/Proposal';
import Workqueue from '../modules/Workqueue/WorkqueueContainer';
import PublishedTrip from '../modules/ItinerarySummary/Trip/containers/Trip';
import AuthService from '../services/auth';
import Login from '../modules/Login/Login';
import config from '../../server/config/environment';
import TreeView from '../modules/CountryCityTree/containers/CountryCityTree';

const auth = new AuthService(config.auth.clientId, config.auth.domain);

const requireAuth = (nextState, replace) => {
  if (auth.parseHash(nextState.location.hash) &&
    window.location.href !== localStorage.getItem('pathname_to_redirect')
  ) {
    replace(localStorage.getItem('pathname_to_redirect'));
  }

  if (!auth.loggedIn()) {
    localStorage.setItem('pathname_to_redirect', location.pathname);
    replace({ pathname: '/login' });
  }
};


export default (
  <Route>
    <Route
      path='/login'
      component={Login}
      auth={auth}
    />
    <Route
      path='/'
      component={App}
      queries={ViewerQuery}
      auth={auth}
      prepareParams={prevParams => ({ ...prevParams, userToken: auth.getAccessToken() })}
    >
      <Route
        path='/itinerary_summary/:proposalKey/:tripKey'
        component={PublishedTrip}
        queries={ViewerQuery}
        prepareParams={prevParams => ({ ...prevParams, userToken: auth.getAccessToken() })}
      />
      <Route onEnter={requireAuth}>
        <IndexRoute
          component={Workqueue}
          queries={ViewerQuery}
          prepareParams={prevParams => ({ ...prevParams, userToken: auth.getAccessToken() })}
        />
        <Route path='/newtrip' component={NewTripComponent} />
        <Route
          path='/workqueue'
          component={Workqueue}
          queries={ViewerQuery}
          prepareParams={prevParams => ({ ...prevParams, userToken: auth.getAccessToken() })}
        />
        <Route path='/trip-planner/:proposalKey' component={ProposalComponent} queries={ViewerQuery} />
        <Route path='/trip-planner/:proposalKey/:tripKey' component={TripPlannerContainer} queries={ViewerQuery} />
      </Route>
      <Redirect from='*' to='/' />
    </Route>
  </Route>
);
