import React from 'react'
import {useAuth0} from '@auth0/auth0-react'
import Fetch from './../utils/fetch'

export default function TokenWrapper({children})
{
    const {getAccessTokenSilently, isAuthenticated} = useAuth0()
    React.useEffect(()=>
    {
        getAccessTokenSilently({scope: "read:current_user openid profile email", audience: process.env.REACT_APP_AUTH0_AUDIENCE}).then((token)=>
        {
            console.log(token)
            if(isAuthenticated)
            {
                const localFetch = Fetch
                localFetch("findOrCreate", {method: "POST", headers: {"Authorization": "Bearer "+token}})
            }
        })
        
    }, [isAuthenticated])

    return (
    <>
        {children}
    </>)
}