import React from 'react'
import Fetch from './../utils/fetch'
import Nav from './Nav'
import SlideShow from './SlideShow'
import RentalRequest from './RentalRequest'
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
            <div className='App'>
                <div id="listingPage">
                    <h1>Name of the Place</h1>
                    <div className='rowFlex' style={{width: "100%"}}>
                    <p>4.7</p>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-star-fill" viewBox="0 0 16 16">
                    <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"/>
                    </svg>
                    <div className="breaker"></div>
                        {/* <img src={`https://webere4870.blob.core.windows.net/react-app/${owner}`} className="profileIcon" alt="" />
                        <Link to={{pathname: "/user/"+owner}}><h6>{owner}</h6></Link> */}
                        <Link to={"#"}><h6 className="linker">197 reviews</h6></Link>
                        <div className="breaker"></div>
                        <h6>{city}, {state}</h6>
                        <div id='farSide'>
                            <div className="rowFlex linker" style={{gap: "15px"}}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-share" viewBox="0 0 16 16">
                            <path d="M13.5 1a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zM11 2.5a2.5 2.5 0 1 1 .603 1.628l-6.718 3.12a2.499 2.499 0 0 1 0 1.504l6.718 3.12a2.5 2.5 0 1 1-.488.876l-6.718-3.12a2.5 2.5 0 1 1 0-3.256l6.718-3.12A2.5 2.5 0 0 1 11 2.5zm-8.5 4a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zm11 5.5a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3z"/>
                            </svg>
                                <h6>Share</h6>
                            </div>
                            <div className="rowFlex linker" style={{gap: "15px"}}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-heart" viewBox="0 0 16 16">
                            <path d="m8 2.748-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01L8 2.748zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143c.06.055.119.112.176.171a3.12 3.12 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15z"/>
                            </svg>
                            <h6>Save</h6>
                            </div>
                        </div>
                    </div>
                    <div id="imageGrid">
                        <div id="mainPhoto" className='pictureGridStyle' style={{backgroundImage: `url(https://webere4870.blob.core.windows.net/react-app/${pictures?.[0]})`}}></div>
                        <div id="secondPhoto" className='pictureGridStyle' style={{backgroundImage: `url(https://webere4870.blob.core.windows.net/react-app/${pictures?.[1]})`}}></div>
                        <div id="thirdPhoto" className='pictureGridStyle' style={{backgroundImage: `url(https://webere4870.blob.core.windows.net/react-app/${pictures?.[2]})`}}></div>
                        <div id="fourthPhoto" className='pictureGridStyle' style={{backgroundImage: `url(https://webere4870.blob.core.windows.net/react-app/${pictures?.[3]})`}}></div>
                        <div id="fifthPhoto" className='pictureGridStyle' style={{backgroundImage: `url(https://webere4870.blob.core.windows.net/react-app/${pictures?.[4]})`}}></div>
                    </div>
                    <div id="listingBlock">
                        <div id="subListingBlock">

                        </div>
                        <RentalRequest listing={listing}/>
                    </div>
                </div>
            </div>
        </div>
    )
}