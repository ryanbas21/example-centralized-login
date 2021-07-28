import { FRStep, FRUser } from '@forgerock/javascript-sdk/lib';
import { useState } from 'react';
import { Redirect, RouteComponentProps } from 'react-router-dom';
import { Config } from '@forgerock/javascript-sdk/lib';

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

export default (props: RouteComponentProps<any>) => {
  const [redirect, setRedirect] = useState(false);

  const handleClick = async (_e: any): Promise<void> => {
    await FRUser.logout();
    setRedirect(true);
  };

  return !redirect ? (
    <>
      <h1>Logged in Successfully!</h1>
      <button onClick={handleClick} type="submit" id="logout">
        Logout
      </button>
    </>
  ) : (
    <Redirect to="/" />
  );
};
