import React from 'react'
import Review from './Review'
import Fetch from './../utils/fetch'
import UserContext from './Context'
import {v4} from 'uuid'

export default function Reviews(props)
{
    let [user, setUser] = React.useContext(UserContext)
    let [starCount, setStarCount] = React.useState(0)
    let [comment, setComment] = React.useState({comment: ""})
    let stars = []

    async function submitForm(){
        let response = await Fetch("rating", {method: "post", headers: {"Content-Type": "application/json", "x-access-token" : user.jwt}, body: JSON.stringify({stars: starCount, comment: comment, user: props.timeline._id})})
        console.log(response.user)
    }

    console.log(props.timeline?.reviews)

    let reviewList = props.timeline?.reviews?.map((temp)=>
    {
        return <Review key={v4()} edit={false} commentObject={temp}/>
    })

    for(let i = 0; i < 5; i++)
    {
        stars.push((<svg xmlns="http://www.w3.org/2000/svg" onClick={()=>setStarCount(i + 1)} width="16" height="16" fill={`${starCount <= i ? "gray" : "yellow"}`} class="bi bi-star-fill" viewBox="0 0 16 16">
        <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"/>
        </svg>))
    }

    let childUser = {username: user?.email}

    return(

        <section>
            {reviewList}
            {user?.email && <Review edit={true} stars={stars} setStarCount={setStarCount} commentObject={childUser} comment={comment} setComment={setComment} submitForm={submitForm}/>}
      </section>)
}