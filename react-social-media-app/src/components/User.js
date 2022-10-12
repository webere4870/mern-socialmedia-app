import React from 'react'
import Nav from './Nav'
import Fetch from './../utils/fetch'
import Map from './Map'
import Geocode from 'react-geocode'
import Reviews from './Reviews'
import ChatBox from './ChatBox'
import ListingItem from './ListingItem'
import CustomPayment from './CustomPayment'
import {Link} from 'react-router-dom'
import Portal from './Portal'
import { useAuth0 } from '@auth0/auth0-react'
import AuthFetch from '../utils/authFetch'
import $ from 'jquery'

export default function User(props)
{
    const {user, getAccessTokenSilently} = useAuth0()
    const [userData, setUserData] = React.useState()
    let [otherUser, setotherUser] = React.useState()
    let [chatBoxOpen, setChatBoxOpen] = React.useState(false)
    let [viewToggle, setViewToggle] = React.useState(true)
    let [listingsArray, setListingsArray] = React.useState([])
    let [selected, setSelected] = React.useState({})
    let [saved, setSaved] = React.useState([])
    let [paymentState, setPaymentState] = React.useState(false)
    let [portal, setPortal] = React.useState(false)
    let [subscribed, setSubscribed] = React.useState(false)
    let [toggleChatBox, setToggleChatBox] = React.useState(false)
    let otherUsername = window.location.pathname.split("/")[2]
    React.useEffect(()=>
    {
        console.log("otherUseref", otherUsername)
        Fetch('getUser/'+otherUsername, {method: "GET"}).then((response)=>
        {
            if(response.profile.city)
            {
                Geocode.fromAddress(`${response.profile.city}, ${response.profile.state}`).then(
                    (res)=>
                    {
                        console.log(response)
                        const { lat, lng } = res.results[0].geometry.location;
                        setotherUser((prev)=>
                        {
                            let obj = response.profile
                            console.log(obj)
                            obj?.subscribers?.find((temp)=>temp==user?.email) ? setSubscribed(true) : setSubscribed(false)
                            obj.lat = lat
                            obj.lng = lng
                            return obj
                        })
                    }
                );
            }
            else
            {
                response?.profile?.subscribers?.find((temp)=>temp==user?.email) ? setSubscribed(true) : setSubscribed(false)
                console.log(response.profile)
                setotherUser(response.profile)
            }
        })
        Fetch("userListings/"+otherUsername, {method: "GET"}).then((response)=>
        {
            setListingsArray((prev)=>
            {
                return response.listings
            })
        })
        if(user)
        {
            Fetch("savedList", {method: "GET", headers: {"x-access-token": ""}}).then((response)=>
            {
                console.log("user", response.saved)
                setSaved((prev)=>
                {
                    return response.saved
                })
            })
        }
    }, [])
    console.log()
    function connect(evt)
    {
        if(!subscribed)
        {
            AuthFetch("changeSubscribers", {method: "POST", headers: {"Content-Type": "application/json", "x-access-token": ""}, body: JSON.stringify({other: otherUser?._id, subscribe: true})}, getAccessTokenSilently).then((response)=>
            {
                setSubscribed(true)
            })
        }
        else
        {
            AuthFetch("changeSubscribers", {method: "POST", headers: {"Content-Type": "application/json", "x-access-token": ""}, body: JSON.stringify({other: otherUser?._id, subscribe: false})}, getAccessTokenSilently).then((response)=>
            {
                setSubscribed(false)
            })
        }
    }

    console.log(user)

    let otherUserStars = []
    let listingsArr = listingsArray.map((temp)=>
    {
        return <ListingItem setSelected={setSelected} saved={saved} listing={temp}/>
    })

 

    console.log(subscribed)

    return(
    <div id='profilePage'>
        <Nav otherUser={otherUser} toggleChatBox={toggleChatBox}/>
            <div id='topDiv'>
            {portal && 
        <Portal open={portal} setIsOpen={setPortal}>
        {portal && <CustomPayment profile={otherUser} setPortal={setPortal}/>}
    </Portal>}
        
        
        
        <div id='messageBubble' >
                    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="white" class="bi bi-chat-dots-fill" viewBox="0 0 16 16">
        <path d="M16 8c0 3.866-3.582 7-8 7a9.06 9.06 0 0 1-2.347-.306c-.584.296-1.925.864-4.181 1.234-.2.032-.352-.176-.273-.362.354-.836.674-1.95.77-2.966C.744 11.37 0 9.76 0 8c0-3.866 3.582-7 8-7s8 3.134 8 7zM5 8a1 1 0 1 0-2 0 1 1 0 0 0 2 0zm4 0a1 1 0 1 0-2 0 1 1 0 0 0 2 0zm3 1a1 1 0 1 0 0-2 1 1 0 0 0 0 2z"/>
        </svg>
            </div>
        {chatBoxOpen && <ChatBox profile={otherUser} setChatBoxOpen={setChatBoxOpen}/>}
        <div id="backgroundPic" style={{backgroundImage: `url(https://webere4870.blob.core.windows.net/react-app/bg${otherUser?._id})`}}>
                
                
            </div>
            <div className='coverBubble'>
            <img className='profileBig' src={`${otherUser?.picture}`} alt=""/>
            
            </div>
        
            {otherUser?.name && <h1>{otherUser.name}</h1>}
            
            <div className='btnRow'>{user && otherUser?.stripe && <div onClick={()=>setPortal((prev)=>!prev)} className='userBubbles'><svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" fill="white" class="bi bi-coin" viewBox="0 0 16 16">
            <path d="M5.5 9.511c.076.954.83 1.697 2.182 1.785V12h.6v-.709c1.4-.098 2.218-.846 2.218-1.932 0-.987-.626-1.496-1.745-1.76l-.473-.112V5.57c.6.068.982.396 1.074.85h1.052c-.076-.919-.864-1.638-2.126-1.716V4h-.6v.719c-1.195.117-2.01.836-2.01 1.853 0 .9.606 1.472 1.613 1.707l.397.098v2.034c-.615-.093-1.022-.43-1.114-.9H5.5zm2.177-2.166c-.59-.137-.91-.416-.91-.836 0-.47.345-.822.915-.925v1.76h-.005zm.692 1.193c.717.166 1.048.435 1.048.91 0 .542-.412.914-1.135.982V8.518l.087.02z"/>
            <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
            <path d="M8 13.5a5.5 5.5 0 1 1 0-11 5.5 5.5 0 0 1 0 11zm0 .5A6 6 0 1 0 8 2a6 6 0 0 0 0 12z"/>
</svg></div>}{otherUser && <div onClick={connect} className={`userBubbles ${subscribed ? "subbed" : ""}`}>
<svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" fill={`${subscribed ? "#FF416C" : "white"}`} class="bi bi-link-45deg" viewBox="0 0 16 16">
  <path d="M4.715 6.542 3.343 7.914a3 3 0 1 0 4.243 4.243l1.828-1.829A3 3 0 0 0 8.586 5.5L8 6.086a1.002 1.002 0 0 0-.154.199 2 2 0 0 1 .861 3.337L6.88 11.45a2 2 0 1 1-2.83-2.83l.793-.792a4.018 4.018 0 0 1-.128-1.287z"/>
  <path d="M6.586 4.672A3 3 0 0 0 7.414 9.5l.775-.776a2 2 0 0 1-.896-3.346L9.12 3.55a2 2 0 1 1 2.83 2.83l-.793.792c.112.42.155.855.128 1.287l1.372-1.372a3 3 0 1 0-4.243-4.243L6.586 4.672z"/>
</svg></div>}{user && <div className='userBubbles' onClick={()=>setToggleChatBox(!toggleChatBox)}>
<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="white" class="bi bi-chat-square-dots-fill" viewBox="0 0 16 16">
  <path d="M0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-2.5a1 1 0 0 0-.8.4l-1.9 2.533a1 1 0 0 1-1.6 0L5.3 12.4a1 1 0 0 0-.8-.4H2a2 2 0 0 1-2-2V2zm5 4a1 1 0 1 0-2 0 1 1 0 0 0 2 0zm4 0a1 1 0 1 0-2 0 1 1 0 0 0 2 0zm3 1a1 1 0 1 0 0-2 1 1 0 0 0 0 2z"/>
</svg></div>}</div>
            {/* <div id='profileMap'>
                {otherUser?.lat && <Map center={{lat: otherUser.lat, lng: otherUser.lng}}/>}
            </div> */}
            <div id='viewToggler'><p id="myListingsP" className={viewToggle == "myListings" ? "underlinedP" : ""} onClick={()=>setViewToggle("myListings")}>Listings</p><p className={viewToggle == "reviews" ? "underlinedP" : ""} id="reviewsP" onClick={()=>setViewToggle("reviews")}>Reviews</p><p className={viewToggle == "bookmarks" ? "underlinedP" : ""} id='bookmarksP' onClick={()=>setViewToggle("bookmarks")}>Reviews</p></div>
            </div>
            
            <div id="bottomDiv">
                <div id="scrollDiv">
                    {viewToggle && <div id='gridFlex'>{listingsArr}</div>}
                    {!viewToggle && <Reviews timeline={otherUser}/>}
                </div>
            </div>
            
    </div>)
}