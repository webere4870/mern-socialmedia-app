import React from 'react'


export default function Bio(props)
{
    let changed = props.inputChange
    return (<div id='bioSlide' style={props.bioStyle}>
        <label htmlFor="bio">Biography</label>
        <input type="text" name='bio' onChange={changed}/>
        <label htmlFor="city">City</label>
        <input type="text" name='city' onChange={changed}/>
        <label htmlFor="state">State</label>
        <input type="text" name='state' onChange={changed}/>
        <button onClick={()=>props.submitProfile()}>Submit</button>
        <button onClick={()=>props.setIsBioShown((prev)=>!prev)}>Close</button>
    </div>)
}