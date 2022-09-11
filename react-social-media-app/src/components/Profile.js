import React from 'react'
import Nav from './Nav'
import UserContext from './Context'
import {useNavigate} from 'react-router-dom'
import axios from 'axios'
import Bio from './Bio'
import Map from './Map'
import Fetch from './../utils/fetch'
const { BlobServiceClient, StorageSharedKeyCredential } = require("@azure/storage-blob");


export default function Profile(props)
{
    const [values, setValues] = React.useState({
        imagePreviewUrl: "", 
        picFile: null
     })
     let fileInput = React.createRef();
     
     let [isBioShown, setIsBioShown] = React.useState(false) 
     let bioStyle = {right: isBioShown ? 0 : "-40vw"}
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
    let [bioState, setBioState] = React.useState({})
    let navigate = useNavigate()

    const inputChange = async (evt) =>
    {
        setProfile((prev)=>
        {
            return {...prev, [evt.currentTarget.name]: [evt.currentTarget.value]}
        })
        
    }

    const submitProfile = async(evt)=>
    {
        let response = await Fetch("profile", {method: "POST", headers:{"x-access-token": user.jwt, "Content-Type": "application/json"}, body: JSON.stringify(profile)})
        
        setProfile((prev)=>
        {
            return response.profile
        })
    }


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
        <div className='colFlex'>
            <Nav/>
            {isBioShown && <Bio bioStyle={bioStyle} bioForm={profile} inputChange={inputChange} submitProfile={submitProfile} setIsBioShown={setIsBioShown}/>}
            <div className='rowFlex'>
                <img className='profileBig' src={`https://webere4870.blob.core.windows.net/react-app/${profile._id}`} alt=""/>
                <div className='colFlex'>
                <h1>{profile.name}</h1>
                <input type="file"
                accept="image/*"
                onChange={handleImageChange}
                ref={fileInput}/>
                    <button onClick={handleSubmit}>Change profile picture</button>
                </div>
            </div>
            
            
            <p>Bio: {profile.bio}</p>
            <p>Location: {profile.city}, {profile.state}</p>
            <p>Tenant or Landlord {profile.status}</p>
            <div id='profileMap'>
                <Map/>
            </div>
            
            <button onClick={()=>setIsBioShown((prev)=> !prev)}>Edit Bio</button>
        </div>
    )
}