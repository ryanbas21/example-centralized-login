// import { Config } from '@forgerock/javascript-sdk/lib';
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import Home from './App';
import Loggedin from './Loggedin';
import './index.css';
import reportWebVitals from './reportWebVitals';
import { Config } from '@forgerock/javascript-sdk';

Config.set({
  clientId: 'test-app-central-login',
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
      <Route path="/success" render={() => <Loggedin />} />
      <Route path="/">
        <Home />
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

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals(console.log);
