import React from 'react'
import Nav from './Nav'
import UserContext from './Context'
import {useNavigate} from 'react-router-dom'
import axios from 'axios'
import Bio from './Bio'
import Map from './Map'
import AuthFetch from './../utils/authFetch'
import Fetch from './../utils/fetch'
import ListingItem from './ListingItem'
import Reviews from './Reviews'
import Subscribe from './Subscribe'
import $ from 'jquery'
import { useAuth0 } from '@auth0/auth0-react'
import { Link } from 'react-router-dom'
import ReviewPortal from './ReviewPortal'
import CustomProfileCard from './CustomProfileCard'

import Portal from './Portal'
const { BlobServiceClient, StorageSharedKeyCredential } = require("@azure/storage-blob");


export default function Profile(props)
{
    
     
     let [isBioShown, setIsBioShown] = React.useState(false) 
     const {user} = useAuth0()
     let [reviewProfile, setReviewProfile] = React.useState()
     let [togglePortal, setTogglePortal] = React.useState(false)
    const getAccessToken = useAuth0().getAccessTokenSilently
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


  const [background, setBackground] = React.useState({
    imagePreviewUrl: "", 
    picFile: null
 })
 let backgroundInput = React.createRef();
 const handleBackgroundChange = e => {
    e.preventDefault();
    let reader = new FileReader();
    let inFile = e.target.files[0];
    reader.onloadend = () => {
       setBackground({...background, 
          picFile: inFile, 
          imagePreviewUrl: reader.result
       })
    };
reader.readAsDataURL(inFile);
 };
     

    let [profile, setProfile] = React.useState({})
    let [viewToggle, setViewToggle] = React.useState("myListings")
    let [listingsArray, setListingsArray] = React.useState([])
    let [bookmarksArray, setBookmarksArray] = React.useState([])
    let [selected, setSelected] = React.useState({})
    let [saved, setSaved] = React.useState([])
    let [tenantRequestsToMe, setTenantRequestsToMe] = React.useState([])

    let navigate = useNavigate()

    const inputChange = async (evt) =>
    {
        setProfile((prev)=>
        {
            return {...prev, [evt.currentTarget.name]: [evt.currentTarget.value]}
        })
    }


    function createStripe(evt)
    {
        AuthFetch("stripe/account", {method: "POST", headers: {"Content-Type": "application/json", "x-access-token": user?.jwt}, body: JSON.stringify({success: true})}, getAccessToken).then((response)=>
        {
            window.open(response.link, "_blank")
        })
    }

    const submitProfile = async(evt)=>
    {
        let response = await AuthFetch("profile", {method: "POST", headers:{"x-access-token": user?.jwt, "Content-Type": "application/json"}, body: JSON.stringify(profile)}, getAccessToken)
        
        setProfile((prev)=>
        {
            return response.profile
        })
    }

console.log(user)
    const handleSubmit = async() => {
        let config = {
            headers: {
              "x-access-token": user?.jwt,
            }
          }
          
          var fd = new FormData();
          fd.append("avatar", values.picFile, "temp.jpg");
        // response stores the response back from the API
        let response = await axios.post(`http://localhost:5000/profilePicture`, fd, {
            headers: {
              'x-access-token': user?.jwt, // optional
              'Content-Type': 'multipart/form-data'
            },
          })
        .catch(error => {
           alert("Error occurred while uploading picture, try uploading a smaller image size or try again later.")
           return;
     });
    }
    async function submitBackground()
    {
        let config = {
            headers: {
              "x-access-token": user?.jwt,
            }
          }
          
          var fd = new FormData();
          
          fd.append("avatar", background.picFile, "temp.jpg");
        // response stores the response back from the API
        let response = await axios.post(`http://localhost:5000/backgroundPicture`, fd, {
            headers: {
              'x-access-token': user?.jwt, // optional
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
        AuthFetch("profile", {method: "GET",headers: {"x-access-token": user?.jwt}}, getAccessToken).then((response)=>
        {
            console.log(response)
            setProfile(response.user)
            setSaved(response.user.saved)
        })
    }, [])

    React.useEffect(()=>
    {
        
        try
        {
            AuthFetch("savedList", {method: "GET", headers: {"x-access-token": user?.jwt}}, getAccessToken).then((response)=>
            {
                console.log(response)
            })
            AuthFetch("tenantRequests", {method: "GET"}, getAccessToken).then((response)=>
            {
                console.log(response)
                setTenantRequestsToMe(response.leases)
            })
        }
        catch(e)
        {

        }    
        
        Fetch("userListings/"+user.email, {method: "GET"}).then((response)=>
        {
            setListingsArray((prev)=>
            {
                return response.listings
            })
        })
        AuthFetch("bookmarks", {method: "GET", headers: {"x-access-token": user?.jwt}}, getAccessToken).then((response)=>
        {
            console.log("Bookmarks", response.bookmarks)
            setBookmarksArray((prev)=>
            {
                return response.bookmarks
            })
        })
    }, [])

    React.useEffect(()=>
    {
        if(background.picFile)
        {
            submitBackground()
        }
    }, [background])

    React.useEffect(()=>
    {
        if(values.picFile)
        {
            handleSubmit()
        }
    }, [values])

    React.useEffect(()=>
    {
        if(reviewProfile)
        {
            setTogglePortal(true)
        }
        else{
            setTogglePortal(false)
        }
    }, [reviewProfile])

    React.useEffect(()=>
    {
        if(!togglePortal)
        {
            setReviewProfile(null)
        }
    }, [togglePortal])
    console.log(togglePortal)
    
    let listingsArr = listingsArray?.map((temp)=>
    {
        return <ListingItem setSelected={setSelected} saved={saved} listing={temp}/>
    })
    let bookmarksArr = bookmarksArray?.map((temp)=>
    {
        return <ListingItem setSelected={setSelected} saved={saved} listing={temp}/>
    })

    console.log(tenantRequestsToMe)
    let tenantRequests = tenantRequestsToMe?.map((temp)=>
    {
        <CustomProfileCard tab={"tenantRequests"}>
            <div className='rowFlex'>
                <p>{temp.owner}</p>
                <p>{temp.property}</p>
            </div>
        </CustomProfileCard>
    })

    console.log(profile)

    return (
        <div className='colFlex' id="profilePage">
           
            {togglePortal &&
            <Portal open={togglePortal} setIsOpen={setTogglePortal}>
            <ReviewPortal reviewProfile={reviewProfile}/>
            </Portal>}
            <Nav/>
            <div id="topDiv">
            <div id="backgroundPic" style={{backgroundImage: `url(https://webere4870.blob.core.windows.net/react-app/bg${profile._id})`}}>
                <input type="file" ref={backgroundInput} id="bgDialogue" style={{display: "none"}} onChange={handleBackgroundChange}/>
                <div className="userBubbles" id='camera' onClick={()=>$("#bgDialogue").trigger("click")}>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="white" className="bi bi-camera-fill" viewBox="0 0 16 16">
                <path d="M10.5 8.5a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0z"/>
                <path d="M2 4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-1.172a2 2 0 0 1-1.414-.586l-.828-.828A2 2 0 0 0 9.172 2H6.828a2 2 0 0 0-1.414.586l-.828.828A2 2 0 0 1 3.172 4H2zm.5 2a.5.5 0 1 1 0-1 .5.5 0 0 1 0 1zm9 2.5a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0z"/>
                </svg>
                </div>
            </div>
            <div className='coverBubble'>
            <img className='profileBig' src={user.picture} alt=""/>
            <div id="svgProfile" onClick={()=>$("#profileSelect").trigger("click")}>
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="white" className="bi bi-plus" viewBox="0 0 16 16">
  <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"/>
</svg>
            </div>
            </div>
            
            {isBioShown && <Bio bioStyle={bioStyle} bioForm={profile} inputChange={inputChange} submitProfile={submitProfile} setIsBioShown={setIsBioShown}/>}
            <div className='rowFlex'>
                
                <div className='colFlex'>
                <h1>{profile.name}</h1>
                
                
                <input type="file"
                accept="image/*"
                onChange={handleImageChange}
                style={{display: "none"}}
                id="profileSelect"
                ref={fileInput}/>
                    <div>
                    {!profile.stripe &&  <button onClick={(evt)=>createStripe(evt)}>Create Stripe Account</button>}

                    <Link to={"https://billing.stripe.com/p/login/6oEg1DfVlfsD7scdQQ"}><button>Setup Customer Account</button></Link>
                    <button onClick={()=>setIsBioShown((prev)=> !prev)}>Edit Bio</button>
                    </div>
                </div>
            </div>
            <div id='viewToggler'><p id="myListingsP" className={viewToggle == "myListings" ? "underlinedP" : ""} onClick={()=>setViewToggle("myListings")}>Listings</p><p className={viewToggle == "reviews" ? "underlinedP" : ""} id="reviewsP" onClick={()=>setViewToggle("reviews")}>Reviews</p><p className={viewToggle == "bookmarks" ? "underlinedP" : ""} id='bookmarksP' onClick={()=>setViewToggle("bookmarks")}>Saved Listings</p>
            <p className={viewToggle == "subscribers" ? "underlinedP" : ""} id='bookmarksP' onClick={()=>setViewToggle("subscribers")}>Subscribers</p>
            <p className={viewToggle == "subscriptions" ? "underlinedP" : ""} id='bookmarksP' onClick={()=>setViewToggle("subscriptions")}>Subscriptions</p>
            <p className={viewToggle == "myRequests" ? "underlinedP" : ""} id='bookmarksP' onClick={()=>setViewToggle("myRequests")}>My Requests</p>
            <p className={viewToggle == "tenantRequests" ? "underlinedP" : ""} id='bookmarksP' onClick={()=>setViewToggle("tenantRequests")}>Tenant Requests</p>
            </div>
            </div>
            <div id="bottomDiv">
                <div id="scrollDiv">
                    {viewToggle == "myListings" && <div id='gridFlex'>{listingsArr}</div>}
                    {viewToggle == "reviews" && <Subscribe userList={profile?.availableReviews} setReviewProfile={setReviewProfile} tab={"reviews"}/>}
                    {viewToggle == "bookmarks" && <div id='gridFlex'>{bookmarksArr}</div>}
                    {viewToggle == "subscribers" && <Subscribe userList={profile?.subscribers}>
                        <p>howdy</p>
                        </Subscribe>}
                    {viewToggle == "subscriptions" && <Subscribe userList={profile?.subscriptions}>
                            <h1>Howdy</h1>
                        </Subscribe>}
                    {viewToggle == "myRequests" && <Subscribe userList={profile?.myRequests} tab={"myRequests"}/>}
                    {viewToggle == "tenantRequests" && tenantRequests}
                </div>
            </div>
        </div>
    )
}