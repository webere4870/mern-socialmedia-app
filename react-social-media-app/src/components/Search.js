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
import StateSelect from './StateSelect'
import * as Icon from 'react-bootstrap-icons'
import CitySelect from './CitySelect'

Geocode.setApiKey("AIzaSyBM30jMWwV1hwTHUTJcSijFCnu-3XcunUE");
Geocode.setLanguage("en");
Geocode.setRegion("us");
Geocode.enableDebug();


export default function Search(props)
{
    let {city, state, lat, lng} = QueryString.parse(window.location.search)
    let [mapCenter, setMapCenter] = React.useState({lat: lat, lng: lng})
    let [form, setForm] = React.useState({city: "", state: "", price: "0"})
    let [user, setUser] = React.useContext(UserContext)
    let [selected, setSelected] = React.useState({})
    let [listings, setListings] = React.useState([])
    let [sideToggle, setSideToggle] = React.useState(true)
    let [saved, setSaved] = React.useState([])
    let [filterObj, setFilterObj] = React.useState({state: false, city: false, cost: false})
    let [filterValues, setFilterValues] = React.useState({state: "", city: "", cost: ""})
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

    function toggleFilters(names)
    {
      let name = names
      setFilterObj((prev)=>
      {
        let newObj = {}
        for(let [key, val] of Object.entries(prev))
        {
          if(key == name)
          {
            newObj[name] = !val
          }
          else{
            newObj[key] = false
          }
        }
        return newObj
      })
    }
    console.log("Filter obj",filterObj)

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
      let response = await Fetch("listings", {method: "POST", headers:{'Content-Type': 'application/json'}, body: JSON.stringify(filterValues)})
      console.log(response)
      setListings((prev)=>
      {
        return [...response.listings]
      })
    }

    let listingsArray = []
    console.log(listings)
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
        Geocode.fromAddress(`${filterValues.city}, ${filterValues.state}`).then(
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

    React.useEffect(()=>
    {
      console.log("Retrig")
      getListings().then(()=>
      {
        console.log("Suc")
      })
    },[filterValues])

    
    console.log(filterValues)
    return (<div className='App' id="searchPage" style={{flexDirection: "row", flexWrap: "wrap", gap: "30px"}}>
        <Nav/>

        {filterObj.state && <StateSelect filterValues={filterValues} setFilterValues={setFilterValues}/>}
        {filterObj.city && <CitySelect filterValues={filterValues} setFilterValues={setFilterValues}/>}
        {/* <BigMap mapCenter={mapCenter} setMapCenter={setMapCenter} markersArray={markersArray}/> */}
        {/* {sideToggle && <SearchForm  getListings={getListings} form={form} setForm={setForm} handleState={handleState} listingsArray={listingsArray} sideToggle={sideToggle} setSideToggle={setSideToggle}/>} */}
        {!sideToggle && <BigListing selected={selected} setSelected={setSelected} listingsArray={listingsArray} setSideToggle={setSideToggle}/>}
        
        <div id="searchContainer">
          <div id="filterNav">
            <div className="colFlex filterOption" name="state" onClick={()=>toggleFilters("state")}>
              <Icon.PinMap color='rgba(128,128,128,.5)' size={"30"} fontWeight={"lighter"} />
              <p>State</p>
            </div>
            <div className="colFlex filterOption" name="state" onClick={()=>toggleFilters("city")}>
              <Icon.PinMap color='rgba(128,128,128,.5)' size={"30"} fontWeight={"lighter"} />
              <p>City</p>
            </div>
          </div>
          <div id='searchSub'>
            {listingsArray.length == 0 && filterObj.state==false && filterObj.city==false && filterObj.cost == false && <div className='rowFlex'><Icon.Search color='gray' size={"20"}/><p style={{margin: "0 10px"}}>No listings found</p></div>}
            {listingsArray}
          </div>
          
        </div>
        
        
    </div>)
}