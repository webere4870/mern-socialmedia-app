import React from 'react'
import ToolTip from './ToolTip'

export default function CustomProfileCard(props)
{
    let [toolTipState, setToolTipState] = React.useState(false)
    return (
    <div className='customCard'>
           {props.tab == "tenantRequests" && 
            <ToolTip>
                <div className='toolTipRow'>
                <p>Accept</p>
                </div>
                <div className='toolTipRow'>
                <p>Reject</p>
                </div>
                <div className='toolTipRow'>
                    <p>Delete Reviewable</p>
                </div>
                </ToolTip>
            }
             <div className='toolTipBubble' onClick={()=>setToolTipState(!toolTipState)}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-three-dots" viewBox="0 0 16 16">
            <path d="M3 9.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z"/>
            </svg>
            </div>
    </div>)
}