import React from 'react'
import Stars from './Stars'
import AuthFetch from './../utils/authFetch'
import { useAuth0 } from '@auth0/auth0-react'

export default function ReviewPortal(props)
{
    let {_id, name, pictures, address, city, state, ZIP, owner, tenant} = props.reviewProfile
    let starterObject = {hospitality: 0, cleanliness: 0, communication: 0, location: 0, comment: ""}
    let [starForm, setStarForm] = React.useState(starterObject)
    let [isValid, setIsValid] = React.useState()
    let {getAccessTokenSilently} = useAuth0()
    console.log(starForm)
    
    function changeComment(evt)
    {
        let newVal = evt.currentTarget.value
        setStarForm((prev)=>
        {
            return {...prev, comment: newVal}
        })
    }
    function submit(evt)
    {
        if(starForm.cleanliness == 0 || starForm.comment == "" || starForm.communication==0 || starForm.hospitality == 0 || starForm.location ==0)
        {
            setIsValid(false)
        }
        else
        {
            let postReview = {...starForm}
            postReview.landlord = owner
            postReview.tenant = tenant
            postReview.property = _id
            
            AuthFetch("review", {method:"POST", headers: {"Content-Type": "application/json"}, body: JSON.stringify()}, getAccessTokenSilently).then((response)=>
            {

            })
        }   
    }
    return (
    <div id='reviewPortal'>
        {isValid == false && <div className='absoluter'><span>*Need comment and at least one star*</span></div>}
        <div id='leftReview'>
            <img src={`https://webere4870.blob.core.windows.net/react-app/${pictures[0]}`} className="profileBig" alt="" />
            <h3>{name}</h3>
            <div className='rowFlex'>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-geo" viewBox="0 0 16 16">
            <path fill-rule="evenodd" d="M8 1a3 3 0 1 0 0 6 3 3 0 0 0 0-6zM4 4a4 4 0 1 1 4.5 3.969V13.5a.5.5 0 0 1-1 0V7.97A4 4 0 0 1 4 3.999zm2.493 8.574a.5.5 0 0 1-.411.575c-.712.118-1.28.295-1.655.493a1.319 1.319 0 0 0-.37.265.301.301 0 0 0-.057.09V14l.002.008a.147.147 0 0 0 .016.033.617.617 0 0 0 .145.15c.165.13.435.27.813.395.751.25 1.82.414 3.024.414s2.273-.163 3.024-.414c.378-.126.648-.265.813-.395a.619.619 0 0 0 .146-.15.148.148 0 0 0 .015-.033L12 14v-.004a.301.301 0 0 0-.057-.09 1.318 1.318 0 0 0-.37-.264c-.376-.198-.943-.375-1.655-.493a.5.5 0 1 1 .164-.986c.77.127 1.452.328 1.957.594C12.5 13 13 13.4 13 14c0 .426-.26.752-.544.977-.29.228-.68.413-1.116.558-.878.293-2.059.465-3.34.465-1.281 0-2.462-.172-3.34-.465-.436-.145-.826-.33-1.116-.558C3.26 14.752 3 14.426 3 14c0-.599.5-1 .961-1.243.505-.266 1.187-.467 1.957-.594a.5.5 0 0 1 .575.411z"/>
            </svg>
            <p>{city}, {state}</p>
            </div>
        </div>
        <div id='rightReview'>
            <Stars label={"Hospitality"} formValue={"hospitality"} setStarForm={setStarForm}/>
            <Stars label={"Cleanliness"} formValue={"cleanliness"} setStarForm={setStarForm}/>
            <Stars label={"Communication"} formValue={"communication"} setStarForm={setStarForm}/>
            <Stars label={"Location"} formValue={"location"} setStarForm={setStarForm}/>
            <textarea id="reviewComment" value={starForm.comment} onChange={changeComment} name="comment"  cols="30" rows="10"></textarea>
        </div>
        <div className='buttonFlex'>
            <button onClick={(evt)=>submit(evt)}>Submit</button>
        </div>
    </div>)
}