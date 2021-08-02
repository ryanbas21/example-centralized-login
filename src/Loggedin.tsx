import { FRUser } from '@forgerock/javascript-sdk';
import { useState } from 'react';
import { Redirect } from 'react-router-dom';

function LoggedIn() {
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

export default LoggedIn;
