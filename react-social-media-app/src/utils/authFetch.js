import React from 'react'
import {useAuth0} from '@auth0/auth0-react'
import Fetch from './fetch'

export default async function AuthFetch(endpoint, options, getToken)
{
    
    let token = await getToken({scope: "read:current_user openid profile email", audience: process.env.REACT_APP_AUTH0_AUDIENCE})

    return token
    
}