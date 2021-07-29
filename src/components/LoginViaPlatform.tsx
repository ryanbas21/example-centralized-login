import { MouseEventHandler, useEffect } from 'react';
import { TokenManager, UserManager } from '@forgerock/javascript-sdk';

interface LoginPlatformProps {
  setRedirect: (a: boolean) => void;
}

function LoginViaPlatform({ setRedirect }: LoginPlatformProps): JSX.Element {
  const url = new URL(document.location as unknown as string);
  const params = url.searchParams;
  const authCode = params.get('code');
  const state = params.get('state');

  const handleLogin: MouseEventHandler<HTMLButtonElement> = async (e) => {
    e.preventDefault();
    const tokens = await TokenManager.getTokens({ forceRenew: false, login: 'redirect' });
    const user = await UserManager.getCurrentUser();
    console.log('after login calls', { tokens, user });
  };

  useEffect(() => {
    const asyncEffect = async () => {
      /**
       *  When the user return to this app after successfully logging in,
       * the URL will include code and state query parameters that need to
       * be passed in to complete the OAuth flow giving the user access
       */
      await TokenManager.getTokens({ query: { code: authCode as string, state: state as string } });
      await UserManager.getCurrentUser();
      setRedirect(true);
    };

    if (authCode && state) asyncEffect();
  }, [state, authCode]);

  return <button onClick={handleLogin}>Login via Platform</button>;
}

export default LoginViaPlatform;
