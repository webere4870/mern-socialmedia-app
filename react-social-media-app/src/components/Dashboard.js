import React from 'react'
import Nav from './Nav'
import AuthFetch from '../utils/authFetch'
import { useAuth0 } from '@auth0/auth0-react'
import $ from 'jquery'
import axios from 'axios'
import Calendar from './Calendar'

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
            <div className="tile" id='profileTile'>
                {user && 
                <div id='profileTile'>
                    <div className='coverBubble'>
            <img className='profileBig' src={user.picture} alt=""/>
            <div id="svgProfile" onClick={()=>$("#profileSelect").trigger("click")}>
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="white" className="bi bi-plus" viewBox="0 0 16 16">
                    <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"/>
                </svg>
            </div>
            </div>
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
        </div>
    </div>)
}