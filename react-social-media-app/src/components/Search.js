import React from 'react'
import Nav from './Nav'
import SearchMap from './SearchMap'
import Geocode from 'react-geocode'
import BigMap from './BigMap'
import SearchForm from './SearchForm'
import ListingItem from './ListingItem'
import Fetch from './../utils/fetch'


Geocode.setApiKey("AIzaSyBM30jMWwV1hwTHUTJcSijFCnu-3XcunUE");
Geocode.setLanguage("en");
Geocode.setRegion("us");
Geocode.enableDebug();


export default function Search(props)
{
    let [mapCenter, setMapCenter] = React.useState({lat: 39.9612, lng: -82.9988})
    let [form, setForm] = React.useState({city: "Findlay", state: "OH", price: "0"})

    let [listings, setListings] = React.useState([])

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
      listingsArray.push(<ListingItem key={temp.address} listing={temp}/>)
    }

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
    }, [form])
    return (<div className='rowFlex'>
        <Nav/>
        <BigMap mapCenter={mapCenter} setMapCenter={setMapCenter}/>
        <SearchForm  getListings={getListings} form={form} setForm={setForm} handleState={handleState} />
        <div id='listingBox'>
          {listingsArray}
        </div>
        
    </div>)
}