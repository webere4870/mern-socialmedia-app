import React from 'react'
import {useAuth0} from '@auth0/auth0-react'
import Fetch from './fetch'

export default function AuthFetch(endpoint, options)
{
    const isAuth = useAuth0().isAuthenticated
    useAuth0().getAccessTokenSilently({scope: "read:current_user openid profile email", audience: process.env.REACT_APP_AUTH0_AUDIENCE}).then((response)=>
    {
        if(isAuth)
        {
            const localFetch = Fetch
            options.header["Authorization"]="Bearer " + response
            localFetch(endpoint, options).then((response)=>
            {
                return response
            })
        }
    })
}