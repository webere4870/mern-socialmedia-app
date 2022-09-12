import React from 'react'
import Nav from './Nav'
import SearchMap from './SearchMap'
import Geocode from 'react-geocode'
import BigMap from './BigMap'
import ListingForm from './ListingForm'
import UserContext from './Context'
import axios from 'axios'
import Fetch from './../utils/fetch'
import {useNavigate} from 'react-router-dom'

Geocode.setApiKey("AIzaSyBM30jMWwV1hwTHUTJcSijFCnu-3XcunUE");
Geocode.setLanguage("en");
Geocode.setRegion("us");
Geocode.enableDebug();


export default function Listing(props)
{
    let [mapCenter, setMapCenter] = React.useState({lat: 39.9612, lng: -82.9988})
    let [city, setCity] = React.useState("Findlay")
    let [state, setState] = React.useState("OH")
    let [zip, setZip] = React.useState("45840")
    let [address, setAddress] = React.useState("890 Deer Trail Court")
    let [error, setError] = React.useState("")
    const [values, setValues] = React.useState([])
     let fileInput = React.createRef();
     const handleImageChange = e => {
        e.preventDefault();
        
        let inFile = e.target.files;
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
          console.log(profile)
          var fd = new FormData();
          for(let file of values)
          {
            fd.append("avatar", file.picFile, "temp.jpg");
          }
          fd.append("state", address)
          fd.append("state", city)
          fd.append("state", state)
          fd.append("state", zip)
        // response stores the response back from the API
        let response = await axios.post(`http://localhost:5000/listing`, fd, {
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

    function handleState(evt)
    {
        let namer = evt.currentTarget.name
        let val = evt.currentTarget.value
        namer == "state" ? setState(val) : setCity(val)
    }
    
    React.useEffect(()=>
    {
        Geocode.fromAddress(`${address} ${city}, ${state} ${zip}`).then(
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
    }, [city, state])
    return (<div className='rowFlex'>
        <Nav/>
        <BigMap city={city} state={state} setCity={setCity} setState={setState} mapCenter={mapCenter} setMapCenter={setMapCenter}/>
        <ListingForm handleState={handleState} address={address} city={city} state={state} zip={zip} handleImageChange={handleImageChange} fileInput={fileInput} handleSubmit={handleSubmit}/>
    </div>)
}