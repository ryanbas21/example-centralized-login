import { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import LoggedIn from './Loggedin';
import {
  Config,
  FRAuth,
  FRLoginFailure,
  FRLoginSuccess,
  FRStep,
  OAuth2Client,
  TokenManager,
  UserManager,
  CallbackType,
} from '@forgerock/javascript-sdk';

import './App.css';

function App() {
  const [loggedIn, setLogin] = useState(false);

  const FATAL = 'FATAL';
  function handleFatalError(err: Error) {
    console.log(err);
    return err;
  }

  function nextStep(step: FRStep) {
    console.log('step: ', step);
    // Get the next step using the FRAuth API
    FRAuth.next(step).then(handleStep).catch(handleFatalError);
  }

  const handlers = {
    UsernamePassword: (step: FRStep) => {
      document.querySelector('.btn')?.addEventListener('click', (e) => {
        e.preventDefault();
        const nameCallback = step.getCallbackOfType(CallbackType.NameCallback);
        const passwordCallback = step.getCallbackOfType(CallbackType.PasswordCallback);

        nameCallback.setInputValue(document.querySelector('input[type=text]')?.nodeValue ?? '');
        passwordCallback.setInputValue(
          document.querySelector('input[type=password]')?.nodeValue ?? '',
        );

        nextStep(step);
      });
    },
    Error: (step: FRStep | FRLoginFailure | FRLoginSuccess) => {
      document.querySelector('#Error')!.innerHTML =
        step?.payload?.message + ' ' + step.payload.reason ?? '';
    },
    [FATAL]: (_step: FRStep) => {},
  };

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

  const getStage = (step: FRStep) => {
    // Check if the step contains callbacks for capturing username and password
    const usernameCallbacks = step.getCallbacksOfType(CallbackType.NameCallback);
    const passwordCallbacks = step.getCallbacksOfType(CallbackType.PasswordCallback);

    if (usernameCallbacks.length && passwordCallbacks.length) {
      return 'UsernamePassword';
    }

    return undefined;
  };

  async function handleStep(step: FRStep | FRLoginFailure | FRLoginSuccess) {
    if (!step.type) return;

    switch (step.type) {
      case 'LoginSuccess': {
        try {
          const tokens = await TokenManager.getTokens({ forceRenew: true });
          const user = await UserManager.getCurrentUser();
          const info = await OAuth2Client.getUserInfo();
          const data = { info, user, tokens };
          setLogin(true);
          return data;
        } catch (err) {
          return err;
        }
      }
      case 'LoginFailure':
        handlers['Error'](step);
        return;

      default:
        const stage = getStage(step as FRStep) || FATAL;
        return stage === FATAL ? handlers[FATAL](step as FRStep) : handlers[stage](step as FRStep);
    }
  }

  return (
    <div className="App">
      {loggedIn ? (
        <form id="my-form">
          <div id="Error"></div>
          <div className="mb-2" id="UsernamePassword">
            <label className="form-label" htmlFor="username">
              Username
            </label>
            <input className="form-control" type="text" id="username" />
            <label className="form-label" htmlFor="password">
              Password
            </label>
            <input className="form-control" type="password" id="password" />
            <button type="submit" className="btn btn-primary">
              Login
            </button>
          </div>
        </form>
      ) : (
        <LoggedIn />
      )}
    </div>
  );
}

export default App;
