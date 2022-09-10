import React from 'react'

export default function Bio(props)
{
    return (<div id='bioSlide' style={props.bioStyle}>
        <label htmlFor="bio">Biography</label>
        <input type="text" name='bio'/>
        <label htmlFor="city">City</label>
        <input type="text" name='city'/>
        <label htmlFor="state">State</label>
        <input type="text" name='state'/>
        <input type="text" />
        <button onClick={()=>props.setIsBioShown((prev)=>!prev)}>Close</button>
    </div>)
}