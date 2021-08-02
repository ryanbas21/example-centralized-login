import { MouseEventHandler, useEffect, useState } from 'react';
import { TokenManager, UserManager } from '@forgerock/javascript-sdk';
import { Redirect } from 'react-router-dom';

// interface LoginPlatformProps {
// }

function LoginViaPlatform(): JSX.Element {
  const [redirect, setRedirect] = useState(false);
  const url = new URL(document.location as unknown as string);
  const params = url.searchParams;
  
  const handleLogin: MouseEventHandler<HTMLButtonElement> = async (e) => {
    e.preventDefault();
    await TokenManager.getTokens({ clientId: 'test-app-central-login', forceRenew: true, login: 'redirect' });
    await UserManager.getCurrentUser();
  };

  useEffect(() => {
    const asyncEffect = async () => {
    const authCode = params.get('code');
    const state = params.get('state');

      /**
       *  When the user return to this app after successfully logging in,
       * the URL will include code and state query parameters that need to
       * be passed in to complete the OAuth flow giving the user access
       */
      if (authCode && state)  {
	console.log('here', authCode, state)
	await TokenManager.getTokens({ 
	  clientId: 'test-app-central-login', 
	  forceRenew: true, 
	  login: 'redirect', 
	  query: { code: authCode,  state  } 
	});
	setRedirect(true);
      }
    };

     asyncEffect();
  }, []);

  return redirect ? <Redirect to="/success" /> : <button onClick={handleLogin}>Login via Platform</button>;
}

export default LoginViaPlatform;
