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
} from '@forgerock/javascript-sdk';
import { Redirect } from 'react-router-dom';

import LoginViaPlatform from './components/LoginViaPlatform';
import AreYouHuman from './components/AreYouHuman';
import UsernameFields from './components/Username';
import PasswordField from './components/Password';
import './App.css';

function handleFatalError(err: Error) {
  console.log('we hit an error', err);
  return err;
}

function App() {
  const [step, setStep] = useState();
  const [username, setUsername] = useState('');
  const [human, setHuman] = useState(1);
  const [data, setData] = useState<{
    callbacks: any[];
    payload: {
      header: string;
      description: string;
    };
  }>({
    payload: {
      header: '',
      description: '',
    },
    callbacks: [],
  });
  const [pw, setPw] = useState('');
  const [error, setError] = useState();
  const [redirect, setRedirect] = useState(false);

  const handleStep = async (step: FRStep | FRLoginFailure | FRLoginSuccess) => {
    if (!step.type) return;

    switch (step.type) {
      case 'LoginSuccess': {
        try {
          const tokens = await TokenManager.getTokens({
            forceRenew: true,
            login: 'redirect',
          });
          await TokenManager.getTokens({ query: {} });
          await UserManager.getCurrentUser();
          await OAuth2Client.getUserInfo();
          return setRedirect(true);
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

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();

    if (data.callbacks[0].payload.type === 'ChoiceCallback') {
      const choiceCallback = (step as unknown as FRStep).getCallbackOfType(
        CallbackType.ChoiceCallback,
      );
      choiceCallback.setInputValue(human);
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

  const componentMap: Record<string, (a: any) => JSX.Element> = {
    PasswordCallback: (props: any) => (
      <PasswordField key={props.type} pw={pw} setPw={setPw} {...props} />
    ),
    NameCallback: (props: any) => (
      <UsernameFields key={props.type} username={username} setUsername={setUsername} {...props} />
    ),
    ChoiceCallback: (props: any) => (
      <AreYouHuman key={props.type} human={human} setHuman={setHuman} {...props} />
    ),
  };

  if (error) return <div>Login Error</div>;
  if (redirect) return <Redirect push to="/success" />;
  if (data && !data.callbacks) return <>Logging In...</>;
  if (data && data.callbacks && !data.callbacks.length) return <>Loading...</>;

  return (
    <div className="App">
      <h1 id="heading">{data.payload.header}</h1>
      <form id="my-form" onSubmit={handleSubmit}>
        <div id="Error">{error}</div>
        <div className="mb-2" id="UsernamePassword">
          {data &&
            data.callbacks
              .map((v: { payload: { type: string } }) => componentMap[v.payload.type](v))
              .reverse()}
        </div>
        <button type="submit" className="btn btn-primary">
          Login
        </button>
        {<div dangerouslySetInnerHTML={{ __html: data.payload.description }}></div>}
      </form>
      <h3>Or</h3>
      <LoginViaPlatform setRedirect={setRedirect} />
    </div>
  );
}

export default App;
