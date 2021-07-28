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
  console.log('we hit an error', err);
  return err;
}

function App() {
  const [step, setStep] = useState();
  const [username, setUsername] = useState('');
  const [human, setHuman] = useState(1);
  const [data, setData] = useState({ callbacks: [] });
  const [pw, setPw] = useState('');
  const [error, setError] = useState();
  const [redirect, setRedirect] = useState(null);

  const handleStep = async (step: FRStep | FRLoginFailure | FRLoginSuccess) => {
    if (!step.type) return;

    console.log(step.type);
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
    FRAuth.next(step)
      .then((v) => {
        setData(v as unknown as SetStateAction<any>);
        return v;
      })
      .then(handleStep)
      .catch(handleFatalError);
  }

  const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    if (data.callbacks[0].payload.type === 'ChoiceCallback') {
      const choiceCallback = (step as unknown as FRStep).getCallbackOfType(
        CallbackType.ChoiceCallback,
      );
      console.log('human value', human);
      choiceCallback.setInputValue(human);
      // setData({ callbacks: [] });
    } else {
      const nameCallback = (step as unknown as FRStep).getCallbackOfType(CallbackType.NameCallback);
      const passwordCallback = (step as unknown as FRStep).getCallbackOfType(
        CallbackType.PasswordCallback,
      );

      nameCallback.setInputValue(username);
      passwordCallback.setInputValue(pw);
    }

    const nxtStep = nextStep(step);
    setStep(nxtStep as SetStateAction<undefined>);
  };

  useEffect(() => {
    nextStep();
  }, []);

  const componentMap: Record<string, JSX.Element> = {
    PasswordCallback: <PasswordField pw={pw} setPw={setPw} />,
    NameCallback: <UsernameFields username={username} setUsername={setUsername} />,
    ChoiceCallback: <AreYouHuman human={human} setHuman={setHuman} />,
  };
  if (error) return <div>Login Error</div>;
  if (redirect) return <Redirect push to="/success" />;
  if (data && !data.callbacks) return 'Logging In...';
  if (data && data.callbacks && !data.callbacks.length) return 'loading...';

  return (
    <div className="App">
      <form id="my-form" onSubmit={handleSubmit}>
        <div id="Error">{error}</div>
        <div className="mb-2" id="UsernamePassword">
          {data &&
            data.callbacks
              .map((v: { payload: { type: string } }) => {
                console.log('type', v.payload.type);
                return componentMap[v.payload.type];
              })
              .reverse()}
          <button type="submit" className="btn btn-primary">
            Login
          </button>
        </div>
      </form>
    </div>
  );
}

interface AreYouHumanProps {
  human: number;
  setHuman: any;
}
function AreYouHuman({ human, setHuman }: AreYouHumanProps) {
  return (
    <div>
      <label htmlFor={'Yes'}>Yes</label>
      <input
        id="Yes"
        checked={!Boolean(human)}
        type="radio"
        value={0}
        onClick={() => setHuman(0)}
      />

      <label htmlFor={'No'}>No</label>
      <input id="No" checked={Boolean(human)} type="radio" value={1} onClick={() => setHuman(1)} />
    </div>
  );
}

interface PasswordProps {
  pw: string;
  setPw: (a: string) => void;
}
function PasswordField({ pw, setPw }: PasswordProps) {
  return (
    <>
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
    </>
  );
}

interface UsernameProps {
  username: string;
  setUsername: (a: string) => void;
}
function UsernameFields({ username, setUsername }: UsernameProps) {
  return (
    <>
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
    </>
  );
}

export default App;
