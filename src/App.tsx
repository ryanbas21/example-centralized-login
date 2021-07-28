import { FormEvent, SetStateAction, useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import {
  FRAuth,
  FRLoginFailure,
  FRLoginSuccess,
  FRStep,
  OAuth2Client,
  TokenManager,
  UserManager,
  CallbackType,
  Config,
} from '@forgerock/javascript-sdk';

import './App.css';
import { Redirect } from 'react-router-dom';

Config.set({
  clientId: 'test-app-1',
  redirectUri: 'https://ryan.example.com:1234/_callback',
  scope: 'openid',
  serverConfig: {
    baseUrl: 'https://openam-ryan-bas.forgeblocks.com/am/',
    timeout: 5000,
  },
  realmPath: 'alpha',
  tree: 'sdkAuthenticationTree',
});

function handleFatalError(err: Error) {
  console.log(err);
  return err;
}

function App() {
  const [step, setStep] = useState();
  const [username, setUsername] = useState('');
  const [pw, setPw] = useState('');
  const [error, setError] = useState();
  const [redirect, setRedirect] = useState(null);

  const handleStep = async (step: FRStep | FRLoginFailure | FRLoginSuccess) => {
    if (!step.type) return;
    switch (step.type) {
      case 'LoginSuccess': {
        try {
          await TokenManager.getTokens({ forceRenew: true });
          await UserManager.getCurrentUser();
          await OAuth2Client.getUserInfo();
          return setRedirect(step as unknown as SetStateAction<null>);
        } catch (err) {
          return err;
        }
      }
      case 'LoginFailure':
        setError(step as unknown as SetStateAction<undefined>);
        return;

      default: {
        setStep(step as unknown as SetStateAction<undefined>);
      }
    }
  };

  function nextStep(step?: FRStep) {
    // Get the next step using the FRAuth API
    FRAuth.next(step).then(handleStep).catch(handleFatalError);
  }

  const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    const nameCallback = (step as unknown as FRStep).getCallbackOfType(CallbackType.NameCallback);
    const passwordCallback = (step as unknown as FRStep).getCallbackOfType(
      CallbackType.PasswordCallback,
    );

    nameCallback.setInputValue(username);
    passwordCallback.setInputValue(pw);

    const nxtStep = nextStep(step);
    setStep(nxtStep as SetStateAction<undefined>);
  };

  useEffect(() => {
    nextStep();
  }, []);

  return redirect ? (
    <Redirect push to="/success" />
  ) : (
    <div className="App">
      <form id="my-form" onSubmit={handleSubmit}>
        <div id="Error">{error}</div>
        <div className="mb-2" id="UsernamePassword">
          <label className="form-label" htmlFor="username">
            Username
          </label>
          <input
            className="form-control"
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <label className="form-label" htmlFor="password">
            Password
          </label>
          <input
            className="form-control"
            type="password"
            id="password"
            value={pw}
            onChange={(e) => setPw(e.target.value)}
          />
          <button type="submit" className="btn btn-primary">
            Login
          </button>
        </div>
      </form>
    </div>
  );
}

export default App;
