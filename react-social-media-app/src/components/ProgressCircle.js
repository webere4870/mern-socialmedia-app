import React from "react"

export default function ProgressCircle(props)
{
    // Minimum viable product
    let {decimal, metric} = props
    let calc = Math.ceil(360 * decimal)
    return (
    <div className="colFlex">
        <div className="progressCircle" style={{background: `conic-gradient(#FF416C ${calc}deg, rgb(219, 219, 219) ${360-calc}deg)`}}>
            <div className="innerCircle colFlex">
                <p>{decimal * 100}%</p>
            </div>
        </div>
        <p>{metric}</p>
    </div>)
}