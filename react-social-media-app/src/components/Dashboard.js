import React from 'react'
import Nav from './Nav'
import AuthFetch from '../utils/authFetch'
import { useAuth0, User } from '@auth0/auth0-react'
import $ from 'jquery'
import axios from 'axios'
import Calendar from './Calendar'
import UserHover from './UserHover'
import AvailableReviews from './AvailableReviews'
import Requests from './Requests'

import Loading from './Loading'

export default function Dashboard(props)
{
    let [user, setUser] = React.useState({})
    let [userForm, setUserForm] = React.useState(user?._id ? {name: user.name, city: user.city, state: user.state} : {name: "", city: "", state: ""})
    const {getAccessTokenSilently} = useAuth0()
    console.log(user)
    const [values, setValues] = React.useState({
        imagePreviewUrl: "", 
        picFile: null
     })
    let fileInput = React.createRef();
    const handleImageChange = e => {
        e.preventDefault();
        let reader = new FileReader();
        let inFile = e.target.files[0];
        reader.onloadend = () => {
           setValues({...values, 
              picFile: inFile, 
              imagePreviewUrl: reader.result
           })
        };
    reader.readAsDataURL(inFile);
    };

    const handleSubmit = async() => {
        let config = {
            headers: {
              "x-access-token": user?.jwt,
            }
        }
          
        var fd = new FormData();
        fd.append("avatar", values.picFile, "temp.jpg");
        // response stores the response back from the API
        AuthFetch("profilePicture", {method: "POST", headers: {'Content-Type': 'multipart/form-data'}, body: fd}, getAccessTokenSilently).catch((err)=>
        {
            alert("File too large")
        })
    }

    React.useEffect(()=>
    {
        AuthFetch("profile", {method: "GET",headers: {"x-access-token": user?.jwt}}, getAccessTokenSilently).then((response)=>
        {
            console.log(response.user)
            setUser(response.user)

        })
    }, [])

    React.useEffect(()=>
    {
        setUserForm({name: user.name, city: user.city, state: user.state})
    }, [user])

    function changeInput(evt)
    {
        let name = evt.currentTarget.name
        let val = evt.currentTarget.value
        setUserForm((prev)=>
        {
            return {...prev, [name]: val}
        })
    }


    return (
    <div className='App'>
        <Nav/>
        <div id="dashboard">
            <UserHover username={user?._id} isProfile={true}/>
            <div className="tile" id='profileTile'>
                {user && 
                <div id='profileTile'>
                    
            <input type="file"
                accept="image/*"
                onChange={handleImageChange}
                style={{display: "none"}}
                id="profileSelect"
                ref={fileInput}/>
                    <label htmlFor="name">Name</label>
                    <input type="text" name='name' value={userForm.name} onChange={changeInput}/>
                    <label htmlFor="name">State</label>
                    <input type="text" name='name' value={userForm.state} onChange={changeInput}/>
                </div>}
                <button className="blockButton">
                    Submit Changes
                </button>
            </div>
            <div id="reviewTile" className='tile'>
                    <Calendar/>
            </div>
            <AvailableReviews listingsArr={user?.availableReviews}/>
            <Requests/>
        </div>
    </div>)
}