import React from 'react'
import {Link} from 'react-router-dom'
import UserContext from './Context'
import Fetch from './../utils/fetch'

export default function ListingItem(props)
{
    let {_id, address, city, state, ZIP, price, owner, pictures} = props.listing
    let [user, setUser] = React.useContext(UserContext)
    let {setSideToggle, setSelected} = props
    let [saved, setSaved] = React.useState(props?.listing?._id===props.saved[0])


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
      Fetch("bookmarks", {method: "POST", headers: {"x-access-token": user.jwt, "Content-Type": "application/json"}, body: str })
      setSaved((prev)=>!prev)
    }

    function unbookmark(evt)
    {
      let str = JSON.stringify({bookmark: false, _id: props?.listing?._id})
      Fetch("bookmarks", {method: "POST", headers: {"x-access-token": user.jwt, "Content-Type": "application/json"}, body: str })
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

    return(<div class="myCard">
    <div class="card-header">
    {(!saved)  && <svg onClick={bookmark} xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-bookmark" viewBox="0 0 16 16">
    <path d="M2 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v13.5a.5.5 0 0 1-.777.416L8 13.101l-5.223 2.815A.5.5 0 0 1 2 15.5V2zm2-1a1 1 0 0 0-1 1v12.566l4.723-2.482a.5.5 0 0 1 .554 0L13 14.566V2a1 1 0 0 0-1-1H4z"/>
  </svg>}
  {(saved) && <svg onClick={unbookmark} xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-bookmark-check-fill" viewBox="0 0 16 16">
  <path fill-rule="evenodd" d="M2 15.5V2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v13.5a.5.5 0 0 1-.74.439L8 13.069l-5.26 2.87A.5.5 0 0 1 2 15.5zm8.854-9.646a.5.5 0 0 0-.708-.708L7.5 7.793 6.354 6.646a.5.5 0 1 0-.708.708l1.5 1.5a.5.5 0 0 0 .708 0l3-3z"/>
</svg>}
      <img src={`https://webere4870.blob.core.windows.net/react-app/${pictures[0]}`} alt="" />
    </div>
    <div class="card-body-me">
      <span class="tag tag-teal">Technology</span>
      <p>
        {address},
        {`${city}, ${state} ${ZIP}`}
      </p>
      <Link to={{pathname: `/listing/${_id}`}}><button>See More</button></Link>
      <div class="user">
        <img src={`https://webere4870.blob.core.windows.net/react-app/${owner}`} alt="" />
        <div class="user-info">
          <Link to={{pathname: `/user/${owner}`, state: props.listing}}>{owner}</Link>
          <small>2h ago</small>
        </div>
      </div>
    </div>
  </div>)
}