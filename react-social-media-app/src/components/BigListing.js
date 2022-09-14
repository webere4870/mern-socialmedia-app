import React from 'react'

export default function BigListing(props)
{
    return (
    <div id='bigListing'>
        <h1>{props.selected.owner}</h1>
        <button onClick={()=>props.setSideToggle((prev)=>!prev)}>Return</button>
    </div>)
}