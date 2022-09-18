import React from 'react'
import Nav from './Nav'
import Fetch from './../utils/fetch'
import Map from './Map'
import Geocode from 'react-geocode'
import Reviews from './Reviews'
import ChatBox from './ChatBox'

export default function User(props)
{
    let [user, setUser] = React.useState()
    let [chatBoxOpen, setChatBoxOpen] = React.useState(false)
    let username = window.location.pathname.split("/")[2]
    console.log(user)
    React.useEffect(()=>
    {
        Fetch('getUser', {method: "GET"}).then((response)=>
        {
            console.log(response.profile.city, response.profile.state)
            Geocode.fromAddress(`${response.profile.city}, ${response.profile.state}`).then(
                (res)=>
                {
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
        })
    }, [])

    let userStars = []

    for(let i = 1; i < 6; i++)
    {
        userStars.push((<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill={`${i <= user?.overall ? "yellow" : "gray"}`} class="bi bi-star-fill" viewBox="0 0 16 16">
        <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"/>
        </svg>))
    }


    return(
    <div className='colFlex App'>
        <Nav/>
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
            <div><button onClick={(evt)=>setChatBoxOpen((prev)=>!prev)}>Send Message</button><button>Leave Review</button></div>
            <div id='profileMap'>
                {user?.lat && <Map center={{lat: user.lat, lng: user.lng}}/>}
            </div>
            <Reviews timeline={user}/>
    </div>)
}