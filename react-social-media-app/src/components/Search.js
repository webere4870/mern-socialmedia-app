import React from 'react'
import Nav from './Nav'
import SearchMap from './SearchMap'
import Geocode from 'react-geocode'
import BigMap from './BigMap'
import SearchForm from './SearchForm'
import ListingItem from './ListingItem'
import Fetch from './../utils/fetch'
import { GoogleMap, LoadScript, MarkerF, InfoWindow } from '@react-google-maps/api';
import BigListing from './BigListing'
import SlideShow from './SlideShow'
import UserContext from './Context'
import QueryString from 'query-string'

Geocode.setApiKey("AIzaSyBM30jMWwV1hwTHUTJcSijFCnu-3XcunUE");
Geocode.setLanguage("en");
Geocode.setRegion("us");
Geocode.enableDebug();


export default function Search(props)
{
    let {city, state, lat, lng} = QueryString.parse(window.location.search)
    let [mapCenter, setMapCenter] = React.useState({lat: lat, lng: lng})
    let [form, setForm] = React.useState({city: "Findlay", state: "OH", price: "0"})
    let [user, setUser] = React.useContext(UserContext)
    let [selected, setSelected] = React.useState({})
    let [listings, setListings] = React.useState([])
    let [sideToggle, setSideToggle] = React.useState(true)
    let [saved, setSaved] = React.useState([])
    
    const onSelect = item => {
      console.log("selected budy", item)
      setSelected(item);
      setSideToggle((prev)=>
      {
        if(sideToggle)
        {
          return !prev
        }
        return prev
      })
      setMapCenter({lat: selected.lat, lng: selected.lng})
    }
    

    function handleState(evt)
    {
        let namer = evt.currentTarget.name
        let val = evt.currentTarget.value
        setForm((prev)=>
        {
          return {...prev, [namer]: val}
        })
    }

    async function getListings()
    {
      console.log(form)
      let response = await Fetch("listings", {method: "post", headers:{'Content-Type': 'application/json'}, body: JSON.stringify(form)})
      console.log(response)
      setListings((prev)=>
      {
        return response.listings
      })
    }

    let listingsArray = []

    for(let temp of listings)
    {
      listingsArray.push(<ListingItem key={temp.address} setSideToggle={setSideToggle} listing={temp} saved={saved} setSelected={setSelected}/>)
    }

    let markersArray = listings.map(item => {
      return (
      <MarkerF key={item.name} 
        position={{lat: item.lat, lng: item.lng}}
        onClick={() => onSelect(item)}
      />
      )
    })

    console.log(selected)

    console.log(listingsArray)
    
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
              
            }
        );
        if(user)
        {
          Fetch("savedList", {method: "GET", headers: {"x-access-token": user.jwt}}).then((response)=>
          {
            setSaved((prev)=>
            {
                return response.saved
            })
          })
        }
    }, [form])
    return (<div id='searchPage'>
        <Nav/>
        
        <BigMap mapCenter={mapCenter} setMapCenter={setMapCenter} markersArray={markersArray}/>
        {/* {sideToggle && <SearchForm  getListings={getListings} form={form} setForm={setForm} handleState={handleState} listingsArray={listingsArray} sideToggle={sideToggle} setSideToggle={setSideToggle}/>} */}
        {!sideToggle && <BigListing selected={selected} setSelected={setSelected} listingsArray={listingsArray} setSideToggle={setSideToggle}/>}
        <div id="sideToggle">
          {listingsArray}
        </div>
    </div>)
}