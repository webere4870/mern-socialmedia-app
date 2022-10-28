import React from 'react'
import Fetch from './../utils/fetch'

export default function ProgressBar(props)
{
    let {percentage} = props
    React.useEffect(()=>
    {
        Fetch("calculateRatings", {method: "POST", headers: {"Content-Type": "application/json"}, body: JSON.stringify({aggregate: props?.aggregate})}).then((response)=>
        {
            setPercentage(Number(response.aggregate))
        })
    },[])

    return (
    <div className='progressDiv'>
        <div className="progressBar">
            
        </div>
    </div>)
}