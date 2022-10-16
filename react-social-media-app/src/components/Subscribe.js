import React from 'react'
import Fetch from './../utils/fetch'
import {Link} from 'react-router-dom'
import ToolTip from './ToolTip'


export default function Subscribe(props)
{
    let {tab} = props
    let [userDataList, setUserDataList] = React.useState([])
    let [toolTipState, setToolTipState] = React.useState(false)
    console.log(props.userList)
    React.useEffect(()=>
    {
        Fetch("profileList", {method: "POST", headers: {"Content-Type": "application/json"},body: JSON.stringify({list: props?.userList})}).then((response)=>
        {
            setUserDataList(response.userList)
        })
    }, [])

    let userMap = userDataList?.map((temp)=>
    {
        return (<div className='subscribeCard'>
            {toolTipState && 
            <ToolTip>
                {tab == "reviews" && 
                <>
                    <div className='toolTipRow'>
                    <p onClick={()=>props?.setReviewProfile(temp)}>Review</p>
                    </div>
                    <div className='toolTipRow'>
                        <p>Delete Reviewable</p>
                    </div>
                </>}
            </ToolTip>}
            <img src={"https://webere4870.blob.core.windows.net/react-app/"+temp._id} alt="" />
            <div><h5>{temp.name}</h5>
            <Link to={"/user/"+temp._id}><p style={{padding: "0", margin: "0"}}>{temp._id}</p></Link></div>
            <div className='toolTipBubble' onClick={()=>setToolTipState(!toolTipState)}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-three-dots" viewBox="0 0 16 16">
            <path d="M3 9.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z"/>
            </svg>
            </div>
        </div>)
    })
    return (
    <div id='subscribe'>
        {userMap}
    </div>)
}