import React from 'react'
import Nav from './Nav'
import UserContext from './Context'
import {useNavigate} from 'react-router-dom'
import axios from 'axios'
import Bio from './Bio'
import Map from './Map'
import Fetch from './../utils/fetch'
import ListingItem from './ListingItem'
import Reviews from './Reviews'
const { BlobServiceClient, StorageSharedKeyCredential } = require("@azure/storage-blob");


export default function Profile(props)
{
    
     
     let [isBioShown, setIsBioShown] = React.useState(false) 
     let bioStyle = {right: isBioShown ? 0 : "-40vw"}
     // Handles the image that was input by user

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
  // Call the API Backend, will describe this later
     

    let [user, setUser] = React.useContext(UserContext)
    let [profile, setProfile] = React.useState({})
    let [viewToggle, setViewToggle] = React.useState("myListings")
    let [listingsArray, setListingsArray] = React.useState([])
    let [bookmarksArray, setBookmarksArray] = React.useState([])
    let [selected, setSelected] = React.useState({})
    let [saved, setSaved] = React.useState([])


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

console.log(user)
    const handleSubmit = async() => {
        let config = {
            headers: {
              "x-access-token": user.jwt,
            }
          }
          
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
        Fetch("userListings/"+user.email, {method: "GET"}).then((response)=>
        {
            setListingsArray((prev)=>
            {
                return response.listings
            })
        })
        if(user)
        {
            Fetch("savedList", {method: "GET", headers: {"x-access-token": user.jwt}}).then((response)=>
            {
                console.log("Saved: ",response.saved)
                setSaved((prev)=>
                {
                    return response.saved
                })
            })
        }
        Fetch("bookmarks", {method: "GET", headers: {"x-access-token": user.jwt}}).then((response)=>
        {
            console.log("Bookmarks", response.bookmarks)
            setBookmarksArray((prev)=>
            {
                return response.bookmarks
            })
        })
    }, [])

    let userStars = []

    for(let i = 1; i < 6; i++)
    {
        userStars.push((<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill={`${i <= profile?.overall ? "yellow" : "gray"}`} class="bi bi-star-fill" viewBox="0 0 16 16">
        <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"/>
        </svg>))
    }

    
    let listingsArr = listingsArray.map((temp)=>
    {
        return <ListingItem setSelected={setSelected} saved={saved} listing={temp}/>
    })
    let bookmarksArr = bookmarksArray.map((temp)=>
    {
        return <ListingItem setSelected={setSelected} saved={saved} listing={temp}/>
    })

    return (
        <div className='colFlex' id="profilePage">
            <Nav/>
            <img className='profileBig' src={`https://webere4870.blob.core.windows.net/react-app/${profile._id}`} alt=""/>
            {isBioShown && <Bio bioStyle={bioStyle} bioForm={profile} inputChange={inputChange} submitProfile={submitProfile} setIsBioShown={setIsBioShown}/>}
            <div className='rowFlex'>
                
                <div className='colFlex'>
                <h1>{profile.name}</h1>
                <div className='rowFlex'>
                    {userStars}
                </div>
                <div className='rowFlex'><p>Bio: {profile.bio}</p>
                <p>Location: {profile.city}, {profile.state}</p></div>
                <input type="file"
                accept="image/*"
                onChange={handleImageChange}
                ref={fileInput}/>
                    <div>
                    <button onClick={handleSubmit}>Change profile picture</button>
                    <button onClick={()=>setIsBioShown((prev)=> !prev)}>Edit Bio</button>
                    </div>
                </div>
            </div>
            <div id='viewToggler'><h3 onClick={()=>setViewToggle("myListings")}>Listings</h3><h3 onClick={()=>setViewToggle("reviews")}>Reviews</h3><h3 onClick={()=>setViewToggle("bookmarks")}>Reviews</h3></div>
            {viewToggle == "myListings" && <div id='gridFlex'>{listingsArr}</div>}
            {viewToggle == "reviews" && <Reviews timeline={profile}/>}
            {viewToggle == "bookmarks" && <div id='gridFlex'>{bookmarksArr}</div>}
        </div>
    )
}