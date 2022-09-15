import React from 'react'
import SlideShow from './SlideShow'

export default function BigListing(props)
{
    let pictures = props?.selected?.pictures
    return (
    <div id='bigListing'>
        {props.selected && <SlideShow pictures={pictures}/>}
        <button onClick={()=>props.setSideToggle((prev)=>!prev)}>Return</button>
    </div>)
}