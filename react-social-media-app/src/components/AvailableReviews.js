import React from "react"
import Fetch from './../utils/fetch'

export default function AvailableReviews(props)
{
    // Minimum viable product
    let {listingsArr} = props
    let [listings, setListings] = React.useState([])

    React.useEffect(()=>
    {
        Fetch("listingsArray", {method: "POST", headers: {"Content-Type": "application/json"}, body: JSON.stringify({listings: listingsArr})}).then((response)=>
        {
            setListings(response.listings)
        })
    }, [])

    let listingsMap = listings?.map((temp)=>
    {
        return (
            <div className="ALRow">
                
            </div>
        )
    })

    return (
    <div id="availableReviews" className="tile">

    </div>)
}