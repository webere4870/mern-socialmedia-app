import React from 'react'

export default function BigListing(props)
{
    return (
    <div id='bigListing'>
        <h1>{props.selected.owner}</h1>
        <img className="mainPicture" src={"https://webere4870.blob.core.windows.net/react-app/"+props.selected.pictures[0]} alt="" />
        <button onClick={()=>props.setSideToggle((prev)=>!prev)}>Return</button>
    </div>)
}