import React from 'react'
import {Link} from 'react-router-dom'
import UserContext from './Context'
import Fetch from './../utils/fetch'
import { useAuth0 } from '@auth0/auth0-react'
import AuthFetch from '../utils/authFetch'
import { Slider } from 'infinite-react-carousel/lib'
import $ from 'jquery'
import "./../Listing.css"

export default function ListingItem(props)
{
    let {_id, address, city, state, ZIP, price, owner, pictures} = props.listing
    let {setSideToggle, setSelected} = props
    let [saved, setSaved] = React.useState(props?.listing?._id===props.saved[0])
    const {user, getAccessTokenSilently} = useAuth0()
    let [currentIndex, setCurrentIndex] = React.useState(0)
    let [picturesOrder, setPicturesOrder] = React.useState([...pictures])

    let picturesArr = picturesOrder?.map((temp)=>
    {
      return <div key={temp} className='pictureSlide' style={{backgroundImage: `url(https://webere4870.blob.core.windows.net/react-app/${temp})`}}>

      </div>
    })

    console.log(picturesArr)

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


    React.useEffect(()=>
    {

    }, [])

    function swipeRight()
    {
      if(currentIndex < pictures?.length -1)
      {
        let px = $(`.${_id}`).css("left")
        let split = Number(px.split("px")[0])
        let newPx = split - 300
        console.log(newPx)
        $(`.${_id}`).css("left", newPx + "px")
        setCurrentIndex((prev)=>prev+1)
      }
      
      // setPicturesOrder((prev)=>
      // {
      //   let newArr = [...prev]
      //   newArr.unshift(prev[prev.length-1])
      //   newArr.pop()
      //   return newArr
      // })
    }


    function swipeLeft()
    {
      if(currentIndex !=0)
      {
        let px = $(`.${_id}`).css("left")
        let split = Number(px.split("px")[0])
        let newPx = split + 300
        console.log(newPx)
        $(`.${_id}`).css("left", newPx + "px")
        setCurrentIndex((prev)=>prev-1)
      }
    }

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
      <div className="topListing">
        <div className='hiddenData'>
          <button>See More</button>
        </div>
        <div className={`topListingRow ${_id}`}>
          {picturesArr}
        </div>
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="white" class="bi bi-heart" viewBox="0 0 16 16">
      <path d="m8 2.748-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01L8 2.748zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143c.06.055.119.112.176.171a3.12 3.12 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15z"/>
    </svg>
        <div className='svgSwipe leftSwipe' onClick={swipeLeft}>
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"      fill="currentColor" class="bi bi-chevron-left" viewBox="0 0 16 16">
          <path fill-rule="evenodd" d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z"/>
        </svg>
        </div>
        <div className="svgSwipe rightSwipe" onClick={swipeRight}>
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chevron-right" viewBox="0 0 16 16">
        <path fill-rule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"/>
      </svg>
        </div>
      </div>
      <div className="bottomListing">
        <div className='rowFlex' style={{justifyContent: 'flex-start'}}><p>{city}, {state}</p> 
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-star-fill" viewBox="0 0 16 16">
            <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"/>
            </svg>
        </div>
        <p>${price} / night</p>
        <img className='messageIcon' src={`https://webere4870.blob.core.windows.net/react-app/${owner}`}/>
      </div>
    </div>)
}