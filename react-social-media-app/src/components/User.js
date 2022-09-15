import React from 'react'
import Nav from './Nav'
import Fetch from './../utils/fetch'
import Map from './Map'
import Geocode from 'react-geocode'
import Reviews from './Reviews'

export default function User(props)
{
    let [user, setUser] = React.useState()
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
    return(
    <div className='colFlex App'>
        <Nav/>
        {user && 
        <div>
            <img className='profileBig' src={`https://webere4870.blob.core.windows.net/react-app/${user?._id}`} alt="" />
        </div>}
        
            {user?.name && <h1>{user.name}</h1>}
            <div><button>Send Message</button><button>Leave Review</button></div>
            <div id='profileMap'>
                {user?.lat && <Map center={{lat: user.lat, lng: user.lng}}/>}
            </div>
            <Reviews/>
    </div>)
}