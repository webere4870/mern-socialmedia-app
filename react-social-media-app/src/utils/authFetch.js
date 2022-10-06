async function authFetch(endpoint, reqOptions)
{
    var options = { method: 'POST',
  headers: { 'content-type': 'application/json' },
  body: JSON.stringify({"client_id":process.env.REACT_APP_TEST_AUTH0_CLIENT_ID,"client_secret":process.env.REACT_APP_TEST_AUTH0_CLIENT_SECRET,"audience":"http://localhost:5000","grant_type":"client_credentials"}) };
    fetch("https://dev-3vss267m.us.auth0.com/oauth/token", options).then((res)=>
    {
        res.json().then((response)=>
        {
            console.log(response)
        })
    })
}