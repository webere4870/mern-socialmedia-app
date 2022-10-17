import React from 'react'

export default function Stars(props)
{
    function changeForm(evt, val)
    {
        props.setStarForm((prev)=>
        {
            return {...prev, [props.formValue]: val}
        })
    }
    return (
        <>
            <div className="reviewStack">
                    <p style={{margin: "0", padding: "0"}}>{props.label}</p>
                <div class="rating">
                    <input type="radio" value={`${props.label}5`} id={`${props.label}5`}/><label  onClick={(evt)=>changeForm(evt,5)}  for={`${props.label}5`}>☆</label>
                    <input type="radio"  value={`${props.label}4`} id={`${props.label}4`}/><label  onClick={(evt)=>changeForm(evt,4)} for={`${props.label}4`}>☆</label>
                    <input type="radio"  value={`${props.label}3`} id={`${props.label}3`}/><label onClick={(evt)=>changeForm(evt,3)}  for={`${props.label}3`}>☆</label>
                    <input type="radio" value={`${props.label}2`} id={`${props.label}2`}/><label  onClick={(evt)=>changeForm(evt,2)} for={`${props.label}2`}>☆</label>
                    <input type="radio" value={`${props.label}1`} id={`${props.label}1`}/><label  onClick={(evt)=>changeForm(evt,1)} for={`${props.label}1`}>☆</label>
                </div>
            </div>
        </>
    )
}