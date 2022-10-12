import React from 'react'
import {Link} from 'react-router-dom'
import UserContext from './Context'
import Fetch from './../utils/fetch'
import { useAuth0 } from '@auth0/auth0-react'
import AuthFetch from '../utils/authFetch'
import "./../Listing.css"

export default function ListingItem(props)
{
    let {_id, address, city, state, ZIP, price, owner, pictures} = props.listing
    let {setSideToggle, setSelected} = props
    let [saved, setSaved] = React.useState(props?.listing?._id===props.saved[0])
    const {user, getAccessTokenSilently} = useAuth0()
    let [currentIndex, setCurrentIndex] = React.useState(0)

    let currentStyle = {backgroundImage: `url(https://webere4870.blob.core.windows.net/react-app/${pictures?.[currentIndex]})`}

    React.useEffect(()=>
    {
      for(let temp of props.saved)
      {
        if(temp == props?.listing?._id)
        {
          setSaved(true)
        }
      }
    },[])

    function bookmark(evt)
    {
      let str = JSON.stringify({bookmark: true, _id: props?.listing?._id})
      AuthFetch("bookmarks", {method: "POST", headers: {"x-access-token": user.jwt, "Content-Type": "application/json"}, body: str }, getAccessTokenSilently)
      setSaved((prev)=>!prev)
    }

    function unbookmark(evt)
    {
      let str = JSON.stringify({bookmark: false, _id: props?.listing?._id})
      AuthFetch("bookmarks", {method: "POST", headers: {"x-access-token": user.jwt, "Content-Type": "application/json"}, body: str }, getAccessTokenSilently)
      setSaved((prev)=>!prev)
    }
    
    function toggleSideScreen(evt)
    {
        // if(setSideToggle)
        // {
        //   setSideToggle((prev)=>
        //   {
        //       return !prev
        //   })
        // }
        
        
        // setSelected((prev)=>
        // {
        //     return props.listing
        // })
    }

    return(
    <div className='overListing'>
      <div className="topListing" style={currentStyle}>

      </div>
      <div className="bottomListing">

      </div>
    </div>)
}