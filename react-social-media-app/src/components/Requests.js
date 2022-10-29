import React from "react";
import AuthFetch from "../utils/authFetch";
import { useAuth0 } from "@auth0/auth0-react";
import Fetch from './../utils/fetch'
import { Link } from "react-router-dom";

export default function Requests(props)
{
    const {getAccessTokenSilently} = useAuth0()
    let [requests, setRequests] = React.useState()
    let [properties, setProperties] = React.useState()

    React.useEffect(()=>
    {
        console.log("Here")
        AuthFetch("tenantRequests", {method: "GET", headers: {}}, getAccessTokenSilently).then((response)=>
        {
            console.log(response)
            setRequests(response.leases)
            let propertyList = response.leases.map((temp)=>temp.property)
            Fetch("listingsArray", {method: "POST", headers: {"Content-Type": "application/json"}, body: JSON.stringify({listings: propertyList})}).then((response)=>
            {
                setProperties(response.listings)
            })
        })
    }, [])

    console.log(requests, properties)

    let requestMap = requests?.map((temp)=>
    {
        let property = properties?.find((temper)=>temper._id == temp.property)
        return (
        <div className="requestRow">
            <div className="requestImage" style={{backgroundImage: `url(https://webere4870.blob.core.windows.net/react-app/${property?.pictures[0]})`}} >
                <div className="overProfileRequest">
                    <div className="profileToRequest" style={{backgroundImage: `url(https://webere4870.blob.core.windows.net/react-app/${temp?.tenant})`, backgroundSize: 'cover'}}>

                    </div> 
                </div>
                
            </div>
            <div className="colFlex" style={{gap: "-5px"}}>
                <p>${temp?.price}</p>
                <p>{property?.address}</p>
                <Link to={"/user/"+temp?.tenant}><p style={{margin: "unset"}} className="link">{temp?.tenant}</p></Link>
                <p>{new Date(temp?.startDate)?.toDateString()} &#x2014; {new Date(temp?.endDate)?.toDateString()}</p>
                <div className="btnRow"><button>Accept</button><button className="whiteBtn">Decline</button></div>
            </div>
        </div>)
    })

    return (
    <div id="incomingRequests" className="tile">
        {requestMap}
    </div>)
}