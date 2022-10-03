import React from 'react'
import Nav from './Nav'
import Fetch from './../utils/fetch'
import Map from './Map'
import Geocode from 'react-geocode'
import Reviews from './Reviews'
import ChatBox from './ChatBox'
import ListingItem from './ListingItem'
import UserContext from './Context'
import CustomPayment from './CustomPayment'
import {Link} from 'react-router-dom'
import Portal from './Portal'

export default function User(props)
{
    let [user, setUser] = React.useState()
    let [myProfile, setProfile] = React.useContext(UserContext)
    let [chatBoxOpen, setChatBoxOpen] = React.useState(false)
    let [viewToggle, setViewToggle] = React.useState(true)
    let [listingsArray, setListingsArray] = React.useState([])
    let [selected, setSelected] = React.useState({})
    let [saved, setSaved] = React.useState([])
    let [paymentState, setPaymentState] = React.useState(false)
    let [portal, setPortal] = React.useState(false)
    let username = window.location.pathname.split("/")[2]
    React.useEffect(()=>
    {
        console.log("useref", username)
        Fetch('getUser/'+username, {method: "GET"}).then((response)=>
        {
            if(response.profile.city)
            {
                Geocode.fromAddress(`${response.profile.city}, ${response.profile.state}`).then(
                    (res)=>
                    {
                        console.log(response)
                        const { lat, lng } = res.results[0].geometry.location;
                        setUser((prev)=>
                        {
                            let obj = response.profile
                            obj.lat = lat
                            obj.lng = lng
                            return obj
                        })
                    }
                );
            }
            else
            {
                setUser(response.profile)
            }
        })
        Fetch("userListings/"+username, {method: "GET"}).then((response)=>
        {
            setListingsArray((prev)=>
            {
                return response.listings
            })
        })
        if(myProfile)
        {
            console.log(myProfile.jwt)
            Fetch("savedList", {method: "GET", headers: {"x-access-token": myProfile.jwt}}).then((response)=>
            {
                console.log("USer", response.saved)
                setSaved((prev)=>
                {
                    return response.saved
                })
            })
        }
    }, [])

    let userStars = []
    let listingsArr = listingsArray.map((temp)=>
    {
        return <ListingItem setSelected={setSelected} saved={saved} listing={temp}/>
    })

    for(let i = 1; i < 6; i++)
    {
        userStars.push((<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill={`${i <= user?.overall ? "yellow" : "gray"}`} class="bi bi-star-fill" viewBox="0 0 16 16">
        <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"/>
        </svg>))
    }

    console.log(portal)

    return(
    <div className='colFlex App'>
        <Nav/>
        {portal && 
        <Portal open={portal} setIsOpen={setPortal}>
        {portal && <CustomPayment profile={user} setPortal={setPortal}/>}
    </Portal>}
        
        
        
        <div id='messageBubble' onClick={()=>setChatBoxOpen((prev)=>!prev)}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="white" class="bi bi-chat-dots-fill" viewBox="0 0 16 16">
        <path d="M16 8c0 3.866-3.582 7-8 7a9.06 9.06 0 0 1-2.347-.306c-.584.296-1.925.864-4.181 1.234-.2.032-.352-.176-.273-.362.354-.836.674-1.95.77-2.966C.744 11.37 0 9.76 0 8c0-3.866 3.582-7 8-7s8 3.134 8 7zM5 8a1 1 0 1 0-2 0 1 1 0 0 0 2 0zm4 0a1 1 0 1 0-2 0 1 1 0 0 0 2 0zm3 1a1 1 0 1 0 0-2 1 1 0 0 0 0 2z"/>
        </svg>
            </div>
        {chatBoxOpen && <ChatBox profile={user} setChatBoxOpen={setChatBoxOpen}/>}
        {user && 
        <div>
            <img className='profileBig' src={`https://webere4870.blob.core.windows.net/react-app/${user?._id}`} alt="" />
        </div>}
        
            {user?.name && <h1>{user.name}</h1>}
            <div className='rowFlex'>
                {userStars}
            </div>
            <div>{myProfile?.jwt && <button onClick={()=>setPortal((prev)=>!prev)}>Initiate Payment</button>}<button onClick={(evt)=>setChatBoxOpen((prev)=>!prev)}>Send Message</button><button>Leave Review</button></div>
            {/* <div id='profileMap'>
                {user?.lat && <Map center={{lat: user.lat, lng: user.lng}}/>}
            </div> */}
            <div id='viewToggler'><h3 onClick={()=>setViewToggle((prev)=> prev==true? prev: !prev)}>Listings</h3><h3 onClick={()=>setViewToggle((prev)=> prev==false? prev: !prev)}>Reviews</h3></div>
            {viewToggle && <div id='gridFlex'>{listingsArr}</div>}
            {!viewToggle && <Reviews timeline={user}/>}
    </div>)
}