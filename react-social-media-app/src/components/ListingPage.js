import React from 'react'
import Fetch from './../utils/fetch'
import Nav from './Nav'
import SlideShow from './SlideShow'
import {useNavigate, useSearchParams, Link} from 'react-router-dom'

export default function ListingPage(props)
{
    const [searchParams] = useSearchParams()
    
    let[listingID, setListingID] = React.useState(window.location.pathname.split("/")[2])
    let [listing, setListing] = React.useState({})
    console.log(listingID)
    React.useEffect(()=>
    {
        Fetch("listing/"+listingID, {method: "GET"}).then((response)=>
        {
            setListing(response.listing)
        })
    }, [listingID])

    let {owner, pictures, address, city, state, ZIP} = listing
    console.log(listing)

    return (
        <div>
            <Nav/>
            <div className='App' style={{alignItems: "flex-start"}}>
                <div className='rowFlex'>
                    <img src={`https://webere4870.blob.core.windows.net/react-app/${owner}`} className="profileIcon" alt="" />
                    <Link to={{pathname: "/user/"+owner}}><h6>{owner}</h6></Link>
                    <h6>|</h6>
                    <h6>{address} {city}, {state} {ZIP}</h6>
                </div>
                <SlideShow pictures={listing.pictures}/>
            </div>
        </div>
    )
}