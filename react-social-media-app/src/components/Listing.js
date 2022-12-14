import React from 'react'
import Nav from './Nav'
import SearchMap from './SearchMap'
import Geocode from 'react-geocode'
import BigMap from './BigMap'
import ListingForm from './ListingForm'
import ListingItem from './ListingItem'
import UserContext from './Context'
import axios from 'axios'
import Fetch from './../utils/fetch'
import {useNavigate} from 'react-router-dom'
import {useAuth0} from '@auth0/auth0-react'
import AuthFetch from './../utils/authFetch'

Geocode.setApiKey("AIzaSyBM30jMWwV1hwTHUTJcSijFCnu-3XcunUE");
Geocode.setLanguage("en");
Geocode.setRegion("us");
Geocode.enableDebug();


export default function Listing(props)
{
    const {user, getAccessTokenSilently} = useAuth0()
    let [mapCenter, setMapCenter] = React.useState({lat: 39.9612, lng: -82.9988})
    let [error, setError] = React.useState("")
    let [form, setForm] = React.useState({city: "Findlay", state: "OH", zip: "45840", address: "890 Deer Trail Court", price: "0"})
    const [values, setValues] = React.useState([])
     let fileInput = React.createRef();
     const handleImageChange = e => {
        e.preventDefault();
        
        let inFile = e.target.files;
        console.log(inFile)
        for(let file of inFile)
        {
            let reader = new FileReader();
            reader.onloadend = () => {
                setValues((prev)=>
                {
                    return [...prev, {picFile: file, 
                        imagePreviewUrl: reader.result}]
                })
             };
            reader.readAsDataURL(file);
                };
        }
        
  // Call the API Backend, will describe this later
     

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
        let response = await AuthFetch("profile", {method: "POST", headers:{"x-access-token": user?.jwt, "Content-Type": "application/json"}, body: JSON.stringify(profile)}, getAccessTokenSilently)
        
        setProfile((prev)=>
        {
            return response.profile
        })
    }


    const handleSubmit = async() => {
          console.log(profile)
          var fd = new FormData();
          for(let file of values)
          {
            fd.append("avatar", file.picFile, "temp.jpg");
          }
          fd.append("city", form.city)
          fd.append("state", form.state)
          fd.append("address", form.address)
          fd.append("zip", form.zip)
          fd.append("price", form.price)
          Geocode.fromAddress(`${form.address} ${form.city}, ${form.state} ${form.zip}`).then(
            async (response) => {
              const { lat, lng } = response.results[0].geometry.location;
                fd.append("lat", lat)
                fd.append("lng", lng)
                let resp = await axios.post(`http://localhost:5000/listing`, fd, {
            headers: {
              'x-access-token': user?.jwt, // optional
              'Content-Type': 'multipart/form-data',
              "Authorization": "Bearer " + await getAccessTokenSilently()
            },
          })
        .catch(error => {
           alert("Error occurred while uploading picture, try uploading a smaller image size or try again later.")
           return;
     });
            },
            (error) => {
                console.log(error)
              setError(error)
            }
        );
          
        // response stores the response back from the API

        
     }
    React.useEffect(()=>
    {
        (async function()
        {
            let userProfile = await AuthFetch("http://localhost:5000/profile",{headers: {'x-access-token': user?.jwt}}, getAccessTokenSilently)
            let json = await userProfile.json()
            console.log(json)
            setProfile((prev)=>
            {
                return json.user
            })
        })()
        
    }, [])

    function handleState(evt)
    {
        console.log("Here stater")
        let namer = evt.currentTarget.name
        let val = evt.currentTarget.value
        setForm((prev)=>
        {
            return {...prev, [namer]: val}
        })
    }
    
    React.useEffect(()=>
    {
        Geocode.fromAddress(`${form.city}, ${form.state}`).then(
            (response) => {
              const { lat, lng } = response.results[0].geometry.location;
              setMapCenter((prev)=>
              {
                return {lat: lat, lng:lng}
              })
            },
            (error) => {
              setError("City does not exist")
            }
        );
    }, [form])

    
    return (<div className='rowFlex'>
        <Nav/>
        <BigMap  mapCenter={mapCenter} setMapCenter={setMapCenter}/>
        <ListingForm handleState={handleState} form={form} handleImageChange={handleImageChange} fileInput={fileInput} handleSubmit={handleSubmit} error={error}/>
    </div>)
}