import React from "react"
import $ from 'jquery'
import Fetch from './../utils/fetch'
import ProgressCircle from "./ProgressCircle"


export default function UserHover(props)
{
    // Minimum viable product
    let {username, isProfile} = props
    let [user, setUser] = React.useState()

    React.useEffect(()=>
    {
        Fetch("publicProfile/"+username, {method: "GET"}).then(({user})=>
        {
            setUser(user)
        })
    },[])
    console.log(user)
    return (
    <div id="profileImgTile" className="tile">
        <div className="absoluteBG" style={{backgroundImage: `url(https://webere4870.blob.core.windows.net/react-app/bg${username})`}}>

        </div>
        <div className='coverBubble'>
            <img className='profileBig' src={user?.picture} alt=""/>
            {isProfile && <div id="svgProfile" onClick={()=>$("#profileSelect").trigger("click")}>
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="white" className="bi bi-plus" viewBox="0 0 16 16">
                <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"/>
                </svg>
            </div>}
        </div>
        <div className="bottomAbsolute">
            <ProgressCircle decimal={.95} metric={"Clean"}/>
            <ProgressCircle decimal={.95} metric={"Stuff"}/>
            <ProgressCircle decimal={.95} metric={"Cool"}/>
        </div>
        
    </div>)
}