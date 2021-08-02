import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Switch, Route, NavLink } from 'react-router-dom';

import Home from './App';
import Loggedin from './Loggedin';
import './index.css';
import { Config } from '@forgerock/javascript-sdk';
import LoginViaPlatform from './components/LoginViaPlatform';

Config.set({
  clientId: 'test-app-1',
  support: 'legacy',
  redirectUri: 'https://ryan.example.com:1234/_callback',
  scope: 'openid',
  serverConfig: {
    baseUrl: 'https://openam-ryan-bas.forgeblocks.com/am/',
    timeout: 5000,
  },
  realmPath: 'alpha',
  tree: 'sdkAuthenticationTree',
});

const App = () => (
  <Router>
    <Switch>
      <Route path="/success">
	<Loggedin />
      </Route>
      <Route path="/embeded">
        <Home />
      </Route>
      <Route path="/">
	<>
	  <NavLink to="/embeded"> 
	    <button>Embeded Login</button>
	  </NavLink> 
	  <h3>Or</h3>
	  <LoginViaPlatform />
	</>
      </Route>
    </Switch>
  </Router>
);

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root'),
);
