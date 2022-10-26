import React from 'react'
import Fetch from './../utils/fetch'
import {Link} from 'react-router-dom'
import ToolTip from './ToolTip'


export default function Subscribe(props)
{
    let {tab} = props
    let [userDataList, setUserDataList] = React.useState([])
    let [toolTipState, setToolTipState] = React.useState(false)
    React.useEffect(()=>
    {
        props?.tab == "reviews" ? Fetch("profileList", {method: "POST", headers: {"Content-Type": "application/json"},body: JSON.stringify({list: props?.userList, tab: props?.tab})}).then((response)=>
        {
            setUserDataList(response.listingList)
        }) 
        :
        Fetch("profileList", {method: "POST", headers: {"Content-Type": "application/json"},body: JSON.stringify({list: props?.userList, tab: props?.tab})}).then((response)=>
        {
            setUserDataList(response.userList)
        })
    }, [])

    let userMap = props?.tab == "reviews" ? userDataList?.map((temp)=>
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
            <div style={{marginRight: "auto", gap: "10px"}} className="rowFlex">
            <img className='listImg' src={"https://webere4870.blob.core.windows.net/react-app/"+temp.pictures[0]} alt="" />
            <div>
            <div className='rowFlex'>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="gray" class="bi bi-geo-alt" viewBox="0 0 16 16">
            <path d="M12.166 8.94c-.524 1.062-1.234 2.12-1.96 3.07A31.493 31.493 0 0 1 8 14.58a31.481 31.481 0 0 1-2.206-2.57c-.726-.95-1.436-2.008-1.96-3.07C3.304 7.867 3 6.862 3 6a5 5 0 0 1 10 0c0 .862-.305 1.867-.834 2.94zM8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10z"/>
            <path d="M8 8a2 2 0 1 1 0-4 2 2 0 0 1 0 4zm0 1a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"/>
            </svg>
                <p>{temp.city}, {temp.state}</p>
            </div>

            </div>
            </div>
            <div className='toolTipBubble' onClick={()=>setToolTipState(!toolTipState)}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-three-dots" viewBox="0 0 16 16">
            <path d="M3 9.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z"/>
            </svg>
            </div>
        </div>)
    }) : 
    userDataList?.map((temp)=>
    {
        return (<div className='subscribeCard'>
            
            
            {tab == "reviews" && 
            <ToolTip>
                <div className='toolTipRow'>
                <p onClick={()=>props?.setReviewProfile(temp)}>Review</p>
                </div>
                <div className='toolTipRow'>
                    <p>Delete Reviewable</p>
                </div>
                </ToolTip>
            }

            {tab == "tenantRequests" && 
            <ToolTip>
                <div className='toolTipRow'>
                <p onClick={()=>props?.setReviewProfile(temp)}>Accept</p>
                </div>
                <div className='toolTipRow'>
                <p onClick={()=>props?.setReviewProfile(temp)}>Reject</p>
                </div>
                <div className='toolTipRow'>
                    <p>Delete Reviewable</p>
                </div>
                </ToolTip>
            }
            
            <div style={{marginRight: "auto", gap: "10px"}} className="rowFlex">
            <img className='listImg' src={"https://webere4870.blob.core.windows.net/react-app/"+temp._id} alt="" />
            <div>
            <div className='rowFlex'>
                <div>
                <p>{temp.name}</p>
                <Link to={"/user/"+temp._id}><p>{temp._id}</p></Link>
                </div>

                
            </div>

            </div>
            </div>
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