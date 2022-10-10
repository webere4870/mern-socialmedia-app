import React from 'react'
import {Route, Navigate} from 'react-router-dom'
import {withAuthenticationRequired, useAuth0} from '@auth0/auth0-react'

export default function ProtectedRoute({children,path})
{
    const auth = useAuth0()
    console.log(children)
    if(auth.isAuthenticated)
    {
        console.log("Should children")
        return (children)
    }
    else
    {
        <Navigate to={"/login"}/>
    }
}