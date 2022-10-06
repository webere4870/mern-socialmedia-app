import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Auth0Provider } from '@auth0/auth0-react'



export default function Auth0({children})
{
    const domain = process.env.REACT_APP_AUTH0_DOMAIN;
    const clientId = process.env.REACT_APP_AUTH0_CLIENT_ID;
    const history = useNavigate();
    const onRedirectCallback = (appState) => {
        history.push(appState?.returnTo || window.location.pathname);
    };
    return (
        <Auth0Provider
            domain={domain}
            clientId={clientId}
            redirectUri={window.location.origin}
            onRedirectCallback={onRedirectCallback}
            audience={process.env.REACT_APP_AUTH0_AUDIENCE}>
            {children}
        </Auth0Provider>
    )
}