import React from 'react'
import {useAuth0} from '@auth0/auth0-react'

export default function TokenWrapper({children})
{
    let {getAccessTokenSilently} = useAuth0()
    React.useEffect(()=>
    {
        getAccessTokenSilently()
    }, [])

    return (
    <>
        {children}
    </>)
}