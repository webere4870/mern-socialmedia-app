import React from 'react'
import Nav from './Nav'
import UserContext from './Context'
import {useNavigate} from 'react-router-dom'
import axios from 'axios'
const { BlobServiceClient, StorageSharedKeyCredential } = require("@azure/storage-blob");


export default function Profile(props)
{
    const [values, setValues] = React.useState({
        imagePreviewUrl: "", 
        picFile: null
     })
     let fileInput = React.createRef(); 
     
     // Activates user file input to set div
     const editProfilePic = () => {
        fileInput.current.click();
     } 
     // Handles the image that was input by user
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
  // Call the API Backend, will describe this later
     

    let [user, setUser] = React.useContext(UserContext)
    let [profile, setProfile] = React.useState({})
    let [form, setForm] = React.useState({})
    let navigate = useNavigate()
    const handleSubmit = async() => {
        let config = {
            headers: {
              "x-access-token": user.jwt,
            }
          }
          console.log(profile)
          var fd = new FormData();
          fd.append("avatar", values.picFile, "temp.jpg");
        // response stores the response back from the API
        let response = await axios.post(`http://localhost:5000/profilePicture`, fd, {
            headers: {
              'x-access-token': user.jwt, // optional
              'Content-Type': 'multipart/form-data'
            },
          })
        .catch(error => {
           alert("Error occurred while uploading picture, try uploading a smaller image size or try again later.")
           return;
     });
     }
    React.useEffect(()=>
    {
        if(!user)
        {   
            navigate("/login")
        }
        (async function()
        {
            let userProfile = await fetch("http://localhost:5000/profile",{headers: {'x-access-token': user.jwt}})
            let json = await userProfile.json()
            console.log(json)
            setProfile((prev)=>
            {
                return json.user
            })
        })()
    }, [])

    return (
        <div>
            <Nav/>
            <h1>Hello, {user.name}</h1>
            <img src={user.picture} alt="" style={{height: "60px", width: "60px"}}/>
            <input type="file"
           accept="image/*"
           onChange={handleImageChange}
           ref={fileInput}/>
            <button onClick={handleSubmit}>Change profile picture</button>
        </div>
    )
}